"""Tests for shutdown tool (error path only — actual shutdown would kill the process)."""

from __future__ import annotations

import pytest

from moltbot_mcp.tools.shutdown import moltbot_shutdown


@pytest.mark.asyncio
async def test_shutdown_requires_confirm() -> None:
    """Shutdown without confirm=True returns error."""
    out = await moltbot_shutdown(confirm=False)
    assert out.get("success") is False
    assert "confirmation_required" in str(out.get("error", ""))
