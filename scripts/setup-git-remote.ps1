# Add origin remote for sandraschi/moltbot-mcp and show push steps.
# Run from repo root. If .git/config.lock exists, delete it first:
#   Remove-Item -Force D:\Dev\repos\moltbot-mcp\.git\config.lock

$ErrorActionPreference = "Stop"
$root = "D:\Dev\repos\moltbot-mcp"
$remote = "https://github.com/sandraschi/moltbot-mcp.git"

Set-Location $root

if (Test-Path ".git\config.lock") {
    Write-Host "Remove .git\config.lock first: Remove-Item -Force .git\config.lock"
    exit 1
}

$exists = git remote get-url origin 2>$null
if (-not $exists) {
    git remote add origin $remote
    Write-Host "Added remote origin -> $remote"
} else {
    git remote set-url origin $remote
    Write-Host "Set origin -> $remote"
}

Write-Host ""
Write-Host "Then: git add -A; git status; git commit -m 'chore: initial scaffold'; git push -u origin main"
Write-Host "If default branch is master: git push -u origin master"
