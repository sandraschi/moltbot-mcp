"""Portmanteau tool for Moltbot Gateway operations — real WS calls."""

import asyncio
import json
import logging
import uuid
from typing import Any, Literal

from moltbot_mcp._mcp import mcp
from moltbot_mcp.config import settings

logger = logging.getLogger(__name__)


_ANNOTATIONS = {"readonly": True}

_GATEWAY_WS_URL: str | None = None


def _gateway_url() -> str:
    global _GATEWAY_WS_URL
    if _GATEWAY_WS_URL is None:
        _GATEWAY_WS_URL = settings.gateway_ws_url
    return _GATEWAY_WS_URL


def _build_connect_payload() -> dict:
    payload = {
        "type": "req",
        "id": str(uuid.uuid4()),
        "method": "connect",
        "params": {
            "minProtocol": 3,
            "maxProtocol": 3,
            "client": {
                "id": "moltbot-mcp",
                "version": "0.1.0",
                "platform": "mcp",
                "mode": "operator",
            },
            "role": "operator",
            "scopes": ["operator.read", "operator.write"],
            "caps": [],
            "commands": [],
            "permissions": {},
            "locale": "en-US",
            "userAgent": "moltbot-mcp/0.1.0",
        },
    }
    token = settings.gateway_token
    if token:
        payload["params"]["auth"] = {"token": token}
    return payload


async def _connect_and_call(method: str, params: dict | None = None) -> dict:
    """Connect to Gateway WS, send a request, return the response."""
    try:
        import websockets
    except ImportError:
        return {"success": False, "error": "websockets not installed", "error_type": "missing_dep"}

    url = _gateway_url()
    connect_payload = _build_connect_payload()
    req_id = str(uuid.uuid4())

    try:
        async with websockets.connect(url, close_timeout=2, open_timeout=5) as ws:
            await ws.send(json.dumps(connect_payload))
            raw = await asyncio.wait_for(ws.recv(), timeout=5)
            handshake = json.loads(raw)
            if not (handshake.get("type") == "res" and handshake.get("ok")):
                err = handshake.get("error") or raw[:200]
                return {"success": False, "error": f"Handshake failed: {err}", "error_type": "handshake"}

            call_payload = {"type": "req", "id": req_id, "method": method, "params": params or {}}
            await ws.send(json.dumps(call_payload))
            raw_resp = await asyncio.wait_for(ws.recv(), timeout=10)
            resp = json.loads(raw_resp)

            if resp.get("type") == "res":
                return {
                    "success": resp.get("ok", True),
                    "result": resp.get("payload"),
                    "error": resp.get("error"),
                }
            return {"success": True, "result": resp}

    except ConnectionRefusedError:
        return {"success": False, "error": f"Gateway not reachable at {url}", "error_type": "connection"}
    except TimeoutError:
        return {"success": False, "error": "Gateway did not respond in time", "error_type": "timeout"}
    except json.JSONDecodeError as e:
        return {"success": False, "error": f"Invalid JSON from Gateway: {e}", "error_type": "protocol"}
    except Exception as e:
        logger.exception("Gateway call failed")
        return {"success": False, "error": str(e), "error_type": "general"}


@mcp.tool()
async def moltbot_ops(
    operation: Literal["status", "health", "send", "agent", "channels"],
    message: str | None = None,
    to: str | None = None,
    thinking: Literal["off", "minimal", "low", "medium", "high", "xhigh"] = "low",
) -> dict[str, Any]:
    """Run Moltbot Gateway operations (status, health, send, agent, channels).

    STATUS: Return gateway and session status. No extra args.
    HEALTH: Return gateway health snapshot. No extra args.
    SEND: Send a message via Moltbot to a recipient (e.g. phone, channel).
        Requires message and to.
    AGENT: Trigger an agent run with a message. Optional thinking level.
        Requires message.
    CHANNELS: List connected channels and their status. No extra args.

    ## Return Format
    {"success": bool, "message": str, "result": {...} | "error": str}

    ## Examples
    moltbot_ops(operation="status")
    moltbot_ops(operation="health")
    moltbot_ops(operation="send", message="Hello", to="+1234567890")
    """
    if operation == "send":
        if not message or not to:
            return {"success": False, "message": "send requires message and to", "error": "missing_args"}
        gw = await _connect_and_call("send", {"message": message, "to": to})
        if not gw.get("success"):
            return {
                "success": False,
                "message": "Gateway send failed",
                "error": gw.get("error"),
                "error_type": gw.get("error_type"),
            }
        return {
            "success": True,
            "message": f"Message sent to {to}",
            "result": {"operation": "send", "to": to, "response": gw.get("result")},
        }

    if operation == "agent":
        if not message:
            return {"success": False, "message": "agent requires message", "error": "missing_args"}
        gw = await _connect_and_call("agent", {"message": message, "thinking": thinking})
        if not gw.get("success"):
            return {
                "success": False,
                "message": "Gateway agent failed",
                "error": gw.get("error"),
                "error_type": gw.get("error_type"),
            }
        return {
            "success": True,
            "message": "Agent triggered",
            "result": {"operation": "agent", "response": gw.get("result")},
        }

    if operation == "channels":
        gw = await _connect_and_call("channels")
        if not gw.get("success"):
            return {
                "success": False,
                "message": "Gateway channels failed",
                "error": gw.get("error"),
                "error_type": gw.get("error_type"),
            }
        return {
            "success": True,
            "message": "Channels retrieved",
            "result": {"operation": "channels", "channels": gw.get("result")},
        }

    if operation == "health":
        gw = await _connect_and_call("health")
        if not gw.get("success"):
            return {
                "success": False,
                "message": "Gateway health failed",
                "error": gw.get("error"),
                "error_type": gw.get("error_type"),
            }
        return {
            "success": True,
            "message": "Gateway healthy",
            "result": {"operation": "health", "health": gw.get("result")},
        }

    # status
    gw = await _connect_and_call("status")
    if not gw.get("success"):
        return {
            "success": False,
            "message": "Gateway status failed",
            "error": gw.get("error"),
            "error_type": gw.get("error_type"),
        }
    return {
        "success": True,
        "message": "Gateway status retrieved",
        "result": {"operation": "status", "status": gw.get("result")},
    }
