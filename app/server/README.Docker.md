# Weavr — Server (Docker)

Express API + BullMQ workers for Weavr.

See the [root README](../../README.md) for the full project overview.

### Building and running with Docker Compose

From the repo root:

```bash
docker compose -f docker/docker-compose.yml up --build
```

This starts `nginx`, `web`, `server`, and `redis`. PostgreSQL is not included — point `DATABASE_URL` at an external instance (e.g. [Neon](https://neon.tech)). The `server` container needs `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY`, `SMTP_*`, `NODE_ENV`, `REDIS_URL`, `CLIENT_URL`, and `CREDENTIAL_ENCRYPTION_KEY` — see [docker/docker-compose.yml](../../docker/docker-compose.yml) and the root [.env.example](../../.env.example).

`nginx` only makes sense with real TLS certs on the host (see [docs/architecture/ARCHITECTURE.md](../../docs/architecture/ARCHITECTURE.md#deployment-topology)); for local dev you can start just this service with `docker compose -f docker/docker-compose.yml up server redis --build`.

The API is available at [http://localhost:8080](http://localhost:8080) (`PORT` in `.env`). Swagger UI is at `/api/docs`.

In production this image is built and pushed by [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) as `amaan1114/weavr-server:latest`, not built on the host.

### Building the server image standalone

```bash
docker build -t weavr-server .
```

If your cloud uses a different CPU architecture than your development machine (e.g. Mac M1 vs. amd64), build for that platform:

```bash
docker build --platform=linux/amd64 -t weavr-server .
```

### References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
