# MCPSpot

MCPSpot is a local MCP (Model Context Protocol) server management gateway. It exposes configured MCP servers through one authenticated HTTP service with grouping, routing, OAuth support, and optional PostgreSQL-backed persistence.

## Current repository layout

This repository contains the **built JavaScript runtime** used by MCPSpot. The original TypeScript source tree and frontend source tree are not included in this snapshot, so the project is intentionally run directly with Node.js rather than rebuilt from missing `src/` or `frontend/` directories.

## Requirements

- Node.js 20 or newer
- pnpm 10.x is recommended
- A configured MCP server list/configuration
- PostgreSQL only when database mode is enabled

## Install and run

```bash
pnpm install
pnpm build
pnpm start
```

The server listens on `http://localhost:3000` by default.

Development mode:

```bash
pnpm dev
```

The `dev` script watches the checked-in JavaScript runtime and restarts the server when files change.

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

At minimum, set a strong persistent JWT secret:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

For browser clients hosted on a different origin, explicitly allow the origin:

```env
CORS_ORIGINS=http://localhost:3000
```

Do not use a wildcard CORS policy with credentials.

### Initial administrator

MCPSpot no longer creates a hard-coded `admin/admin123` account.

On first startup, an administrator is created **only when** both `ADMIN_USERNAME` and `ADMIN_PASSWORD` are provided. Use a strong password and change it through the normal account-management flow.

### Optional PostgreSQL mode

```env
USE_DB=true
DB_URL=postgresql://user:password@localhost:5432/mcpspot
```

## Security defaults

The runtime has been hardened to:

- Disable Express-powered-by disclosure.
- Restrict credentialed CORS to explicitly configured origins.
- Add standard browser security headers.
- Reject JWTs supplied through query parameters.
- Require a persistent `JWT_SECRET` in production.
- Avoid creating a known default administrator password.
- Ignore local environment files and runtime data in Git.
- Verify only the files that actually exist in this repository before startup/build packaging.

## Commands

```bash
pnpm build   # validate the checked-in runtime
pnpm start   # start MCPSpot
pnpm dev     # watch and restart the runtime
pnpm test    # run the repository smoke test
pnpm lint    # run ESLint
```

## Docker

The repository includes a Dockerfile. Build and run it with:

```bash
docker build -t mcpspot .
docker run --rm -p 3000:3000 --env-file .env mcpspot
```

Do not expose the container publicly without authentication, TLS termination, and an appropriately restricted CORS policy.

## License

MIT
