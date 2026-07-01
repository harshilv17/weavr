import { relations } from "drizzle-orm";
import { users } from "./schemas/user.schema.ts";
import { workflows } from "./schemas/workflow.schema.ts";
import { triggers } from "./schemas/triggers.schema.ts";
import { integrations } from "./schemas/integrations.schema.ts";
import { execution, nodeExecution, executionLogs } from "./schemas/execution.schema.ts";

export const usersRelations = relations(users, ({ many }) => ({
  workflows: many(workflows),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  triggers: many(triggers),
  integrations: many(integrations),
  executions: many(execution),
}));

export const triggersRelations = relations(triggers, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [triggers.workflowId],
    references: [workflows.id],
  }),
  executions: many(execution),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
  workflow: one(workflows, {
    fields: [integrations.workflowId],
    references: [workflows.id],
  }),
}));

export const executionRelations = relations(execution, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [execution.workflowId],
    references: [workflows.id],
  }),
  trigger: one(triggers, {
    fields: [execution.triggerId],
    references: [triggers.id],
  }),
  nodeExecutions: many(nodeExecution),
  logs: many(executionLogs),
}));

export const nodeExecutionRelations = relations(nodeExecution, ({ one, many }) => ({
  execution: one(execution, {
    fields: [nodeExecution.executionId],
    references: [execution.id],
  }),
  logs: many(executionLogs),
}));

export const executionLogsRelations = relations(executionLogs, ({ one }) => ({
  execution: one(execution, {
    fields: [executionLogs.executionId],
    references: [execution.id],
  }),
  nodeExecution: one(nodeExecution, {
    fields: [executionLogs.nodeExecutionId],
    references: [nodeExecution.id],
  }),
}));
