# Weavr — Web

Next.js (App Router) frontend for Weavr: the workflow builder UI, dashboard, and auth pages.

See the [root README](../../README.md) for the full project overview and setup instructions.

## Development

```bash
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000). Requires the backend (`app/server`) running and reachable at the URL configured via `backend_URI` (see the root [.env.example](../../.env.example)).

## Structure

- `app/` — routes: `/`, `/signin`, `/signup`, `/verification/[id]`, `/dashboard`, `/builder/[id]`
- `components/builder/` — the React Flow-based workflow canvas and node editor
- `components/dashboard/`, `components/signin/`, `components/signup/` — page-specific components
- `hooks/` — `useWorkflow`, `useWorkflows`, `useMe`, `useExecutionSocket` (Socket.IO client for live execution updates)
- `services/` — API client functions grouped by domain (`auth/`, `workflows/`)
- `lib/api.ts` — shared axios instance. Configured with `xsrfCookieName`/`xsrfHeaderName` so axios automatically echoes the backend's `XSRF-TOKEN` cookie back as an `x-xsrf-token` header on mutating requests — required by the backend's CSRF middleware for all non-GET calls to `/api/v1/workflows/*` (see [docs/api/API.md](../../docs/api/API.md#csrf-protection)). The cookie is only issued on a prior `GET`, so a page that only ever POSTs (no dashboard/list load first) won't have one yet.
