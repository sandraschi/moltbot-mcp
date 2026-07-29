"""Tests for FastMCP resources and prompts."""

from __future__ import annotations

import pytest

from moltbot_mcp._mcp import get_moltbot_ops_skill, get_env_config, gateway_help


@pytest.mark.asyncio
async def test_skill_resource() -> None:
    content = await get_moltbot_ops_skill()
    assert isinstance(content, str)
    assert len(content) > 0
    assert "Gateway" in content or "moltbot" in content.lower()


@pytest.mark.asyncio
async def test_env_config_resource() -> None:
    content = await get_env_config()
    assert isinstance(content, str)
    assert "Gateway" in content


@pytest.mark.asyncio
async def test_gateway_help_prompt() -> None:
    result = await gateway_help(topic="status")
    assert "moltbot_ops" in result


@pytest.mark.asyncio
async def test_gateway_help_send() -> None:
    result = await gateway_help(topic="send")
    assert "send" in result.lower()


@pytest.mark.asyncio
async def test_gateway_help_unknown_topic() -> None:
    result = await gateway_help(topic="unknown")
    assert "help" in result.lower()
