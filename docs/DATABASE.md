# DATABASE.md

# Weavr Database Reference

**Engine:** PostgreSQL
**ORM:** Drizzle ORM
**Migrations:** Drizzle Kit

---

## Tables

### users

Stores registered user accounts.

| Column        | Type         | Constraints               | Notes                                           |
| ------------- | ------------ | ------------------------- | ----------------------------------------------- |
| id            | serial       | PRIMARY KEY               | Auto-increment                                  |
| name          | varchar(255) | NOT NULL                  | Display name                                    |
| email         | varchar(255) | NOT NULL, UNIQUE          | Login identifier                                |
| password      | text         | NOT NULL                  | bcrypt hash                                     |
| refresh_token | text         | nullable                  | Current valid refresh token; nulled on sign-out |
| is_verified   | boolean      | NOT NULL, default `false` | Set true after email verification               |
| created_at    | text         | NOT NULL                  | ISO timestamp default                           |
| updated_at    | text         | NOT NULL                  | ISO timestamp default                           |

---

### workflows

Stores workflow definitions created by users.

| Column                    | Type            | Constraints               | Notes                                       |
| ------------------------- | --------------- | ------------------------- | ------------------------------------------- |
| id                        | serial          | PRIMARY KEY               | Auto-increment                              |
| user_id                   | integer         | NOT NULL, FK → users.id   | Owner                                       |
| name                      | varchar(255)    | NOT NULL                  | Human-readable name                         |
| description               | text            | NOT NULL                  | Purpose/summary                             |
| graph_json                | jsonb           | nullable                  | Node/edge graph definition                  |
| status                    | workflow_status | NOT NULL, default `draft` | See enum below                              |
| schedule_enabled          | boolean         | NOT NULL, default `false` | Whether the interval schedule is active     |
| schedule_interval_seconds | integer         | nullable                  | Interval between scheduled runs, in seconds |
| created_at                | timestamp       | NOT NULL, defaultNow()    |                                             |
| updated_at                | timestamp       | NOT NULL, defaultNow()    |                                             |

**Enum: workflow_status**

| Value       | Description             |
| ----------- | ----------------------- |
| `draft`     | Being built, not active |
| `active`    | Live and triggerable    |
| `completed` | Archived/finished       |

---

### triggers

Configures what events start a workflow execution.

| Column        | Type         | Constraints                 | Notes                                                                |
| ------------- | ------------ | --------------------------- | -------------------------------------------------------------------- |
| id            | serial       | PRIMARY KEY                 | Auto-increment                                                       |
| workflow_id   | integer      | NOT NULL, FK → workflows.id | Parent workflow                                                      |
| node_id       | varchar(255) | NOT NULL                    | Trigger node's ID within `graph_json`                                |
| type          | varchar(255) | NOT NULL                    | `manual`, `webhook`, or `cron`                                       |
| config_json   | jsonb        | NOT NULL                    | Trigger-specific config                                              |
| is_active     | is_active    | NOT NULL, default `true`    | Whether trigger is enabled                                           |
| webhook_token | varchar(64)  | nullable, UNIQUE            | Present for webhook triggers; used in `POST /api/v1/webhooks/:token` |
| created_at    | timestamp    | NOT NULL, defaultNow()      |                                                                      |
| updated_at    | timestamp    | NOT NULL, defaultNow()      |                                                                      |

Unique constraint on `(workflow_id, node_id)`.

**Enum: is_active**

| Value   |
| ------- |
| `true`  |
| `false` |

---

### integrations

Stores per-node credentials/config for integration nodes (e.g. Slack).

| Column           | Type         | Constraints                 | Notes                                |
| ---------------- | ------------ | --------------------------- | ------------------------------------ |
| id               | serial       | PRIMARY KEY                 | Auto-increment                       |
| workflow_id      | integer      | NOT NULL, FK → workflows.id | Parent workflow                      |
| node_id          | varchar(255) | NOT NULL                    | Node ID within `graph_json`          |
| provider         | varchar(255) | NOT NULL                    | e.g. `slack`                         |
| credentials_json | jsonb        | NOT NULL                    | Provider-specific credentials/config |
| created_at       | timestamp    | NOT NULL, defaultNow()      |                                      |
| updated_at       | timestamp    | NOT NULL, defaultNow()      |                                      |

Unique constraint on `(workflow_id, node_id)`.

---

### execution

Records each run of a workflow.

| Column       | Type        | Constraints                 | Notes                                                         |
| ------------ | ----------- | --------------------------- | ------------------------------------------------------------- |
| id           | serial      | PRIMARY KEY                 | Auto-increment                                                |
| workflow_id  | integer     | NOT NULL, FK → workflows.id | Which workflow ran                                            |
| trigger_id   | integer     | NOT NULL, FK → triggers.id  | What triggered it (manual runs still reference a trigger row) |
| status       | status_enum | NOT NULL, default `pending` | See enum below                                                |
| started_at   | timestamp   | nullable                    | Set when execution begins                                     |
| completed_at | timestamp   | nullable                    | Set when execution ends                                       |
| created_at   | timestamp   | NOT NULL, defaultNow()      |                                                               |
| updated_at   | timestamp   | NOT NULL, defaultNow()      |                                                               |

**Enum: status_enum**

| Value       | Description             |
| ----------- | ----------------------- |
| `pending`   | Queued, not yet started |
| `running`   | Currently executing     |
| `completed` | Finished successfully   |
| `failed`    | Terminated with error   |

---

### node_execution

Records the execution of each individual node within a workflow run.

| Column       | Type         | Constraints                 | Notes                                                                                                                       |
| ------------ | ------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| id           | serial       | PRIMARY KEY                 | Auto-increment                                                                                                              |
| execution_id | integer      | NOT NULL, FK → execution.id | Parent execution                                                                                                            |
| node_id      | varchar(255) | NOT NULL                    | Node identifier from `graph_json`                                                                                           |
| node_type    | varchar(255) | NOT NULL                    | `trigger`, `ai`, `http`, `email`, or `slack`                                                                                |
| status       | status_enum  | NOT NULL, default `pending` | Same enum as execution                                                                                                      |
| input_json   | jsonb        | nullable                    | Data passed into the node                                                                                                   |
| output_json  | jsonb        | nullable                    | Data returned by the node; on failure, an error is stored here (e.g. `{ error: message }`) rather than in a separate column |
| started_at   | timestamp    | nullable                    |                                                                                                                             |
| completed_at | timestamp    | nullable                    |                                                                                                                             |
| created_at   | timestamp    | NOT NULL, defaultNow()      |                                                                                                                             |
| updated_at   | timestamp    | NOT NULL, defaultNow()      |                                                                                                                             |

---

### execution_logs

Append-only log lines for a workflow execution.

| Column            | Type        | Constraints                      | Notes                        |
| ----------------- | ----------- | -------------------------------- | ---------------------------- |
| id                | serial      | PRIMARY KEY                      | Auto-increment               |
| execution_id      | integer     | NOT NULL, FK → execution.id      | Parent execution             |
| node_execution_id | integer     | NOT NULL, FK → node_execution.id | Which node emitted the log   |
| log_level         | varchar(50) | NOT NULL                         | e.g. `info`, `warn`, `error` |
| message           | text        | NOT NULL                         | Log content                  |
| created_at        | timestamp   | NOT NULL, defaultNow()           |                              |
| updated_at        | timestamp   | NOT NULL, defaultNow()           |                              |

---

## Entity Relationships

```
users
 └── workflows (user_id)
      ├── triggers (workflow_id)
      ├── integrations (workflow_id)
      └── execution (workflow_id, trigger_id)
           ├── node_execution (execution_id)
           │    └── execution_logs (node_execution_id)
           └── execution_logs (execution_id)
```

---

## Schema Files

| File                                    | Tables                                          |
| --------------------------------------- | ----------------------------------------------- |
| `src/db/schemas/user.schema.ts`         | `users`                                         |
| `src/db/schemas/workflow.schema.ts`     | `workflows`                                     |
| `src/db/schemas/triggers.schema.ts`     | `triggers`                                      |
| `src/db/schemas/integrations.schema.ts` | `integrations`                                  |
| `src/db/schemas/execution.schema.ts`    | `execution`, `node_execution`, `execution_logs` |
| `src/db/relations.ts`                   | Drizzle relations across all tables above       |
