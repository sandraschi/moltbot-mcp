"""FastAPI substrate for Moltbot MCP (fleet health + MCP HTTP mount)."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from moltbot_mcp._mcp import mcp

# Register core tools on the shared FastMCP instance.
from moltbot_mcp.tools import help, moltbot_ops  # noqa: F401

try:
    from moltbot_mcp.tools import moltbook  # noqa: F401
except ImportError as exc:
    import logging

    logging.getLogger(__name__).warning("moltbook tools unavailable: %s", exc)

app = FastAPI(title="Moltbot MCP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/mcp", mcp.http_app())


@app.get("/health")
@app.get("/api/v1/health")
async def health():
    return {"status": "healthy", "service": "moltbot-mcp"}
