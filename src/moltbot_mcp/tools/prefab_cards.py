"""Prefab UI cards for Moltbot MCP."""

from moltbot_mcp._mcp import mcp
from moltbot_mcp.config import settings


@mcp.tool(app=True)
async def show_moltbot_status_card() -> dict:
    """Show Moltbot Gateway status as a rich in-chat Prefab card.

    ## Return Format
    {"success": bool, "message": str, "content": str, "structured_content": dict}
    """
    try:
        from prefab_ui import PrefabApp
        from prefab_ui.components import Heading, Row
    except ImportError:
        return {"success": False, "message": "prefab-ui not installed", "error": "missing_dep"}

    with PrefabApp(title="Moltbot Gateway Status") as app:
        Heading("Gateway Connection")
        Row(label="Host", value=settings.gateway_host)
        Row(label="Port", value=str(settings.gateway_port))
        Row(label="URL", value=settings.gateway_ws_url)
        Row(label="Use WebSocket", value=str(settings.use_ws))
        if settings.gateway_token:
            Row(label="Auth", value="Configured")
        else:
            Row(label="Auth", value="None")
    return {
        "success": True,
        "message": "Gateway status card rendered",
        "content": f"Gateway at {settings.gateway_ws_url}",
        "structured_content": app,
    }
