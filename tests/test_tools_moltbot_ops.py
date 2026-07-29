"""Tests for moltbot_ops tool (validation paths + gateway error handling)."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.moltbot_ops import moltbot_ops


@pytest.mark.asyncio
async def test_send_missing_message() -> None:
    """send without message returns success=False and missing_args."""
    out = await moltbot_ops(operation="send", to="+15551234567")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_send_missing_to() -> None:
    """send without to returns success=False and missing_args."""
    out = await moltbot_ops(operation="send", message="hi")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_agent_missing_message() -> None:
    """agent without message returns success=False and missing_args."""
    out = await moltbot_ops(operation="agent")
    assert out.get("success") is False
    assert out.get("error") == "missing_args"


@pytest.mark.asyncio
async def test_unknown_operation() -> None:
    """unknown operation returns error."""
    out = await moltbot_ops(operation="invalid_op")  # type: ignore[arg-type]
    assert out.get("success") is False


# Gateway-dependent tests — no live gateway during unit tests,
# so these verify graceful error handling (connection refused / missing dep).

@pytest.mark.asyncio
async def test_status_gateway_unreachable() -> None:
    """status returns error gracefully when Gateway is not running."""
    out = await moltbot_ops(operation="status")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_health_gateway_unreachable() -> None:
    """health returns error gracefully when Gateway is not running."""
    out = await moltbot_ops(operation="health")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_channels_gateway_unreachable() -> None:
    """channels returns error gracefully when Gateway is not running."""
    out = await moltbot_ops(operation="channels")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_send_gateway_unreachable() -> None:
    """send with valid args returns error gracefully when Gateway is not running."""
    out = await moltbot_ops(operation="send", message="hi", to="+15551234567")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")


@pytest.mark.asyncio
async def test_agent_gateway_unreachable() -> None:
    """agent with valid args returns error gracefully when Gateway is not running."""
    out = await moltbot_ops(operation="agent", message="hello", thinking="low")
    assert out.get("success") is False
    assert out.get("error_type") in ("connection", "missing_dep")
