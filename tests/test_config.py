"""Tests for Moltbot MCP config and Settings."""

from __future__ import annotations

from moltbot_mcp.config import Settings, settings


def test_settings_defaults() -> None:
    """Settings use expected defaults when env is clean."""
    s = Settings()
    assert s.gateway_host == "127.0.0.1"
    assert s.gateway_port == 18789
    assert s.gateway_token is None
    assert s.use_ws is True


def test_gateway_ws_url_default() -> None:
    """gateway_ws_url is ws://host:port when use_ws is True."""
    s = Settings()
    assert s.gateway_ws_url == "ws://127.0.0.1:18789"


def test_gateway_ws_url_with_overrides(override_gateway_host: None, override_gateway_port: None) -> None:
    """gateway_ws_url reflects MOLTBOT_MCP_GATEWAY_HOST and PORT."""
    s = Settings()
    assert "testhost" in s.gateway_ws_url
    assert "19999" in s.gateway_ws_url


def test_gateway_ws_url_http_when_use_ws_false(override_use_ws_false: None) -> None:
    """gateway_ws_url uses http when MOLTBOT_MCP_USE_WS is false."""
    s = Settings()
    assert s.gateway_ws_url.startswith("http://")
    assert "ws://" not in s.gateway_ws_url


def test_settings_singleton() -> None:
    """Module-level settings instance is a Settings instance."""
    assert isinstance(settings, Settings)
