"""Tests for help tool (levels, topics, output shape)."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.help import help as help_tool


@pytest.mark.parametrize("level", ["basic", "intermediate", "advanced", "expert"])
@pytest.mark.asyncio
async def test_help_levels(level: str) -> None:
    """help returns markdown with requested level in title."""
    out = await help_tool(level=level)
    assert isinstance(out, str)
    assert "Moltbot MCP Help" in out
    assert level in out
    assert "Quick start" in out
    assert "moltbot_ops" in out or "MOLTBOT_MCP" in out


@pytest.mark.asyncio
async def test_help_default_level() -> None:
    """help defaults to basic when level not passed."""
    out = await help_tool()
    assert "basic" in out.lower()


@pytest.mark.asyncio
async def test_help_with_topic() -> None:
    """help with topic includes topic in output."""
    out = await help_tool(level="intermediate", topic="tools")
    assert "tools" in out.lower()
    assert "Topic:" in out or "topic" in out.lower()


@pytest.mark.asyncio
async def test_help_contains_references() -> None:
    """help includes References section."""
    out = await help_tool(level="basic")
    assert "References" in out
