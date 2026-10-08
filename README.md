# MCPSpot

MCPSpot is a local MCP (Model Context Protocol) server management gateway. It exposes configured MCP servers through one authenticated HTTP service with grouping, routing, OAuth support, and optional PostgreSQL-backed persistence.

## Current repository layout

This repository contains the built JavaScript runtime used by MCPSpot. The original TypeScript source tree and frontend source tree are not included in this snapshot, so the project runs directly with Node.js rather than attempting to rebuild missing `src/` or `frontend/` directories.

## Requirements

- Node.js 20 or newer
- pnpm 10.x is recommended
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

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Set a strong persistent JWT secret:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

For browser clients hosted on another origin, explicitly allow the origin:

```env
CORS_ORIGINS=http://localhost:3000
```

Do not use wildcard credentialed CORS in production.

### Initial administrator

MCPSpot no longer creates a hard-coded `admin/admin123` account.

On first startup, an administrator is created only when `ADMIN_USERNAME` and `ADMIN_PASSWORD` are provided. Use a strong password.

### Optional PostgreSQL mode

```env
USE_DB=true
DB_URL=postgresql://user:password@localhost:5432/mcpspot
```

## Security defaults

- Express server-identification headers are disabled.
- Credentialed CORS is restricted to explicitly configured origins.
- Standard browser security headers are added.
- JWTs are accepted only from the request header, not query strings.
- Production requires a persistent `JWT_SECRET`.
- No known default administrator password is created.
- Local environment files and runtime data are ignored by Git.

## Commands

```bash
pnpm build   # verify the checked-in runtime
pnpm start   # start MCPSpot
pnpm dev     # watch and restart the runtime
pnpm test    # run the runtime smoke test
pnpm lint    # run ESLint
```

## Docker

```bash
docker build -t mcpspot .
docker run --rm -p 3000:3000 --env-file .env mcpspot
```

Do not expose the service publicly without authentication, TLS termination, and a restricted CORS policy.

## License

MIT
