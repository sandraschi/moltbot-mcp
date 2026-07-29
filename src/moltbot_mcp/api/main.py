"""FastAPI substrate for Moltbot MCP (fleet health + MCP HTTP mount)."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from moltbot_mcp._mcp import mcp

# Register core tools on the shared FastMCP instance.
from moltbot_mcp.tools import help, moltbot_ops, moltbot_shutdown, show_moltbot_status_card  # noqa: F401

try:
    from moltbot_mcp.tools import moltbook  # noqa: F401
except ImportError as exc:
    import logging

    logging.getLogger(__name__).warning("moltbook tools unavailable: %s", exc)

app = FastAPI(title="Moltbot MCP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:10730",
        "http://127.0.0.1:10730",
        "http://tauri.localhost",
        "https://tauri.localhost",
        "tauri://localhost",
    ],
    allow_origin_regex=r"https?://(?:[a-zA-Z0-9-]+\.ts\.net|.*?\.tail-[a-f0-9]+\.ts\.net|tauri\.localhost|localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|100\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?$|^tauri://localhost$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/mcp", mcp.http_app(path="/"))


@app.get("/health")
@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "service": "moltbot-mcp", "version": "0.1.0"}


@app.get("/api/capabilities")
async def capabilities():
    tools_list = []
    try:
        tools_list = [{"name": t.name, "description": t.description} for t in mcp._tool_manager.list_tools()]
    except Exception:
        pass
    return {
        "service": "moltbot-mcp",
        "version": "0.1.0",
        "capabilities": {"tools": True, "resources": False, "prompts": True, "sampling": False},
        "tools": tools_list,
    }


@app.get("/api/v1/status")
async def status():
    return {
        "server": "moltbot-mcp",
        "status": "ok",
        "version": "0.1.0",
        "tool_count": 3,
        "providers": {"gateway": {"host": "127.0.0.1", "port": 18789}},
    }
