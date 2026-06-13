"""Shared pytest fixtures and env isolation for Moltbot MCP tests."""

from __future__ import annotations

import os
from collections.abc import Generator

import pytest


@pytest.fixture(autouse=True)
def isolate_env(monkeypatch: pytest.MonkeyPatch) -> Generator[None, None, None]:
    """Isolate tests from real MOLTBOT_MCP_* env so defaults and overrides are predictable."""
    env_keys = [k for k in os.environ if k.startswith("MOLTBOT_MCP_")]
    saved: dict[str, str | None] = {}
    for k in env_keys:
        saved[k] = os.environ.get(k)
        monkeypatch.delenv(k, raising=False)
    yield
    for k, v in saved.items():
        if v is not None:
            os.environ[k] = v
        elif k in os.environ:
            os.environ.pop(k, None)


@pytest.fixture
def override_gateway_host(monkeypatch: pytest.MonkeyPatch) -> None:
    """Override gateway host for tests that need a specific host."""
    monkeypatch.setenv("MOLTBOT_MCP_GATEWAY_HOST", "testhost")


@pytest.fixture
def override_gateway_port(monkeypatch: pytest.MonkeyPatch) -> None:
    """Override gateway port for tests that need a specific port."""
    monkeypatch.setenv("MOLTBOT_MCP_GATEWAY_PORT", "19999")


@pytest.fixture
def override_use_ws_false(monkeypatch: pytest.MonkeyPatch) -> None:
    """Force HTTP base URL instead of WS."""
    monkeypatch.setenv("MOLTBOT_MCP_USE_WS", "false")
