"""Integration-style tests: workflows and tool ordering."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.help import help as help_tool
from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.asyncio
async def test_workflow_status_then_health() -> None:
    """Call status then health; both succeed and share gateway_url."""
    r1 = await moltbot_ops(operation="status")
    r2 = await moltbot_ops(operation="health")
    assert r1.get("success") is True and r2.get("success") is True
    assert r1["result"]["gateway_url"] == r2["result"]["gateway_url"]


@pytest.mark.asyncio
async def test_workflow_help_then_send() -> None:
    """Get help then run send; help returns str, send returns structured result."""
    help_out = await help_tool(level="basic", topic="tools")
    assert isinstance(help_out, str)
    send_out = await moltbot_ops(operation="send", message="test", to="+15550000000")
    assert send_out.get("success") is True
    assert send_out["result"].get("to") == "+15550000000"


@pytest.mark.asyncio
async def test_workflow_agent_then_channels() -> None:
    """Run agent then channels; both succeed."""
    agent_out = await moltbot_ops(operation="agent", message="ping", thinking="minimal")
    ch_out = await moltbot_ops(operation="channels")
    assert agent_out.get("success") is True and ch_out.get("success") is True
    assert agent_out["result"]["operation"] == "agent"
    assert ch_out["result"]["operation"] == "channels"
