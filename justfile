set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]
import 'scripts/just/fleet.just'

# --- Default ---

# List available recipes
default:
    @just --list

# --- Development ---

# Install dependencies and setup
bootstrap:
    Set-Location '{{justfile_directory()}}'; uv sync --all-extras; Set-Location '{{justfile_directory()}}\webapp'; npm install; Set-Location '{{justfile_directory()}}'; if (Test-Path '.pre-commit-config.yaml') { pre-commit install 2>$null }

# Serve the MCP server (stdio mode)
serve:
    Set-Location '{{justfile_directory()}}'
    uv run python -m moltbot_mcp

# Start full dev stack (backend API + frontend)
dev:
    Set-Location '{{justfile_directory()}}'; Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'uv run python webapp/server.py' -WindowStyle Hidden; Start-Sleep 3; Set-Location '{{justfile_directory()}}\webapp'; npm run dev

# --- Quality ---

# Run Ruff linting
lint:
    Set-Location '{{justfile_directory()}}'
    uv run ruff check src/

# Run Ruff formatting check
fmt:
    Set-Location '{{justfile_directory()}}'
    uv run ruff format src/ --check

# Auto-fix lint and formatting
fix:
    Set-Location '{{justfile_directory()}}'
    uv run ruff check src/ --fix
    uv run ruff format src/

# --- Testing ---

# Run tests
test:
    Set-Location '{{justfile_directory()}}'
    uv run pytest tests/ -q

# --- Packaging ---
# MCPB bundle via fleet.just (`just mcpb-pack` → mcpb/pack.ps1: fresh-stage src, validate, pack).
# (Retired scripts/build-mcpb.ps1: hardcoded root, outdated protocol ref, no validate/stage.)

# Build Tauri NSIS installer
build-native:
    & '{{justfile_directory()}}\native\build.ps1'

# --- Hardening ---

# Execute Bandit security audit
check-sec:
    Set-Location '{{justfile_directory()}}'
    uv run bandit -r src/

# Execute safety audit of dependencies
audit-deps:
    Set-Location '{{justfile_directory()}}'
    uv run safety check

# Run all gates
certify:
    Set-Location '{{justfile_directory()}}'
    uv run ruff check src/ --quiet
    uv run ruff format src/ --check --quiet
    uv run pytest tests/ -q

# Bootstrap: install dev deps + pre-commit hook
