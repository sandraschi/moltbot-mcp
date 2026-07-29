"""Integration-style tests: validation and graceful error paths."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.help import help as help_tool
from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.asyncio
async def test_help_returns_string() -> None:
    """Help returns markdown string regardless of gateway."""
    help_out = await help_tool(level="basic", topic="tools")
    assert isinstance(help_out, str)
    assert "moltbot_ops" in help_out


@pytest.mark.asyncio
async def test_send_validation_gateway_offline() -> None:
    """Send with valid args errors gracefully without gateway."""
    out = await moltbot_ops(operation="send", message="test", to="+15550000000")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_agent_validation_gateway_offline() -> None:
    """Agent with valid args errors gracefully without gateway."""
    out = await moltbot_ops(operation="agent", message="ping", thinking="low")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")
