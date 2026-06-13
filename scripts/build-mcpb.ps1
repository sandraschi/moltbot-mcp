# Build MCPB package for moltbot-mcp per MCP packaging standards (protocol 2025-11-25).
# Requires: mcpb CLI or equivalent. Run from repo root.
# Output: dist/moltbot-mcp-0.1.0.mcpb (or as per mcpb.json outputDir)

$ErrorActionPreference = "Stop"
$root = "D:\Dev\repos\moltbot-mcp"
Set-Location $root

if (-not (Test-Path "mcpb\manifest.json")) {
    Write-Host "mcpb\manifest.json not found"
    exit 1
}

$dist = "dist"
New-Item -ItemType Directory -Force -Path $dist | Out-Null

# If mcpb CLI is available:
$mcpb = Get-Command mcpb -ErrorAction SilentlyContinue
if ($mcpb) {
    mcpb build
    Write-Host "Build done. Check $dist"
} else {
    Write-Host "mcpb CLI not found. Install with: pip install mcpb (or uv add mcpb)"
    Write-Host "Manual pack: copy src/moltbot_mcp, mcpb/manifest.json, mcpb/prompts into a zip and rename to .mcpb"
}
