"""Shutdown tool for Moltbot MCP."""

import logging

from moltbot_mcp._mcp import mcp

logger = logging.getLogger(__name__)


@mcp.tool()
async def moltbot_shutdown(confirm: bool = False) -> dict:
    """Gracefully shut down the moltbot-mcp server.

    Requires confirm=True to prevent accidental termination.

    ## Return Format
    {"success": bool, "message": str}

    ## Examples
    moltbot_shutdown(confirm=True)
    """
    if not confirm:
        return {
            "success": False,
            "message": "Shutdown requires confirm=True to prevent accidental termination",
            "error": "confirmation_required",
        }
    logger.warning("Server shutdown requested via tool")
    import os

    os._exit(0)
