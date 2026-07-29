"""Prefab UI cards for Moltbot MCP — live Gateway probe."""

from moltbot_mcp._mcp import mcp
from moltbot_mcp.config import settings
from moltbot_mcp.tools.moltbot_ops import _connect_and_call


@mcp.tool(app=True)
async def show_moltbot_status_card() -> dict:
    """Show Moltbot Gateway live status as a rich in-chat Prefab card.

    Probes the Gateway via WebSocket and shows real-time reachability and health.

    ## Return Format
    {"success": bool, "message": str, "content": str, "structured_content": dict}
    """
    try:
        from prefab_ui import PrefabApp
        from prefab_ui.components import Heading, Row
    except ImportError:
        return {"success": False, "message": "prefab-ui not installed", "error": "missing_dep"}

    status = await _connect_and_call("status")
    health = await _connect_and_call("health")

    reachable = status.get("success") and health.get("success")

    with PrefabApp(title="Moltbot Gateway Status") as app:
        Heading("Gateway Connection")
        Row(label="Status", value="Reachable" if reachable else "Unreachable")
        Row(label="Host", value=settings.gateway_host)
        Row(label="Port", value=str(settings.gateway_port))
        Row(label="URL", value=settings.gateway_ws_url)
        if reachable:
            status_payload = status.get("result", {})
            health_payload = health.get("result", {})
            if status_payload:
                Row(label="Gateway Status", value=str(status_payload)[:200])
            if health_payload:
                Row(label="Health", value=str(health_payload)[:200])
        else:
            err = status.get("error") or health.get("error") or "Unknown"
            Row(label="Error", value=str(err))

    msg = f"Gateway at {settings.gateway_ws_url} — {'Reachable' if reachable else 'Unreachable'}"
    return {
        "success": True,
        "message": msg,
        "content": msg,
        "structured_content": app,
    }
