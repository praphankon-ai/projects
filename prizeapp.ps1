#Requires -Version 5.1
<#
.SYNOPSIS
    Prize Wheel App launcher

.PARAMETER Dev
    Start in development mode (hot-reload, port 5173)

.PARAMETER BuildOnly
    Build production bundle without starting the server

.PARAMETER Port
    Override preview port (default 4173)

.EXAMPLE
    .\prizeapp            # build + serve (production)
    .\prizeapp -Dev       # dev server with hot-reload
    .\prizeapp -BuildOnly # build only, no server
#>
param(
    [switch]$Dev,
    [switch]$BuildOnly,
    [int]$Port = 4173
)

Set-Location $PSScriptRoot
$Host.UI.RawUI.WindowTitle = "Prize Wheel App"

function Write-Banner {
    Write-Host ""
    Write-Host "  ==========================================" -ForegroundColor DarkCyan
    Write-Host "    Prize Wheel | Lucky Draw App" -ForegroundColor Cyan
    Write-Host "  ==========================================" -ForegroundColor DarkCyan
    Write-Host ""
}

function Write-Step([string]$step, [string]$msg) {
    Write-Host "  [$step] " -ForegroundColor DarkGray -NoNewline
    Write-Host $msg -ForegroundColor White
}

function Abort([string]$msg) {
    Write-Host ""
    Write-Host "  [ERROR] $msg" -ForegroundColor Red
    Write-Host "  Press Enter to exit..." -ForegroundColor DarkGray
    $null = $Host.UI.ReadLine()
    exit 1
}

# -- Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Banner
    Abort "Node.js not found. Install from https://nodejs.org"
}

Write-Banner

# ── DEV MODE ────────────────────────────────────────────────────────────────
if ($Dev) {
    Write-Step "DEV" "Starting development server (hot-reload)..."
    Write-Host ""
    Write-Host "  URL  : http://localhost:5173" -ForegroundColor Cyan
    Write-Host "  Stop : Ctrl+C" -ForegroundColor DarkGray
    Write-Host ""
    Start-Process "http://localhost:5173"
    npm run dev
    exit $LASTEXITCODE
}

# ── INSTALL DEPS ─────────────────────────────────────────────────────────────
if (-not (Test-Path "node_modules")) {
    Write-Step "1/3" "Installing dependencies..."
    npm install --silent
    if ($LASTEXITCODE -ne 0) { Abort "npm install failed." }
    Write-Step "1/3" "Done."
} else {
    Write-Step "1/3" "Dependencies OK"
}

# ── BUILD ────────────────────────────────────────────────────────────────────
Write-Step "2/3" "Building production bundle..."
npm run build
if ($LASTEXITCODE -ne 0) { Abort "Build failed. Check output above." }
Write-Step "2/3" "Build complete."

if ($BuildOnly) {
    Write-Host ""
    Write-Host "  Build output: ./dist/" -ForegroundColor Green
    exit 0
}

# ── SERVE ────────────────────────────────────────────────────────────────────
Write-Step "3/3" "Starting preview server..."
Write-Host ""
Write-Host "  ==========================================" -ForegroundColor DarkCyan
Write-Host "    URL  : http://localhost:$Port/prizeapp" -ForegroundColor Cyan
Write-Host "    Stop : Ctrl+C" -ForegroundColor DarkGray
Write-Host "  ==========================================" -ForegroundColor DarkCyan
Write-Host ""

# Open browser after short delay
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:$using:Port"
} | Out-Null

npm run preview -- --port $Port
