import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { config } from "../config/config.ts";

let io: SocketIOServer | null = null;

export function attachExecutionSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    path: "/ws/executions",
    cors: {
      origin: config.isProduction ? process.env.CLIENT_URL : "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const workflowId = socket.handshake.query.workflowId;

    if (typeof workflowId !== "string" || !workflowId) {
      socket.disconnect(true);
      return;
    }

    socket.join(roomFor(workflowId));
  });

  return io;
}

function roomFor(workflowId: string) {
  return `workflow:${workflowId}`;
}

export type ExecutionEvent = {
  type:
    "node:running" | "node:success" | "node:failed" | "execution:started" | "execution:finished";
  executionId: string;
  workflowId: string;
  nodeId?: string;
  data?: unknown;
  error?: string;
};

export function broadcastExecutionEvent(event: ExecutionEvent) {
  if (!io) return;
  io.to(roomFor(event.workflowId)).emit("execution:event", event);
}
