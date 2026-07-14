"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "sonner";
import type { Edge, Node } from "reactflow";
import { useMe } from "@/hooks/useMe";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useExecutionSocket } from "@/hooks/useExecutionSocket";
import BuilderTopbar from "@/components/builder/BuilderTopbar";
import NodeSidebar from "@/components/builder/NodeSidebar";
import type { BuilderCanvasHandle } from "@/components/builder/BuilderCanvas";
import NodeConfigPanel from "@/components/builder/NodeConfigPanel";
import NodeOutputTerminal from "@/components/builder/NodeOutputTerminal";
import api from "@/lib/api";

const BuilderCanvas = dynamic(() => import("@/components/builder/BuilderCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-1 items-center justify-center bg-[#0a0a0d]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
    </div>
  ),
});
export default function BuilderPage() {
  const { user, loading, route } = useMe();
  const params = useParams<{ id: string }>();
  const {
    workflow,
    loading: workflowLoading,
    notFound: workflowNotFound,
    refetchScheduleOnly,
  } = useWorkflow(params.id);
  const [saving, setSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [webhookTokensByNodeId, setWebhookTokensByNodeId] = useState<Record<string, string>>({});
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const canvasRef = useRef<BuilderCanvasHandle | null>(null);
  const { nodeStatuses, nodeResponses, runLog, isExecuting } = useExecutionSocket(params.id);

  const router = useRouter();

  const initialGraph = useMemo(() => {
    const graph = workflow?.graphJson as { nodes?: Node[]; edges?: Edge[] } | null | undefined;
    if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return null;
    return { nodes: graph.nodes, edges: graph.edges };
  }, [workflow]);

  async function handleSave() {
    const graph = canvasRef.current?.getGraph();
    if (!graph) return;

    setSaving(true);
    try {
      const response = await api.put<{
        message?: string;
        data?: { triggers?: { nodeId: string; webhookToken: string | null }[] };
      }>(`/v1/workflows/workflows/${params.id}`, { graphJson: graph });
      toast.success(response.data?.message ?? "Workflow saved successfully");

      const savedTriggers = response.data?.data?.triggers;
      if (savedTriggers) {
        const tokens: Record<string, string> = {};
        for (const t of savedTriggers) {
          if (t.webhookToken) tokens[t.nodeId] = t.webhookToken;
        }
        setWebhookTokensByNodeId(tokens);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to save workflow")
        : "Failed to save workflow";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function handleNodeDataChange(nodeId: string, data: Record<string, unknown>) {
    canvasRef.current?.updateNodeData(nodeId, data);
    setSelectedNode((prev) => (prev && prev.id === nodeId ? { ...prev, data } : prev));
  }

  useEffect(() => {
    if (route) {
      router.push("/signin");
    }
    if (user?.isVerified === false) {
      router.push(`/verification/${user.email}`);
    }
  }, [route, user]);

  useEffect(() => {
    if (!params.id) return;
    api
      .get(`/v1/workflows/workflows/${params.id}/triggers`)
      .then((response) => {
        const fetchedTriggers = response.data?.data as
          { nodeId: string; webhookToken: string | null }[] | undefined;
        if (!fetchedTriggers) return;
        const tokens: Record<string, string> = {};
        for (const t of fetchedTriggers) {
          if (t.webhookToken) tokens[t.nodeId] = t.webhookToken;
        }
        setWebhookTokensByNodeId(tokens);
      })
      .catch(() => {
        // best-effort; webhook URL display just won't be pre-filled
      });
  }, [params.id]);

  if (loading || workflowLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0d]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
      </div>
    );
  }

  if (workflowNotFound) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0d]">
      <BuilderTopbar
        workflowName={workflow?.name}
        saving={saving}
        disabled={isExecuting}
        onSave={handleSave}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <BuilderCanvas
            canvasRef={canvasRef}
            onSelectNode={setSelectedNode}
            initialGraph={initialGraph}
            nodeStatuses={nodeStatuses}
            locked={isExecuting}
            onNodesChange={setCurrentNodes}
          />
          {selectedNode ? (
            <NodeConfigPanel
              node={selectedNode}
              workflowId={Number(params.id)}
              onChange={handleNodeDataChange}
              onClose={() => setSelectedNode(null)}
              disabled={isExecuting}
              scheduleEnabled={workflow?.scheduleEnabled ?? false}
              scheduleIntervalSeconds={workflow?.scheduleIntervalSeconds ?? null}
              onScheduleChange={refetchScheduleOnly}
              webhookToken={webhookTokensByNodeId[selectedNode.id]}
            />
          ) : (
            <NodeSidebar disabled={isExecuting} />
          )}
        </div>
        <NodeOutputTerminal
          node={selectedNode}
          response={selectedNode ? nodeResponses[selectedNode.id] : undefined}
          runLog={runLog}
          allNodes={currentNodes.length > 0 ? currentNodes : (initialGraph?.nodes ?? [])}
        />
      </div>
    </div>
  );
}
