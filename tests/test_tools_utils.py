"""Tests for shared tool utilities."""

from __future__ import annotations

from moltbot_mcp.tools.utils import _error_response


def test_error_response_has_success_false() -> None:
    out = _error_response("test error", "test_type")
    assert out.get("success") is False
    assert out.get("error") == "test error"
    assert out.get("error_type") == "test_type"


def test_error_response_extra_kwargs() -> None:
    out = _error_response("err", extra="val")
    assert out.get("extra") == "val"
