"""Tests for webapp FastAPI backend (api only, no live Gateway)."""

import pytest
from fastapi.testclient import TestClient

# Import app from webapp server; we need to run from repo root and have webapp on path
# or import via sys.path. Prefer importing from installed package or path.
import sys
from pathlib import Path

webapp_root = Path(__file__).resolve().parent.parent / "webapp"
sys.path.insert(0, str(webapp_root))

try:
    from server import app
except ImportError:
    pytest.skip("webapp.server not importable (missing deps or path)", allow_module_level=True)


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_api_health(client: TestClient) -> None:
    r = client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True
    assert "moltbot-mcp-dashboard" in data.get("service", "")


def test_api_logs(client: TestClient) -> None:
    r = client.get("/api/logs?limit=10")
    assert r.status_code == 200
    data = r.json()
    assert "ok" in data
    assert "entries" in data
    assert "count" in data
    assert isinstance(data["entries"], list)


def test_api_logs_limit(client: TestClient) -> None:
    r = client.get("/api/logs?limit=5")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] <= 5
    assert len(data["entries"]) <= 5


def test_api_gateway_returns_structure(client: TestClient) -> None:
    r = client.get("/api/gateway")
    assert r.status_code == 200
    data = r.json()
    assert "gateway_reachable" in data
    assert "gateway_url" in data
    assert "error" in data
    # May be reachable or not depending on env; structure must be present
    assert "health" in data
    assert "status" in data
