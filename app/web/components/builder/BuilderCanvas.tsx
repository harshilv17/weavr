"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { DRAG_DATA_FORMAT, NODE_DEFS, type BuilderNodeCategory } from "./nodeTypes";
import WorkflowNode from "./WorkflowNode";
import type { NodeRunStatus } from "@/hooks/useExecutionSocket";

let nodeIdCounter = 0;
function nextNodeId() {
  nodeIdCounter += 1;
  return `node-${nodeIdCounter}`;
}

function bumpNodeIdCounter(existingNodes: Node[]) {
  const maxExisting = existingNodes.reduce((max, node) => {
    const match = /^node-(\d+)$/.exec(node.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  nodeIdCounter = Math.max(nodeIdCounter, maxExisting);
}

function labelForType(type: BuilderNodeCategory) {
  return NODE_DEFS.find((n) => n.type === type)?.label ?? type;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const NODE_TYPES = { workflow: WorkflowNode };

export interface BuilderCanvasHandle {
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  getGraph: () => { nodes: Node[]; edges: Edge[] };
}

interface BuilderCanvasProps {
  onSelectNode: (node: Node | null) => void;
  canvasRef: React.MutableRefObject<BuilderCanvasHandle | null>;
  initialGraph?: { nodes: Node[]; edges: Edge[] } | null;
  nodeStatuses?: Record<string, NodeRunStatus>;
  locked?: boolean;
  onNodesChange?: (nodes: Node[]) => void;
}

export default function BuilderCanvas({
  onSelectNode,
  canvasRef,
  initialGraph,
  nodeStatuses,
  locked,
  onNodesChange: onNodesReport,
}: BuilderCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const renderedNodes = useMemo(() => {
    if (!nodeStatuses || Object.keys(nodeStatuses).length === 0) return nodes;
    return nodes.map((node) =>
      nodeStatuses[node.id]
        ? { ...node, data: { ...node.data, runStatus: nodeStatuses[node.id] } }
        : node,
    );
  }, [nodes, nodeStatuses]);

  useEffect(() => {
    if (!initialGraph) return;
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
    bumpNodeIdCounter(initialGraph.nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGraph]);

  useEffect(() => {
    canvasRef.current = {
      updateNodeData: (nodeId, data) => {
        setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
      },
      getGraph: () => ({ nodes, edges }),
    };
  });

  useEffect(() => {
    onNodesReport?.(nodes);
  }, [nodes, onNodesReport]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => onSelectNode(node),
    [onSelectNode],
  );

  const onPaneClick = useCallback(() => onSelectNode(null), [onSelectNode]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;

      const targetNode = nodes.find((n) => n.id === connection.target);

      if (targetNode?.data?.category === "trigger") return false;
      if (edges.some((e) => e.source === connection.source)) return false;
      if (edges.some((e) => e.target === connection.target)) return false;

      return true;
    },
    [nodes, edges],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const category = event.dataTransfer.getData(DRAG_DATA_FORMAT) as BuilderNodeCategory;
      if (!category || !reactFlowInstance || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: nextNodeId(),
        type: "workflow",
        position,
        data: { label: labelForType(category), category },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div
      ref={wrapperRef}
      className={`h-full w-full flex-1 bg-[#0a0a0d] ${locked ? "pointer-events-none opacity-90" : ""}`}
      aria-disabled={locked}
    >
      <ReactFlow
        nodes={renderedNodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodesDraggable={!locked}
        nodesConnectable={!locked}
        elementsSelectable={!locked}
        panOnDrag={!locked}
        zoomOnScroll={!locked}
        defaultEdgeOptions={{ style: { stroke: "rgba(255,255,255,0.25)", strokeWidth: 1.5 } }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="rgba(255,255,255,0.08)"
        />
        <Controls className="border-white/8! bg-[#111114]! [&>button]:border-white/8! [&>button]:bg-[#111114]! [&>button]:fill-white/60! [&>button]:text-white/60!" />
        <MiniMap
          pannable
          zoomable
          className="bg-[#111114]!"
          maskColor="rgba(10,10,13,0.6)"
          nodeColor="rgba(255,255,255,0.2)"
        />
      </ReactFlow>
    </div>
  );
}
