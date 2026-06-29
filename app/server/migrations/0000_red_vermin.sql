CREATE TYPE "public"."status_enum" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."is_active" AS ENUM('true', 'false');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TABLE "execution" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"trigger_id" integer NOT NULL,
	"status" "status_enum" DEFAULT 'pending' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "execution_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" integer NOT NULL,
	"node_execution_id" integer NOT NULL,
	"log_level" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_execution" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" integer NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"node_type" varchar(255) NOT NULL,
	"status" "status_enum" DEFAULT 'pending' NOT NULL,
	"input_json" jsonb,
	"output_json" jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"credentials_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "integrations_workflow_id_node_id_unique" UNIQUE("workflow_id","node_id")
);
--> statement-breakpoint
CREATE TABLE "triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"config_json" jsonb NOT NULL,
	"is_active" "is_active" DEFAULT 'true' NOT NULL,
	"webhook_token" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "triggers_workflow_id_node_id_unique" UNIQUE("workflow_id","node_id"),
	CONSTRAINT "triggers_webhook_token_unique" UNIQUE("webhook_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"refresh_token" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"graph_json" jsonb,
	"status" "workflow_status" DEFAULT 'draft' NOT NULL,
	"schedule_enabled" boolean DEFAULT false NOT NULL,
	"schedule_interval_seconds" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "execution" ADD CONSTRAINT "execution_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution" ADD CONSTRAINT "execution_trigger_id_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "execution_logs_execution_id_execution_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."execution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "execution_logs_node_execution_id_node_execution_id_fk" FOREIGN KEY ("node_execution_id") REFERENCES "public"."node_execution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_execution" ADD CONSTRAINT "node_execution_execution_id_execution_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."execution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "execution_workflow_id_idx" ON "execution" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "execution_trigger_id_idx" ON "execution" USING btree ("trigger_id");--> statement-breakpoint
CREATE INDEX "execution_workflow_id_status_idx" ON "execution" USING btree ("workflow_id","status");--> statement-breakpoint
CREATE INDEX "execution_logs_execution_id_idx" ON "execution_logs" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_logs_node_execution_id_idx" ON "execution_logs" USING btree ("node_execution_id");--> statement-breakpoint
CREATE INDEX "node_execution_execution_id_idx" ON "node_execution" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "node_execution_execution_id_status_idx" ON "node_execution" USING btree ("execution_id","status");--> statement-breakpoint
CREATE INDEX "workflows_user_id_idx" ON "workflows" USING btree ("user_id");