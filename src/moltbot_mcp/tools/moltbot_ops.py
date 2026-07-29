"""Portmanteau tool for Moltbot Gateway operations."""

import logging
from typing import Any, Literal

from moltbot_mcp._mcp import mcp
from moltbot_mcp.config import settings

logger = logging.getLogger(__name__)


_ANNOTATIONS = {"readonly": True}


@mcp.tool(annotations=_ANNOTATIONS)
async def moltbot_ops(
    operation: Literal["status", "health", "send", "agent", "channels"],
    message: str | None = None,
    to: str | None = None,
    thinking: Literal["off", "minimal", "low", "medium", "high", "xhigh"] = "low",
) -> dict[str, Any]:
    """Run Moltbot Gateway operations (status, health, send, agent, channels).

    STATUS: Return gateway and session status. No extra args.
    HEALTH: Return gateway health snapshot. No extra args.
    SEND: Send a message via Moltbot to a recipient (e.g. phone, channel).
        Requires message and to.
    AGENT: Trigger an agent run with a message. Optional thinking level.
        Requires message.
    CHANNELS: List connected channels and their status. No extra args.

    ## Return Format
    {"success": bool, "message": str, "result": {"operation": str, ...} | "error": str}

    ## Examples
    moltbot_ops(operation="status")
    moltbot_ops(operation="health")
    moltbot_ops(operation="send", message="Hello", to="+1234567890")
    """
    # Placeholder: real impl would connect to Gateway WS and call methods.
    base = {
        "success": True,
        "message": f"moltbot_ops {operation} (placeholder)",
        "result": {
            "operation": operation,
            "gateway_url": settings.gateway_ws_url,
        },
    }
    if operation == "status":
        base["result"]["summary"] = "Gateway status placeholder. Wire to WS health/status."
        return base
    if operation == "health":
        base["result"]["summary"] = "Health placeholder. Wire to WS health."
        return base
    if operation == "send":
        if not message or not to:
            return {"success": False, "message": "send requires message and to", "error": "missing_args"}
        base["result"]["message"] = message
        base["result"]["to"] = to
        return base
    if operation == "agent":
        if not message:
            return {"success": False, "message": "agent requires message", "error": "missing_args"}
        base["result"]["message"] = message
        base["result"]["thinking"] = thinking
        return base
    if operation == "channels":
        base["result"]["summary"] = "Channels placeholder. Wire to WS channels list."
        return base
    return {"success": False, "message": f"unknown operation: {operation}", "error": "bad_operation"}
