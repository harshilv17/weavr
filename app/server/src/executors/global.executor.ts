import { NodeType, type WorkflowNode } from "../types/types.ts";
import { executeHttpNode } from "./http.executor.ts";
import { executeEmailNode } from "./email.executor.ts";
import { executeSlackNode } from "./slack.executor.ts";
import { executeAnthropicNode } from "./anthropic.executor.ts";
import { executeGroqNode } from "./groq.executor.ts";
import { executeOpenAINode } from "./openai.executor.ts";
import { resolveTemplate } from "../utils/templateResolver.ts";
import { broadcastExecutionEvent } from "../ws/executionSocket.ts";

export type ExecutorNode = {
  id: string;
  type?: string;
  provider?: string;
  config: Record<string, any>;
};

export type ExecutorEdge = {
  id: string;
  source: string;
  target: string;
};

export type NodeStatus = "pending" | "running" | "success" | "failed";

export type ExecutionContext = {
  executionId: string;
  workflowId: string;

  trigger: {
    nodeId: string;
    type: string;
    data: Record<string, any>;
  } | null;

  nodeOutputs: Record<string, unknown>;
  nodeStatus: Record<string, NodeStatus>;

  startedAt: string;
  finishedAt: string | null;
};

function topologicalSort(nodes: ExecutorNode[], edges: ExecutorEdge[]): ExecutorNode[] {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const inDegree = new Map<string, number>(nodes.map((node) => [node.id, 0]));
  const adjacency = new Map<string, string[]>(nodes.map((node) => [node.id, []]));

  for (const edge of edges) {
    if (!nodesById.has(edge.source) || !nodesById.has(edge.target)) continue;
    adjacency.get(edge.source)!.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue = nodes.filter((node) => inDegree.get(node.id) === 0).map((node) => node.id);
  const order: ExecutorNode[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    order.push(nodesById.get(nodeId)!);

    for (const neighborId of adjacency.get(nodeId) ?? []) {
      const remaining = (inDegree.get(neighborId) ?? 0) - 1;
      inDegree.set(neighborId, remaining);
      if (remaining === 0) queue.push(neighborId);
    }
  }

  // Cycles or disconnected nodes: append whatever the sort couldn't reach, in original order.
  if (order.length < nodes.length) {
    const visited = new Set(order.map((node) => node.id));
    for (const node of nodes) {
      if (!visited.has(node.id)) order.push(node);
    }
  }

  return order;
}

export type ExecutionHooks = {
  onExecutionStart?: () => Promise<void>;
  onNodeStart?: (nodeId: string, nodeType: string, input: Record<string, any>) => Promise<void>;
  onNodeComplete?: (nodeId: string, status: "success" | "failed", output: unknown) => Promise<void>;
  onExecutionComplete?: (status: "success" | "failed") => Promise<void>;
};

export async function globalExecutor(
  executionId: string,
  workflowId: string,
  nodes: ExecutorNode[],
  edges: ExecutorEdge[],
  hooks: ExecutionHooks = {},
): Promise<ExecutionContext> {
  const triggerNode = nodes.find((node) => !node.provider);
  const nodeIdsWithEdges = new Set(edges.flatMap((edge) => [edge.source, edge.target]));

  const executionContext: ExecutionContext = {
    executionId,
    workflowId,
    trigger: triggerNode
      ? { nodeId: triggerNode.id, type: triggerNode.type ?? "manual", data: triggerNode.config }
      : null,
    // Seeded under a fixed "trigger" key (not the trigger's actual node id,
    // which is dynamic) so any node config can reference {{trigger.<field>}}.
    nodeOutputs: triggerNode ? { trigger: triggerNode.config } : {},
    nodeStatus: {},
    startedAt: new Date().toISOString(),
    finishedAt: null,
  };

  const executionOrder = topologicalSort(nodes, edges);

  broadcastExecutionEvent({ type: "execution:started", executionId, workflowId });
  await hooks.onExecutionStart?.();

  // Record what the trigger received so it shows up in the run log — the
  // trigger node itself never enters the execution loop below.
  if (triggerNode) {
    await hooks.onNodeStart?.(triggerNode.id, triggerNode.type ?? "manual", triggerNode.config);
    executionContext.nodeStatus[triggerNode.id] = "success";
    broadcastExecutionEvent({
      type: "node:success",
      executionId,
      workflowId,
      nodeId: triggerNode.id,
      data: triggerNode.config,
    });
    await hooks.onNodeComplete?.(triggerNode.id, "success", triggerNode.config);
  }

  let executionFailed = false;

  for (const targetNode of executionOrder) {
    // Trigger nodes (and any node with no incoming/outgoing edges) have no executor to run.
    if (!targetNode.provider || !nodeIdsWithEdges.has(targetNode.id)) continue;

    const resolvedConfig = resolveTemplate(
      targetNode.config,
      executionContext.nodeOutputs,
    ) as Record<string, any>;

    const workflowNode: WorkflowNode = {
      id: targetNode.id,
      type: targetNode.provider ?? targetNode.type ?? "",
      data: resolvedConfig,
    };

    executionContext.nodeStatus[targetNode.id] = "running";
    broadcastExecutionEvent({
      type: "node:running",
      executionId,
      workflowId,
      nodeId: targetNode.id,
    });
    await hooks.onNodeStart?.(targetNode.id, workflowNode.type, resolvedConfig);

    try {
      const output = await runNodeExecutor(workflowNode);
      executionContext.nodeOutputs[targetNode.id] = output;
      executionContext.nodeStatus[targetNode.id] = "success";
      broadcastExecutionEvent({
        type: "node:success",
        executionId,
        workflowId,
        nodeId: targetNode.id,
        data: output,
      });
      await hooks.onNodeComplete?.(targetNode.id, "success", output);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      executionContext.nodeStatus[targetNode.id] = "failed";
      executionContext.nodeOutputs[targetNode.id] = { error: errorMessage };
      executionFailed = true;
      broadcastExecutionEvent({
        type: "node:failed",
        executionId,
        workflowId,
        nodeId: targetNode.id,
        error: errorMessage,
      });
      await hooks.onNodeComplete?.(targetNode.id, "failed", { error: errorMessage });
    }
  }

  executionContext.finishedAt = new Date().toISOString();
  broadcastExecutionEvent({
    type: "execution:finished",
    executionId,
    workflowId,
    data: executionContext,
  });
  await hooks.onExecutionComplete?.(executionFailed ? "failed" : "success");

  return executionContext;
}

async function runNodeExecutor(node: WorkflowNode) {
  switch (node.type) {
    case NodeType.HTTP:
      return executeHttpNode(node);

    case NodeType.EMAIL:
      return executeEmailNode(node, {
        host: node.data.host,
        port: node.data.port,
        username: node.data.username,
        password: node.data.password,
      });

    case NodeType.SLACK:
      return executeSlackNode(node, {
        botToken: node.data.botToken,
      });

    case NodeType.ANTHROPIC:
      return executeAnthropicNode(node, {
        apiKey: node.data.apiKey,
      });

    case NodeType.GROQ:
      return executeGroqNode(node, {
        apiKey: node.data.apiKey,
      });

    case NodeType.OPENAI:
      return executeOpenAINode(node, {
        apiKey: node.data.apiKey,
      });

    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}
