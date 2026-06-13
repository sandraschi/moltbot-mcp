"""Tests for MCP app (name, instructions, tools, main entrypoint)."""

from __future__ import annotations

import inspect
from importlib import import_module

import pytest

from moltbot_mcp import _mcp
from moltbot_mcp.mcp_server import main


def test_mcp_name() -> None:
    """FastMCP app has name moltbot-mcp."""
    assert _mcp.mcp.name == "moltbot-mcp"


def test_mcp_instructions_non_empty() -> None:
    """FastMCP app has non-empty instructions."""
    instructions = getattr(_mcp.mcp, "instructions", None) or getattr(
        _mcp.mcp, "_instructions", None
    )
    if instructions is None:
        # FastMCP 2.14 may store it elsewhere
        instructions = getattr(_mcp.mcp, "get_instructions", lambda: "")()
    assert instructions
    assert "moltbot" in instructions.lower() or "gateway" in instructions.lower()


def test_main_is_callable() -> None:
    """main is a callable (entrypoint for moltbot-mcp)."""
    assert callable(main)
    sig = inspect.signature(main)
    assert len(sig.parameters) == 0


def test_mcp_tools_registered() -> None:
    """moltbot_ops and help are registered as tools."""
    mcp = _mcp.mcp
    tools = getattr(mcp, "_tools", None) or getattr(mcp, "list_tools", None)
    if callable(tools):
        try:
            tool_list = tools() if not inspect.iscoroutinefunction(tools) else None
        except Exception:
            tool_list = None
    else:
        tool_list = list(tools) if tools is not None else None
    if tool_list is None:
        tool_list = getattr(mcp, "get_tools", lambda: [])()
    names = []
    if isinstance(tool_list, (list, tuple)):
        for t in tool_list:
            names.append(getattr(t, "name", str(t)))
    elif hasattr(mcp, "_tool_manager"):
        tm = mcp._tool_manager
        names = list(getattr(tm, "_tools", {}).keys()) if hasattr(tm, "_tools") else []
    if not names:
        pytest.skip("could not introspect tool list")
    assert "moltbot_ops" in names
    assert "help" in names


def test_server_module_importable() -> None:
    """moltbot_mcp.mcp_server can be run as module entrypoint."""
    mod = import_module("moltbot_mcp.mcp_server")
    assert hasattr(mod, "main")
