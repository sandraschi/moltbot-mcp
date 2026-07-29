# Moltbot Gateway Operations

This server bridges MCP clients to a local Moltbot (ClawdBot) Gateway via WebSocket.

## Tools

- **moltbot_ops**: Portmanteau with operations `status`, `health`, `send`, `agent`, `channels`.
- **help**: Multilevel help (basic/intermediate/advanced/expert).
- **moltbot_shutdown**: Gracefully terminate the server.
- **show_moltbot_status_card**: Prefab UI card showing Gateway connection status.

## Configuration

Env vars `MOLTBOT_MCP_GATEWAY_HOST`, `MOLTBOT_MCP_GATEWAY_PORT`, `MOLTBOT_MCP_GATEWAY_TOKEN`.
Default Gateway: `ws://127.0.0.1:18789`. Gateway must be running for status/send/agent.

## Best Practices

1. Check Gateway status first with `moltbot_ops(operation="status")` before sending messages.
2. Use `health` operation to verify Gateway responsiveness.
3. Configure GATEWAY_TOKEN when the Gateway enforces auth.
4. Gateway tools are READ_ONLY (status, health, channels) except send/agent.
