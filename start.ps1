Param([switch]$Headless)
$SkipFrontend = $Headless

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}

$env:FASTMCP_LOG_LEVEL = 'WARNING'
Write-Host 'Starting moltbot-mcp...' -ForegroundColor Cyan
Set-Location $PSScriptRoot

# Clear port zombies
$ports = @(10730, 10731)
foreach ($p in $ports) {
    Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

# Start backend API
Write-Host 'Starting backend API on :10731...' -ForegroundColor Green
$job = Start-Job -Name "moltbot-backend" -ScriptBlock {
    param($Root)
    Set-Location $Root
    uv run --extra web python webapp/server.py
} -ArgumentList $PSScriptRoot

# Wait for backend health
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:10731/api/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) {
            Write-Host "Backend ready" -ForegroundColor Green
            break
        }
    } catch {}
    Start-Sleep 1
}

# Start frontend
if (-not $SkipFrontend) {
    Set-Location webapp
    Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'npm run dev' -WindowStyle Normal
    Start-Sleep 3
    Start-Process "http://127.0.0.1:10730"
    Set-Location $PSScriptRoot
}

# Keep alive
while ($true) {
    if ($job.State -eq "Completed" -or $job.State -eq "Failed") {
        Receive-Job $job
        break
    }
    Start-Sleep 2
}
