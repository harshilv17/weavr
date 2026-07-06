import crypto from "crypto";
import { db } from "../../config/db.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import { triggers } from "../../db/schemas/triggers.schema.ts";
import { integrations } from "../../db/schemas/integrations.schema.ts";
import { execution, nodeExecution, executionLogs } from "../../db/schemas/execution.schema.ts";
import { eq, and, isNull, notInArray, inArray } from "drizzle-orm";
import { encryptCredentials } from "../../utils/credentialCrypto.ts";

function generateWebhookToken() {
  return crypto.randomBytes(24).toString("hex");
}

export const getWorkflowsByUserId = async (userId: number) => {
  try {
    const result = await db.select().from(workflows).where(eq(workflows.userId, userId));
    return result;
  } catch (err) {
    return err;
  }
};

export const getWorkflowById = async (workflowId: number) => {
  try {
    const result = await db.select().from(workflows).where(eq(workflows.id, workflowId));
    return result[0];
  } catch (err) {
    return err;
  }
};

export const deleteWorkflowById = async (workflowId: number) => {
  try {
    const result = await db.transaction(async (tx) => {
      const executionRows = await tx
        .select({ id: execution.id })
        .from(execution)
        .where(eq(execution.workflowId, workflowId));
      const executionIds = executionRows.map((e) => e.id);

      if (executionIds.length > 0) {
        await tx.delete(executionLogs).where(inArray(executionLogs.executionId, executionIds));
        await tx.delete(nodeExecution).where(inArray(nodeExecution.executionId, executionIds));
        await tx.delete(execution).where(inArray(execution.id, executionIds));
      }

      await tx.delete(triggers).where(eq(triggers.workflowId, workflowId));
      await tx.delete(integrations).where(eq(integrations.workflowId, workflowId));

      const deleted = await tx.delete(workflows).where(eq(workflows.id, workflowId)).returning();
      return deleted[0];
    });
    return result;
  } catch (err) {
    return err;
  }
};

export const getTriggersByWorkflowId = async (workflowId: number) => {
  try {
    const result = await db.select().from(triggers).where(eq(triggers.workflowId, workflowId));
    return result;
  } catch (err) {
    return err;
  }
};

export const getTriggerByWebhookToken = async (webhookToken: string) => {
  try {
    const result = await db.select().from(triggers).where(eq(triggers.webhookToken, webhookToken));
    return result[0];
  } catch (err) {
    return err;
  }
};

export const updateWorkflowSchedule = async (
  workflowId: number,
  scheduleEnabled: boolean,
  scheduleIntervalSeconds: number | null,
) => {
  try {
    const result = await db
      .update(workflows)
      .set({ scheduleEnabled, scheduleIntervalSeconds, updatedAt: new Date() })
      .where(eq(workflows.id, workflowId))
      .returning();
    return result[0];
  } catch (err) {
    return err;
  }
};

export const getIntegrationsByWorkflowId = async (workflowId: number) => {
  try {
    const result = await db
      .select()
      .from(integrations)
      .where(eq(integrations.workflowId, workflowId));
    return result;
  } catch (err) {
    return err;
  }
};

export const saveWorkflowGraph = async (
  workflowId: number,
  graphJson: unknown,
  triggerRows: { nodeId: string; type: string; configJson: unknown }[],
  integrationRows: { nodeId: string; provider: string; credentialsJson: unknown }[],
) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(workflows)
        .set({ graphJson, updatedAt: new Date() })
        .where(eq(workflows.id, workflowId))
        .returning();

      const triggerNodeIds = triggerRows.map((t) => t.nodeId);
      const integrationNodeIds = integrationRows.map((i) => i.nodeId);

      // Remove rows for nodes no longer on the canvas. Trigger rows still
      // referenced by execution history are left in place — deleting them
      // would violate execution.triggerId's foreign key.
      await tx
        .delete(triggers)
        .where(
          triggerNodeIds.length > 0
            ? and(eq(triggers.workflowId, workflowId), notInArray(triggers.nodeId, triggerNodeIds))
            : eq(triggers.workflowId, workflowId),
        );
      await tx
        .delete(integrations)
        .where(
          integrationNodeIds.length > 0
            ? and(
                eq(integrations.workflowId, workflowId),
                notInArray(integrations.nodeId, integrationNodeIds),
              )
            : eq(integrations.workflowId, workflowId),
        );

      for (const t of triggerRows) {
        await tx
          .insert(triggers)
          .values({ workflowId, nodeId: t.nodeId, type: t.type, configJson: t.configJson })
          .onConflictDoUpdate({
            target: [triggers.workflowId, triggers.nodeId],
            set: { type: t.type, configJson: t.configJson, updatedAt: new Date() },
          });
      }

      for (const i of integrationRows) {
        const encryptedCredentials = encryptCredentials(i.credentialsJson);
        await tx
          .insert(integrations)
          .values({
            workflowId,
            nodeId: i.nodeId,
            provider: i.provider,
            credentialsJson: encryptedCredentials,
          })
          .onConflictDoUpdate({
            target: [integrations.workflowId, integrations.nodeId],
            set: {
              provider: i.provider,
              credentialsJson: encryptedCredentials,
              updatedAt: new Date(),
            },
          });
      }

      // Backfill a webhook token for any webhook trigger that doesn't have
      // one yet. onConflictDoUpdate above never touches webhookToken, so an
      // already-issued token survives every subsequent save untouched.
      const webhookTriggersNeedingToken = await tx
        .select({ id: triggers.id })
        .from(triggers)
        .where(
          and(
            eq(triggers.workflowId, workflowId),
            eq(triggers.type, "webhook"),
            isNull(triggers.webhookToken),
          ),
        );

      for (const t of webhookTriggersNeedingToken) {
        await tx
          .update(triggers)
          .set({ webhookToken: generateWebhookToken(), updatedAt: new Date() })
          .where(eq(triggers.id, t.id));
      }

      const currentTriggers = await tx
        .select()
        .from(triggers)
        .where(eq(triggers.workflowId, workflowId));

      return { workflow: updated[0], triggers: currentTriggers };
    });

    return result;
  } catch (err) {
    return err;
  }
};
