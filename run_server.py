"""PyInstaller entry point — dual transport.

Detects MCP_PORT env var: if set, runs HTTP mode on that port.
Otherwise runs stdio mode.
"""

import os
import sys

sys.path.insert(0, "src")

# Override sys.argv before argparse runs — PyInstaller leaves frozen args
port = os.environ.get("MCP_PORT") or os.environ.get("PORT")
if port:
    host = os.environ.get("MCP_HOST", "127.0.0.1")
    sys.argv = ["run_server.py", "--http", "--host", host, "--port", str(port)]

from moltbot_mcp.server import run

if __name__ == "__main__":
    run()
