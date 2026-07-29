"""Shared FastMCP app for Moltbot MCP."""

from pathlib import Path

from fastmcp import FastMCP

mcp = FastMCP(
    name="moltbot-mcp",
    version="0.1.0",
    instructions="""MCP server for Moltbot (ClawdBot) Gateway.

Use moltbot_ops for status, health, send, agent, channels.
Use help for documentation. Configure via MOLTBOT_MCP_* env vars.""",
)


@mcp.resource("skill://moltbot-ops")
async def get_moltbot_ops_skill() -> str:
    """Return the Moltbot Gateway operations skill."""
    skill_path = Path(__file__).parent / "skills" / "moltbot-ops" / "SKILL.md"
    if skill_path.exists():
        return skill_path.read_text(encoding="utf-8")
    return "Skill not found."


@mcp.resource("config://env")
async def get_env_config() -> str:
    """Return current environment configuration (sanitized)."""
    from moltbot_mcp.config import settings

    return f"""Gateway: {settings.gateway_ws_url}
Auth: {"Configured" if settings.gateway_token else "None"}
Use WS: {settings.use_ws}"""


@mcp.prompt()
async def gateway_help(topic: str = "status") -> str:
    """Prompt template for Gateway operations guidance."""
    base = "You are helping a user interact with the Moltbot Gateway.\n\n"
    if topic == "status":
        return base + "Use moltbot_ops(operation='status') to check gateway status."
    if topic == "send":
        return base + "Use moltbot_ops(operation='send', message='...', to='...') to send a message."
    if topic == "agent":
        return base + "Use moltbot_ops(operation='agent', message='...') to run the agent."
    return base + "Use help(level='basic') for available tools."
