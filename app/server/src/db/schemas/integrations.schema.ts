import { pgTable, serial, integer, varchar, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { workflows } from "./workflow.schema.ts";

export const integrations = pgTable(
  "integrations",
  {
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id")
      .notNull()
      .references(() => workflows.id),
    nodeId: varchar("node_id", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    // Stores the AES-256-GCM encrypted ciphertext (base64), not raw credentials.
    // Encrypt with encryptCredentials()/decrypt with decryptCredentials().
    credentialsJson: jsonb("credentials_json").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("integrations_workflow_id_node_id_unique").on(table.workflowId, table.nodeId)],
);
