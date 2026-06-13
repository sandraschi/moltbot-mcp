"""Shared FastMCP app for Moltbot MCP."""

from fastmcp import FastMCP

mcp = FastMCP(
    name="moltbot-mcp",
    version="0.1.0",
    instructions="""MCP server for Moltbot (ClawdBot) Gateway.

Use moltbot_ops for status, health, send, agent, channels.
Use help for documentation. Configure via MOLTBOT_MCP_* env vars.""",
)
