"""Tests for moltbot_ops tool (all operations and error paths)."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.parametrize("op", ["status", "health", "channels"])
@pytest.mark.asyncio
async def test_moltbot_ops_readonly_ops(op: str) -> None:
    """status, health, channels return success and gateway_url."""
    out = await moltbot_ops(operation=op)
    assert out.get("success") is True
    assert "result" in out
    assert out["result"].get("operation") == op
    assert "gateway_url" in out["result"]


@pytest.mark.asyncio
async def test_moltbot_ops_send_success() -> None:
    """send with message and to returns success and echoes args."""
    out = await moltbot_ops(operation="send", message="hi", to="+15551234567")
    assert out.get("success") is True
    assert out["result"].get("message") == "hi"
    assert out["result"].get("to") == "+15551234567"


@pytest.mark.asyncio
async def test_moltbot_ops_send_missing_message() -> None:
    """send without message returns success=False and missing_args."""
    out = await moltbot_ops(operation="send", to="+15551234567")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_moltbot_ops_send_missing_to() -> None:
    """send without to returns success=False and missing_args."""
    out = await moltbot_ops(operation="send", message="hi")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_moltbot_ops_agent_success() -> None:
    """agent with message returns success and thinking level."""
    out = await moltbot_ops(operation="agent", message="Summarize the project", thinking="high")
    assert out.get("success") is True
    assert out["result"].get("message") == "Summarize the project"
    assert out["result"].get("thinking") == "high"


@pytest.mark.asyncio
async def test_moltbot_ops_agent_missing_message() -> None:
    """agent without message returns success=False and missing_args."""
    out = await moltbot_ops(operation="agent")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_moltbot_ops_agent_default_thinking() -> None:
    """agent defaults thinking to low when not passed."""
    out = await moltbot_ops(operation="agent", message="x")
    assert out.get("success") is True
    assert out["result"].get("thinking") == "low"


@pytest.mark.asyncio
async def test_moltbot_ops_channels() -> None:
    """channels returns success and summary."""
    out = await moltbot_ops(operation="channels")
    assert out.get("success") is True
    assert out["result"]["operation"] == "channels"
    assert "summary" in out["result"]
