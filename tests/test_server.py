"""Tests for Moltbot MCP server and tools."""

import pytest

from moltbot_mcp.tools.help import help
from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.asyncio
async def test_help_basic() -> None:
    out = await help(level="basic")
    assert "Moltbot MCP" in out
    assert "moltbot_ops" in out


@pytest.mark.asyncio
async def test_moltbot_ops_status() -> None:
    r = await moltbot_ops(operation="status")
    assert r["success"] is True
    assert r["result"]["operation"] == "status"


@pytest.mark.asyncio
async def test_moltbot_ops_health() -> None:
    r = await moltbot_ops(operation="health")
    assert r["success"] is True
    assert r["result"]["operation"] == "health"


@pytest.mark.asyncio
async def test_moltbot_ops_send_requires_message_and_to() -> None:
    r = await moltbot_ops(operation="send", message="hi")
    assert r["success"] is False
    assert "to" in r.get("message", "").lower() or "missing" in r.get("message", "").lower()


@pytest.mark.asyncio
async def test_moltbot_ops_agent_requires_message() -> None:
    r = await moltbot_ops(operation="agent")
    assert r["success"] is False
    assert "message" in r.get("message", "").lower() or "missing" in r.get("message", "").lower()


@pytest.mark.asyncio
async def test_moltbot_ops_agent_with_message() -> None:
    r = await moltbot_ops(operation="agent", message="hello")
    assert r["success"] is True
    assert r["result"]["operation"] == "agent"
    assert r["result"]["message"] == "hello"
