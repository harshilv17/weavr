import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { workflows } from "./workflow.schema.ts";
import { triggers } from "./triggers.schema.ts";

export const statusEnum = pgEnum("status_enum", ["pending", "running", "completed", "failed"]);

export const execution = pgTable(
  "execution",
  {
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id")
      .notNull()
      .references(() => workflows.id),
    triggerId: integer("trigger_id")
      .notNull()
      .references(() => triggers.id),
    status: statusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("execution_workflow_id_idx").on(table.workflowId),
    index("execution_trigger_id_idx").on(table.triggerId),
    index("execution_workflow_id_status_idx").on(table.workflowId, table.status),
  ],
);

export const nodeExecution = pgTable(
  "node_execution",
  {
    id: serial("id").primaryKey(),
    executionId: integer("execution_id")
      .notNull()
      .references(() => execution.id),
    nodeId: varchar("node_id", { length: 255 }).notNull(),
    nodeType: varchar("node_type", { length: 255 }).notNull(),
    status: statusEnum("status").notNull().default("pending"),
    inputJson: jsonb("input_json"),
    outputJson: jsonb("output_json"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("node_execution_execution_id_idx").on(table.executionId),
    index("node_execution_execution_id_status_idx").on(table.executionId, table.status),
  ],
);

export const executionLogs = pgTable(
  "execution_logs",
  {
    id: serial("id").primaryKey(),
    executionId: integer("execution_id")
      .notNull()
      .references(() => execution.id),
    nodeExecutionId: integer("node_execution_id")
      .notNull()
      .references(() => nodeExecution.id),
    logLevel: varchar("log_level", { length: 50 }).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("execution_logs_execution_id_idx").on(table.executionId),
    index("execution_logs_node_execution_id_idx").on(table.nodeExecutionId),
  ],
);
