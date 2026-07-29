"""Tests for FastAPI REST endpoints (api/main.py)."""

from __future__ import annotations

from fastapi.testclient import TestClient

from moltbot_mcp.api.main import app


def test_health() -> None:
    client = TestClient(app)
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["service"] == "moltbot-mcp"


def test_capabilities() -> None:
    client = TestClient(app)
    r = client.get("/api/capabilities")
    assert r.status_code == 200
    data = r.json()
    assert "tools" in data
    assert "capabilities" in data
    assert data["service"] == "moltbot-mcp"


def test_status() -> None:
    client = TestClient(app)
    r = client.get("/api/v1/status")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "tool_count" in data


def test_diagnostics() -> None:
    client = TestClient(app)
    r = client.get("/api/v1/diagnostics")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "tools" in data
    assert "system" in data


def test_skills_list() -> None:
    client = TestClient(app)
    r = client.get("/api/skills")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert "moltbot-ops" in data


def test_skill_content() -> None:
    client = TestClient(app)
    r = client.get("/api/skills/moltbot-ops")
    assert r.status_code == 200
    assert "Moltbot Gateway" in r.text
