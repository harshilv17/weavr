import {
  pgTable,
  serial,
  integer,
  varchar,
  jsonb,
  timestamp,
  pgEnum,
  text,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema.ts";

export const workflowStatus = pgEnum("workflow_status", ["draft", "active", "completed"]);

export const workflows = pgTable(
  "workflows",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    graphJson: jsonb("graph_json"),
    status: workflowStatus("status").notNull().default("draft"),
    scheduleEnabled: boolean("schedule_enabled").notNull().default(false),
    scheduleIntervalSeconds: integer("schedule_interval_seconds"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("workflows_user_id_idx").on(table.userId)],
);
