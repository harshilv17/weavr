import {
  getWorkflowById,
  getTriggersByWorkflowId,
  getIntegrationsByWorkflowId,
  updateWorkflowSchedule,
  getTriggerByWebhookToken,
} from "../workflows/workflow.repo.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import { triggers } from "../../db/schemas/triggers.schema.ts";
import { integrations } from "../../db/schemas/integrations.schema.ts";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import {
  globalExecutor,
  type ExecutorEdge,
  type ExecutorNode,
} from "../../executors/global.executor.ts";
import { startWorkflowSchedule, stopWorkflowSchedule } from "../../jobs/workflowExecution.job.ts";
import {
  createExecution,
  completeExecution,
  createNodeExecution,
  completeNodeExecution,
} from "./execution.repo.ts";
import { decryptCredentials } from "../../utils/credentialCrypto.ts";

export const MIN_SCHEDULE_INTERVAL_SECONDS = 60;

type GraphNode = { id: string; data?: Record<string, unknown> };
type GraphJson = { nodes: GraphNode[]; edges: unknown[] };

export const buildExecutionGraph = async (
  workflowId: number,
  userId: number,
  triggerOverrideData?: Record<string, any>,
) => {
  try {
    const workflow = (await getWorkflowById(workflowId)) as
      typeof workflows.$inferSelect | undefined;

    if (!workflow) {
      return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
    }

    if (workflow.userId !== userId) {
      return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
    }

    const graphJson = (workflow.graphJson ?? { nodes: [], edges: [] }) as GraphJson;
    const edges = graphJson.edges ?? [];

    const [triggerRows, integrationRows] = await Promise.all([
      getTriggersByWorkflowId(workflowId) as Promise<(typeof triggers.$inferSelect)[] | Error>,
      getIntegrationsByWorkflowId(workflowId) as Promise<
        (typeof integrations.$inferSelect)[] | Error
      >,
    ]);

    if (triggerRows instanceof Error) return triggerRows;
    if (integrationRows instanceof Error) return integrationRows;

    const triggersByNodeId = new Map<string, typeof triggers.$inferSelect>(
      triggerRows.map((t) => [t.nodeId, t]),
    );
    const integrationsByNodeId = new Map<string, typeof integrations.$inferSelect>(
      integrationRows.map((i) => [i.nodeId, i]),
    );

    const nodes: ExecutorNode[] = (graphJson.nodes ?? []).map((node) => {
      const trigger = triggersByNodeId.get(node.id);
      const integration = integrationsByNodeId.get(node.id);

      if (trigger) {
        return {
          id: node.id,
          type: trigger.type,
          // Webhook runs pass the POSTed body here so it's available
          // to downstream nodes; every other trigger uses its stored config.
          config: (triggerOverrideData ?? trigger.configJson) as Record<string, any>,
        };
      }

      if (integration) {
        return {
          id: node.id,
          provider: integration.provider,
          config: decryptCredentials<Record<string, any>>(integration.credentialsJson as string),
        };
      }

      return { id: node.id, config: (node.data ?? {}) as Record<string, any> };
    });

    const triggerNode = nodes.find((node) => !node.provider);
    const triggerRow = triggerNode ? triggersByNodeId.get(triggerNode.id) : undefined;

    if (!triggerRow) {
      return new Error(ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
    }

    return { nodes, edges: edges as ExecutorEdge[], triggerId: triggerRow.id };
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const executeWorkflow = async (
  workflowId: number,
  userId: number,
  executionId: string,
  triggerOverrideData?: Record<string, any>,
) => {
  const graph = await buildExecutionGraph(workflowId, userId, triggerOverrideData);

  if (graph instanceof Error) {
    return graph;
  }

  const executionRow = await createExecution(workflowId, graph.triggerId);
  if (executionRow instanceof Error) {
    return executionRow;
  }

  const nodeExecutionIdByNodeId = new Map<string, number>();
  let executionOutcome: "success" | "failed" = "success";

  try {
    const executionContext = await globalExecutor(
      executionId,
      String(workflowId),
      graph.nodes,
      graph.edges,
      {
        onNodeStart: async (nodeId, nodeType, input) => {
          const nodeExecutionRow = await createNodeExecution(
            executionRow.id,
            nodeId,
            nodeType,
            input,
          );
          if (!(nodeExecutionRow instanceof Error)) {
            nodeExecutionIdByNodeId.set(nodeId, nodeExecutionRow.id);
          }
        },
        onNodeComplete: async (nodeId, status, output) => {
          const nodeExecutionId = nodeExecutionIdByNodeId.get(nodeId);
          if (nodeExecutionId !== undefined) {
            await completeNodeExecution(
              nodeExecutionId,
              status === "success" ? "completed" : "failed",
              output,
            );
          }
        },
        onExecutionComplete: async (status) => {
          executionOutcome = status;
        },
      },
    );

    await completeExecution(
      executionRow.id,
      executionOutcome === "success" ? "completed" : "failed",
    );

    return executionContext;
  } catch (err) {
    await completeExecution(executionRow.id, "failed");
    return err instanceof Error ? err : new Error(String(err));
  }
};

const getOwnedWorkflow = async (workflowId: number, userId: number) => {
  const workflow = (await getWorkflowById(workflowId)) as typeof workflows.$inferSelect | undefined;

  if (!workflow) {
    return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
  }

  if (workflow.userId !== userId) {
    return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
  }

  return workflow;
};

export const startWorkflowScheduleService = async (
  workflowId: number,
  userId: number,
  intervalSeconds: number,
) => {
  if (!Number.isInteger(intervalSeconds) || intervalSeconds < MIN_SCHEDULE_INTERVAL_SECONDS) {
    return new Error(ERROR_MESSAGES.SCHEDULE_INTERVAL_TOO_SHORT);
  }

  const workflow = await getOwnedWorkflow(workflowId, userId);
  if (workflow instanceof Error) {
    return workflow;
  }

  await startWorkflowSchedule({ workflowId, userId }, intervalSeconds);

  const updated = await updateWorkflowSchedule(workflowId, true, intervalSeconds);
  if (updated instanceof Error) {
    return updated;
  }

  return updated;
};

export const stopWorkflowScheduleService = async (workflowId: number, userId: number) => {
  const workflow = await getOwnedWorkflow(workflowId, userId);
  if (workflow instanceof Error) {
    return workflow;
  }

  await stopWorkflowSchedule(workflowId);

  const updated = await updateWorkflowSchedule(workflowId, false, workflow.scheduleIntervalSeconds);
  if (updated instanceof Error) {
    return updated;
  }

  return updated;
};

export const resolveWebhookTrigger = async (webhookToken: string) => {
  const trigger = (await getTriggerByWebhookToken(webhookToken)) as
    typeof triggers.$inferSelect | undefined;

  if (trigger instanceof Error) {
    return trigger;
  }

  if (!trigger || trigger.type !== "webhook") {
    return new Error(ERROR_MESSAGES.WEBHOOK_NOT_FOUND);
  }

  const workflow = (await getWorkflowById(trigger.workflowId)) as
    typeof workflows.$inferSelect | undefined;

  if (!workflow) {
    return new Error(ERROR_MESSAGES.WEBHOOK_NOT_FOUND);
  }

  return { workflowId: workflow.id, userId: workflow.userId };
};
