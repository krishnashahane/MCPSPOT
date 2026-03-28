# MCPSpot

A powerful MCP (Model Context Protocol) server management platform. Manage and scale multiple MCP servers through a unified dashboard with flexible HTTP/SSE endpoints.

## Features

- Unified dashboard for all MCP servers
- Server groups with flexible routing
- Built-in marketplace for discovering MCP servers
- User management with role-based access
- OAuth support
- Dark/light theme
- Multi-language support (English, Chinese, French, Turkish)
- Database mode (PostgreSQL) or file-based config
- Docker support

## Quick Start

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Start
pnpm start
```

Open `http://localhost:3000` in your browser. Default credentials: `admin` / `admin123`.

## Development

```bash
# Run backend + frontend in dev mode
pnpm dev
```

## Configuration

Copy `.env.example` to `.env` and configure as needed:

```
PORT=3000
NODE_ENV=development
```

For database mode, set `DB_URL`:

```
DB_URL=postgresql://mcpspot:password@localhost:5432/mcpspot
```

## Docker

```bash
docker build -t mcpspot .
docker run -p 3000:3000 mcpspot
```

## Developer

Krishna Shahane

## License

MIT
