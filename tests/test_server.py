"""Tests for Moltbot MCP server and tools (validation + graceful errors)."""

import pytest

from moltbot_mcp.tools.help import help
from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.asyncio
async def test_help_basic() -> None:
    out = await help(level="basic")
    assert "Moltbot MCP" in out
    assert "moltbot_ops" in out


@pytest.mark.asyncio
async def test_moltbot_ops_send_requires_to() -> None:
    r = await moltbot_ops(operation="send", message="hi")
    assert r["success"] is False
    assert "missing" in str(r.get("error", ""))


@pytest.mark.asyncio
async def test_moltbot_ops_agent_requires_message() -> None:
    r = await moltbot_ops(operation="agent")
    assert r["success"] is False
    assert "missing" in str(r.get("error", ""))


@pytest.mark.asyncio
async def test_moltbot_ops_status_no_gateway() -> None:
    """status returns error gracefully without a running Gateway."""
    r = await moltbot_ops(operation="status")
    assert r["success"] is False
    assert r.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_moltbot_ops_health_no_gateway() -> None:
    """health returns error gracefully without a running Gateway."""
    r = await moltbot_ops(operation="health")
    assert r["success"] is False
    assert r.get("error_type") in ("connection", "missing_dep")
