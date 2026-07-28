# Per-repo fleet start config for moltbot-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'moltbot-mcp'
    BackendPort  = 10731
    FrontendPort = 10730
    HealthPath   = '/health'
    WebRoot      = 'D:\Dev\repos\moltbot-mcp\web_sota'
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'moltbot_mcp.api.main:app'
        SyncExtras    = @('dev')
        Env           = @{ WEB_PORT = '10731' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
