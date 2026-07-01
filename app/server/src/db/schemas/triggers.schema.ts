import {
  pgTable,
  serial,
  integer,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { workflows } from "./workflow.schema.ts";

export const isActiveEnum = pgEnum("is_active", ["true", "false"]);

export const triggers = pgTable(
  "triggers",
  {
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id")
      .notNull()
      .references(() => workflows.id),
    nodeId: varchar("node_id", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    configJson: jsonb("config_json").notNull(),
    isActive: isActiveEnum("is_active").notNull().default("true"),
    webhookToken: varchar("webhook_token", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("triggers_workflow_id_node_id_unique").on(table.workflowId, table.nodeId),
    unique("triggers_webhook_token_unique").on(table.webhookToken),
  ],
);
