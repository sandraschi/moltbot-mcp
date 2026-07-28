"""Moltbot MCP server entry. Registers tools and runs stdio."""

from moltbot_mcp._mcp import mcp

# Import tools so they register on mcp
from moltbot_mcp.tools import help, moltbot_ops  # noqa: F401

from .transport import run_server


def main() -> None:
    """Run MCP server over stdio."""
    run_server(mcp, server_name="moltbot-mcp")
