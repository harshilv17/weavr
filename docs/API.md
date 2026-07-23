# API.md

# Weavr REST API Reference

Base URL: `http://localhost:8080/api/v1`

Interactive docs: `http://localhost:8080/api/docs` (Swagger UI, generated from JSDoc annotations on the auth and workflow routes)

All responses follow a consistent envelope: `{ success, status, message, data, request }` (errors also include `trace`).

Authentication uses **httpOnly cookies** (`accessToken`, `refreshToken`) — no Authorization header.

Rate limits: global 3000 req/15min per IP; auth endpoints 10 req/15min per IP; `POST /workflows/:workflowId/run` has its own limiter.

**CSRF**: every non-safe request (`POST`/`PUT`/`PATCH`/`DELETE`) to `/api/v1/workflows/*` must include an `x-xsrf-token` header matching the `XSRF-TOKEN` cookie (double-submit pattern, `src/middlewares/csrf.middleware.ts`). `/api/v1/auth/*` and `/api/v1/webhooks/*` are exempt. Axios handles this automatically when configured with `xsrfCookieName`/`xsrfHeaderName` (see `app/web/lib/api.ts`).

Note the doubled path segment on workflow routes (`/workflows/workflows`) — the router is mounted at `/api/v1/workflows` and each route additionally starts with `/workflows`.

---

## Auth (`/auth`)

| Route                       | Description                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `POST /auth/signup`         | Register a user. Body: `username`, `email`, `password` (8-30 chars, 1 uppercase, 1 number, 1 symbol). |
| `POST /auth/signin`         | Sign in. Body: `email`, `password`. Sets `accessToken` (15m) + `refreshToken` (7d) cookies.           |
| `POST /auth/signout`        | Clear auth cookies and invalidate refresh token.                                                      |
| `POST /auth/token/refresh`  | Exchange `refreshToken` cookie for a new `accessToken`.                                               |
| `POST /auth/verify/send`    | Send email verification code. Requires `accessToken`.                                                 |
| `POST /auth/verify/confirm` | Confirm verification code. Requires `accessToken`.                                                    |
| `GET /auth/me`              | Return the authenticated user's profile.                                                              |

---

## Workflows (`/workflows`)

All routes require authentication; mutating routes require the CSRF header.

| Route                                                  | Description                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `GET /workflows/workflows`                             | List the authenticated user's workflows.                                                           |
| `GET /workflows/workflows/:workflowId`                 | Get a single workflow.                                                                             |
| `POST /workflows/workflows`                            | Create a workflow. Body: `name`, `description`.                                                    |
| `PUT /workflows/workflows/:workflowId`                 | Save the workflow graph (`graphJson: { nodes, edges }`); syncs `triggers`/`integrations` to match. |
| `DELETE /workflows/workflows/:workflowId`              | Delete a workflow (owner only).                                                                    |
| `POST /workflows/workflows/:workflowId/run`            | Queue a manual run (builds the execution graph, enqueues via BullMQ).                              |
| `POST /workflows/workflows/:workflowId/schedule/start` | Enable interval schedule. Body: `intervalSeconds` (min 60).                                        |
| `POST /workflows/workflows/:workflowId/schedule/stop`  | Disable interval schedule.                                                                         |
| `GET /workflows/workflows/:workflowId/triggers`        | List trigger rows (includes `webhookToken` for webhook triggers).                                  |

---

## Executions (`/workflows`)

Mounted under the same prefix as workflows; all require authentication.

| Route                                                          | Description                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `GET /workflows/workflows/:workflowId/executions`              | List executions for a workflow, most recent first.                          |
| `GET /workflows/workflows/:workflowId/executions/latest`       | Get the most recent execution.                                              |
| `GET /workflows/workflows/:workflowId/executions/:executionId` | Get execution detail, including `node_execution` rows and `execution_logs`. |

---

## Webhooks (`/webhooks`)

Public, no authentication.

| Route                   | Description                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /webhooks/:token` | Look up the trigger by `webhookToken` and queue an execution of its parent workflow. JSON body is passed through as the trigger node's input. |

---

## Realtime events (Socket.IO)

Emitted during execution (`ws/executionSocket.ts`):

| Event                | Payload                           | When                |
| -------------------- | --------------------------------- | ------------------- |
| `execution:started`  | `{ executionId, workflowId }`     | Execution begins    |
| `node:running`       | `{ executionId, nodeId }`         | A node starts       |
| `node:success`       | `{ executionId, nodeId, output }` | A node succeeds     |
| `node:failed`        | `{ executionId, nodeId, error }`  | A node fails        |
| `execution:finished` | `{ executionId, status }`         | Execution completes |

---

## Enums

**Workflow status**: `draft`, `active`, `completed`
**Execution / node execution status**: `pending`, `running`, `completed`, `failed`
**Node types**: `trigger`, `ai`, `http`, `email`, `slack`
**Trigger types**: `manual`, `webhook`, `cron`
