"""Multilevel help tool for Moltbot MCP."""

from moltbot_mcp._mcp import mcp


@mcp.tool()
async def help(
    level: str = "basic",
    topic: str | None = None,
) -> str:
    """Help for Moltbot MCP (levels: basic, intermediate, advanced, expert).

    Args:
        level: basic | intermediate | advanced | expert.
        topic: Optional. tools | config | examples | troubleshooting.

    Returns:
        Markdown help content.
    """
    base = f"# Moltbot MCP Help — {level}\n\n"
    if topic:
        base += f"Topic: {topic}\n\n"
    base += "## Quick start\n\n"
    base += "- Use `moltbot_ops` with operation `status` or `health` to check Gateway.\n"
    base += "- Use `send` (message + to) to send via Moltbot; `agent` (message) to run the agent.\n"
    base += "- Configure via `MOLTBOT_MCP_GATEWAY_HOST`, `MOLTBOT_MCP_GATEWAY_PORT`, `MOLTBOT_MCP_GATEWAY_TOKEN`.\n\n"
    base += "## References\n\n"
    base += "- [Moltbot docs](https://docs.molt.bot)\n"
    base += "- [MCP Central Moltbot series](https://github.com/sandraschi/mcp-central-docs/tree/main/docs/integrations#moltbot-clawdbot)\n"
    return base
