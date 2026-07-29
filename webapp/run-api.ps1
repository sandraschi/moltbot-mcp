# Start the Moltbot Dashboard API (Gateway probe). Run from repo root or webapp.
# Requires: uv sync --extra web  (or --all-extras)
# Listens on http://127.0.0.1:10731

$ErrorActionPreference = "Stop"
$webapp = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $webapp
Set-Location $root
& uv run --extra web python "$webapp\server.py"
