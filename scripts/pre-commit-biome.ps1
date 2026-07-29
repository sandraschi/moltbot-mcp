# Pre-commit hook for Biome (JS/TS linting)
$webDirs = @("webapp", "web_sota", "webapp/frontend", "web")
$found = $false
foreach ($dir in $webDirs) {
    $pkg = Join-Path $PSScriptRoot ".." $dir "package.json"
    if (Test-Path $pkg) {
        $webRoot = Resolve-Path (Join-Path $PSScriptRoot ".." $dir)
        Push-Location $webRoot
        if (Get-Command "npx" -ErrorAction SilentlyContinue) {
            npx @biomejs/biome check --write $webRoot\src 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "Biome found issues in $dir"
            }
        }
        Pop-Location
        $found = $true
        break
    }
}
if (-not $found) {
    Write-Host "No webapp directory found, skipping Biome" -ForegroundColor Gray
}
