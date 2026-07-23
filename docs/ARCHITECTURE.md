# ARCHITECTURE.md

# Weavr Architecture

## System Overview

Weavr is a workflow automation platform. Users design workflows on a node-based canvas; the platform executes them, tracks their state, and streams progress back in real time.

It is currently a **modular monolith**: a single Express API process that also runs BullMQ workers in-process, backed by PostgreSQL and Redis. There are no separately deployed "scheduler," "webhook," or "worker" services — those are modules/files within the same codebase, described below by responsibility rather than by deployment unit.

---

# Component Map

## Frontend Application (`app/web`)

**Technology**

- Next.js (App Router)
- React, TypeScript
- React Flow (workflow canvas)
- Socket.IO client

**Responsibilities**

- User authentication (signin/signup/verification pages)
- Workflow builder UI — node canvas, node configuration panels, edge management
- Workflow list/dashboard
- Execution monitoring and history display
- Real-time execution updates via Socket.IO

The frontend never executes workflows. It only manages workflow definitions (graph JSON) and displays execution data pushed from the backend.

State is held in local component state and small custom hooks (`useWorkflow`, `useWorkflows`, `useMe`, `useExecutionSocket`) — there is no global state library.

---

## Backend API (`app/server`)

**Technology**

- Node.js, Express 5, TypeScript

**Responsibilities**

- Authentication & authorization (JWT access/refresh tokens in httpOnly cookies)
- CSRF protection on state-changing requests (double-submit cookie, `src/middlewares/csrf.middleware.ts`)
- Workflow CRUD and graph persistence
- Trigger and integration config sync (derived from the saved graph)
- Triggering executions (manual, webhook, scheduled)
- Execution/log query endpoints
- Realtime event broadcasting (via the same process's Socket.IO server)

Organized as modules under `src/modules/` (`auth`, `workflows`, `executions`), each with its own controller/service/repo files. Auth and webhook routes are CSRF-exempt; every workflow/execution route is CSRF-protected.

`app/server/tests/` has a Jest suite covering the auth and workflow/execution routes against a mocked service layer.

---

## Execution Engine

Implemented in `src/executors/global.executor.ts` plus per-type executors (`http.executor.ts`, `email.executor.ts`, `slack.executor.ts`, `anthropic.executor.ts`, `openai.executor.ts`, `groq.executor.ts`).

**Responsibilities**

- Build an executable node/edge list from a workflow's `graphJson` plus its persisted trigger/integration config
- Resolve execution order via topological sort
- Run nodes **sequentially** in that order (not parallelized)
- Persist per-node status/input/output to `node_execution`, and execution-level status to `execution`
- Emit Socket.IO events as each node starts/succeeds/fails and when the execution finishes
- Write log lines to `execution_logs`

Node failures are recorded in `node_execution.output_json` (e.g. `{ error: message }`) rather than a dedicated error column.

---

## Queue System

**Technology**

- BullMQ, Redis

**Responsibilities**

- `WorkflowExecutionQueue` — queues a workflow run (manual, webhook, or scheduled) as a job
- `VerificationEmailQueue` — queues verification email sends
- Repeatable jobs (BullMQ job schedulers) back the interval-based scheduling feature (`schedule/start` / `schedule/stop`)

Workers (`src/workers/WorkflowExecutionWorker.ts`, `src/workers/VerificationMailworker.ts`) run in the same Node process as the API server and consume these queues.

---

## Trigger Types

Three trigger types actually exist, each represented by a row in the `triggers` table:

- **Manual** — started via `POST /workflows/:id/run`
- **Webhook** — a unique `webhookToken` is generated per webhook trigger node; `POST /api/v1/webhooks/:token` looks it up and queues a run
- **Cron / scheduled** — an interval in seconds (`scheduleIntervalSeconds`) is stored on the workflow; starting the schedule registers a BullMQ repeatable job

There is no generic "external event" trigger beyond webhooks.

---

## Realtime Layer

**Technology**

- Socket.IO (`src/ws/executionSocket.ts` on the server, `hooks/useExecutionSocket.ts` on the client)

**Responsibilities**

- Push `execution:started`, `node:running`, `node:success`, `node:failed`, and `execution:finished` events as an execution progresses, so the builder UI can update without polling

---

## Database Layer

**Technology**

- PostgreSQL (local Docker container in dev), Drizzle ORM (`drizzle-orm/node-postgres` + `pg`)

**Responsibilities**

- Users, workflows, triggers, integrations, executions, node executions, execution logs

See [DATABASE.md](./DATABASE.md) for the full schema.

---

## Redis Layer

**Responsibilities**

- BullMQ queue storage and job coordination

Redis is not used as a general-purpose cache in this codebase today — its only role is backing BullMQ.

---

## External Services

### AI Providers

- OpenAI
- Anthropic
- Groq

Each is a thin per-provider executor (`anthropic.executor.ts`, `openai.executor.ts`, `groq.executor.ts`) wrapping the respective SDK — there isn't a unified provider abstraction beyond sharing the same executor function signature.

### Integration Providers

- **Slack** — send a message via the `slack` node type (`slack.executor.ts`)
- **Email (SMTP)** — send via the `email` node type (`email.executor.ts`, Nodemailer), separate from the AI/Slack integrations table
- **HTTP** — make an arbitrary HTTP request via the `http` node type (`http.executor.ts`)

Gmail, Google Sheets, and Telegram are not implemented.

---

# Communication Patterns

## REST API

```
Frontend → Backend API → PostgreSQL
```

Used for authentication, workflow management, and execution history.

## WebSocket

```
Execution engine → Socket.IO → Frontend
```

Used for live execution/node status updates.

## Job Queue

```
Backend API → BullMQ (Redis) → Worker (same process) → Execution engine
```

Manual runs, webhook-triggered runs, and scheduled runs all become BullMQ jobs, consumed by an in-process worker.

---

# Data Flow: Manual Workflow Execution

1. User clicks "Run" in the builder UI → `POST /workflows/:id/run`.
2. Backend validates ownership, builds the node/edge execution graph from `graphJson` + trigger/integration rows, creates an `execution` row (`status = pending`), and enqueues a BullMQ job.
3. The in-process worker picks up the job and calls into the execution engine.
4. The execution engine topologically sorts the nodes and runs them one at a time: each node's executor is invoked, its `node_execution` row is updated, and Socket.IO events (`node:running`, `node:success`/`node:failed`) are emitted.
5. Execution-level logs are written to `execution_logs`.
6. Once all nodes have run, the `execution` row is marked `completed` or `failed` and `execution:finished` is emitted.
7. The frontend, subscribed via Socket.IO, updates the UI live; execution history remains queryable afterward via the `/executions` endpoints.

---

# Related documents

- [docs/DATABASE.md](./DATABASE.md) — schema reference
- [docs/API.md](./API.md) — REST API reference
