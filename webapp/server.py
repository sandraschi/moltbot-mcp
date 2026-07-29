"""
FastAPI backend for Moltbot MCP Dashboard.
Probes Gateway WS, exposes /api/gateway and /api/logs.
Extensive logging and error handling per standards. No uncaught exceptions.
Run: uv run python server.py  (from webapp dir)
"""
import asyncio
import json
import logging
import os
import uuid
from collections import deque
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------------------------------------------------------
# In-memory log buffer (thread-safe for uvicorn workers; single worker typical)
# -----------------------------------------------------------------------------
LOG_BUFFER: deque[dict[str, Any]] = deque(maxlen=500)


class BufferHandler(logging.Handler):
    """Handler that appends records to LOG_BUFFER for /api/logs."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            LOG_BUFFER.append({
                "ts": datetime.now(tz=timezone.utc).isoformat(),
                "level": record.levelname,
                "name": record.name,
                "message": record.getMessage(),
            })
        except Exception:
            pass


logger = logging.getLogger("moltbot-dashboard-api")
logger.setLevel(logging.DEBUG)
logger.handlers.clear()
_handler = logging.StreamHandler()
_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))
logger.addHandler(_handler)
logger.addHandler(BufferHandler())

# Reduce noise from third-party loggers
logging.getLogger("uvicorn").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("fastapi").setLevel(logging.WARNING)

GATEWAY_HOST = os.environ.get("MOLTBOT_MCP_GATEWAY_HOST", "127.0.0.1")
GATEWAY_PORT = int(os.environ.get("MOLTBOT_MCP_GATEWAY_PORT", "18789"))
GATEWAY_WS = f"ws://{GATEWAY_HOST}:{GATEWAY_PORT}"
API_PORT = int(os.environ.get("MOLTBOT_DASHBOARD_API_PORT", "10731"))

app = FastAPI(title="Moltbot MCP Dashboard API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:10730", "http://127.0.0.1:10730"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def _probe_gateway() -> dict[str, Any]:
    out: dict[str, Any] = {
        "gateway_reachable": False,
        "gateway_url": GATEWAY_WS,
        "error": None,
        "health": None,
        "status": None,
        "channels": None,
    }
    logger.info("Gateway probe start url=%s", GATEWAY_WS)

    try:
        import websockets
    except ImportError as e:
        logger.warning("websockets not installed: %s", e)
        out["error"] = "websockets not installed; pip install websockets"
        return out

    connect_payload: dict[str, Any] = {
        "type": "req",
        "id": str(uuid.uuid4()),
        "method": "connect",
        "params": {
            "minProtocol": 3,
            "maxProtocol": 3,
            "client": {
                "id": "moltbot-mcp-dashboard",
                "version": "0.1.0",
                "platform": "web",
                "mode": "operator",
            },
            "role": "operator",
            "scopes": ["operator.read"],
            "caps": [],
            "commands": [],
            "permissions": {},
            "locale": "en-US",
            "userAgent": "moltbot-mcp-dashboard/0.1.0",
        },
    }
    token = os.environ.get("MOLTBOT_MCP_GATEWAY_TOKEN")
    if token:
        connect_payload["params"]["auth"] = {"token": token}
        logger.debug("Using gateway token from env")

    try:
        logger.debug("Connecting to Gateway WS")
        async with websockets.connect(
            GATEWAY_WS,
            close_timeout=2,
            open_timeout=5,
        ) as ws:
            logger.info("Gateway WS connected, sending connect handshake")
            await ws.send(json.dumps(connect_payload))
            raw = await asyncio.wait_for(ws.recv(), timeout=5)
            msg = json.loads(raw)
            if msg.get("type") == "res" and msg.get("ok"):
                out["gateway_reachable"] = True
                out["status"] = msg.get("payload")
                logger.info("Gateway handshake ok")
            else:
                err = msg.get("error") or raw[:200]
                out["error"] = str(err) if not isinstance(err, str) else err
                logger.warning("Gateway handshake failed: %s", out["error"])

            if out["gateway_reachable"]:
                req_id = str(uuid.uuid4())
                logger.debug("Requesting health")
                await ws.send(
                    json.dumps({"type": "req", "id": req_id, "method": "health", "params": {}})
                )
                try:
                    raw2 = await asyncio.wait_for(ws.recv(), timeout=3)
                    out["health"] = json.loads(raw2)
                    logger.info("Gateway health received")
                except asyncio.TimeoutError as e:
                    logger.warning("Health request timeout: %s", e)
                    out["health"] = {"_error": "health timeout"}
                except json.JSONDecodeError as e:
                    logger.warning("Health response not JSON: %s", e)
                    out["health"] = {"_error": str(e)}
                except Exception as e:
                    logger.warning("Health request failed: %s", e)
                    out["health"] = {"_error": str(e)}

    except asyncio.TimeoutError:
        out["error"] = "Gateway did not respond in time"
        logger.warning("Gateway probe timeout")
    except ConnectionRefusedError:
        out["error"] = "Connection refused. Is Moltbot Gateway running on " + GATEWAY_WS + "?"
        logger.warning("Gateway connection refused")
    except OSError as e:
        out["error"] = str(e)
        logger.warning("Gateway probe OSError: %s", e)
    except json.JSONDecodeError as e:
        out["error"] = f"Invalid JSON from Gateway: {e}"
        logger.warning("Gateway response not JSON: %s", e)
    except Exception as e:
        out["error"] = str(e)
        logger.exception("Gateway probe failed")

    logger.info("Gateway probe done reachable=%s", out["gateway_reachable"])
    return out


@app.get("/api/gateway")
async def get_gateway() -> dict[str, Any]:
    """Probe Gateway WS and return reachability, status, health."""
    try:
        return await _probe_gateway()
    except Exception as e:
        logger.exception("get_gateway unhandled: %s", e)
        return {
            "gateway_reachable": False,
            "gateway_url": GATEWAY_WS,
            "error": str(e),
            "health": None,
            "status": None,
            "channels": None,
        }


@app.get("/api/logs")
def get_logs(limit: int = Query(200, ge=1, le=500)) -> dict[str, Any]:
    """Return recent log entries from in-memory buffer (newest last)."""
    try:
        entries = list(LOG_BUFFER)[-limit:]
        return {"ok": True, "entries": entries, "count": len(entries)}
    except Exception as e:
        logger.exception("get_logs failed: %s", e)
        return {"ok": False, "entries": [], "count": 0, "error": str(e)}


@app.get("/api/health")
def api_health() -> dict[str, Any]:
    """Service health for load balancers."""
    return {"ok": True, "service": "moltbot-mcp-dashboard-api"}


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting API on 127.0.0.1:%s", API_PORT)
    uvicorn.run(app, host="127.0.0.1", port=API_PORT)
