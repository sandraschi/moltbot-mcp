# Moltbot MCP - User Prompt

Use moltbot_ops to check Gateway status, send messages via Moltbot, or run the agent. Use help when you need documentation.

- Check Gateway: `moltbot_ops(operation="status")` or `operation="health"`.
- Send a message: `moltbot_ops(operation="send", message="Hello", to="+1234567890")` (or channel id).
- Run agent: `moltbot_ops(operation="agent", message="Summarize today", thinking="low")`.
- List channels: `moltbot_ops(operation="channels")`.
- Get help: `help(level="basic")` or `help(level="intermediate", topic="tools")`.

Ensure Moltbot Gateway is running on the configured host:port (default 127.0.0.1:18789) before using send/agent.
