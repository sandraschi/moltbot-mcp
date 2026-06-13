"""
Moltbot MCP Server

Standardized FastMCP 3.x server for Moltbot Gateway.
Stdio via FastMCP; HTTP via FastAPI substrate (moltbot_mcp.api.main:app).
"""

import argparse
import logging
import sys

import uvicorn

from moltbot_mcp._mcp import mcp

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr,
)
logger = logging.getLogger(__name__)

# Register tools on the shared FastMCP instance.
from moltbot_mcp.tools import help, moltbot_ops  # noqa: F401

try:
    from moltbot_mcp.tools import moltbook  # noqa: F401
except ImportError as exc:
    logger.warning("moltbook tools unavailable: %s", exc)


def run() -> None:
    """CLI entry: stdio MCP or uvicorn-backed HTTP for fleet probes."""
    parser = argparse.ArgumentParser(description="Moltbot MCP Server")
    parser.add_argument("--http", action="store_true", help="Run HTTP API (uvicorn)")
    parser.add_argument("--port", type=int, default=10731, help="Port for HTTP mode")
    args, _unknown = parser.parse_known_args()

    if args.http:
        logger.info("Starting Moltbot MCP HTTP API on port %s", args.port)
        uvicorn.run(
            "moltbot_mcp.api.main:app",
            host="127.0.0.1",
            port=args.port,
            log_level="info",
        )
    else:
        logger.info("Starting Moltbot MCP on stdio transport")
        mcp.run(transport="stdio")


if __name__ == "__main__":
    run()
