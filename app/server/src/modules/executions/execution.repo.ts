import { db } from "../../config/db.ts";
import { execution, nodeExecution } from "../../db/schemas/execution.schema.ts";
import { eq, desc } from "drizzle-orm";

type ExecutionRow = typeof execution.$inferSelect;
type NodeExecutionRow = typeof nodeExecution.$inferSelect;

export const createExecution = async (
  workflowId: number,
  triggerId: number,
): Promise<ExecutionRow | Error> => {
  try {
    const result = await db
      .insert(execution)
      .values({
        workflowId,
        triggerId,
        status: "running",
        startedAt: new Date(),
      })
      .returning();
    return result[0] ?? new Error("Failed to create execution");
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const completeExecution = async (
  executionId: number,
  status: "completed" | "failed",
): Promise<ExecutionRow | Error> => {
  try {
    const result = await db
      .update(execution)
      .set({ status, completedAt: new Date(), updatedAt: new Date() })
      .where(eq(execution.id, executionId))
      .returning();
    return result[0] ?? new Error("Failed to update execution");
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const createNodeExecution = async (
  executionId: number,
  nodeId: string,
  nodeType: string,
  inputJson: unknown,
): Promise<NodeExecutionRow | Error> => {
  try {
    const result = await db
      .insert(nodeExecution)
      .values({
        executionId,
        nodeId,
        nodeType,
        status: "running",
        inputJson,
        startedAt: new Date(),
      })
      .returning();
    return result[0] ?? new Error("Failed to create node execution");
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const completeNodeExecution = async (
  nodeExecutionId: number,
  status: "completed" | "failed",
  outputJson: unknown,
): Promise<NodeExecutionRow | Error> => {
  try {
    const result = await db
      .update(nodeExecution)
      .set({ status, outputJson, completedAt: new Date(), updatedAt: new Date() })
      .where(eq(nodeExecution.id, nodeExecutionId))
      .returning();
    return result[0] ?? new Error("Failed to update node execution");
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const getExecutionsByWorkflowId = async (workflowId: number) => {
  try {
    const result = await db
      .select()
      .from(execution)
      .where(eq(execution.workflowId, workflowId))
      .orderBy(desc(execution.id));
    return result;
  } catch (err) {
    return err;
  }
};

export const getLatestExecutionByWorkflowId = async (
  workflowId: number,
): Promise<ExecutionRow | undefined | Error> => {
  try {
    const result = await db
      .select()
      .from(execution)
      .where(eq(execution.workflowId, workflowId))
      .orderBy(desc(execution.id))
      .limit(1);
    return result[0];
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export const getNodeExecutionsByExecutionId = async (executionId: number) => {
  try {
    const result = await db
      .select()
      .from(nodeExecution)
      .where(eq(nodeExecution.executionId, executionId))
      .orderBy(desc(nodeExecution.id));
    return result;
  } catch (err) {
    return err;
  }
};
