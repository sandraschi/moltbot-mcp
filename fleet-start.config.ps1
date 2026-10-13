# Per-repo fleet start config for moltbot-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'moltbot-mcp'
    BackendPort  = 10731
    FrontendPort = 10730
    HealthPath   = '/api/health'
    WebRoot      = 'web_sota'
    Backend = @{
        Kind          = 'uvicorn-web-app'
        UvicornTarget = 'web_sota.backend.server:app'
        WorkDir       = '.'
        SyncExtras    = @('dev')
        SyncOnStart  = $true
        Env           = @{ WEB_PORT = '10731' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
