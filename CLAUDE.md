# moltbot-mcp

FastMCP server for Moltbot (ClawdBot) Gateway bridge.

## Commands

- `just serve` — run MCP server (stdio)
- `just dev` — start API + frontend
- `just test` — run tests
- `just lint` — ruff check
- `just fix` — ruff auto-fix + format

## Key Files

| Path | Purpose |
|------|---------|
| `src/moltbot_mcp/_mcp.py` | Shared FastMCP instance |
| `src/moltbot_mcp/server.py` | CLI entry point |
| `src/moltbot_mcp/tools/` | Tool definitions |
| `src/moltbot_mcp/api/main.py` | FastAPI HTTP substrate |
| `webapp/` | React dashboard |
| `native/` | Tauri NSIS wrapper |

## Standards

- FastMCP `>=3.4.4,<4`
- Port 10730 (frontend) / 10731 (backend API)
- `reports/` is gitignored
