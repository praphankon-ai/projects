@echo off
title Prize Wheel App
cd /d "%~dp0"

echo.
echo  ==========================================
echo    Prize Wheel ^| Lucky Draw App
echo  ==========================================
echo.

REM -- Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

REM -- Install dependencies if missing
if not exist "node_modules\" (
    echo  [1/3] Installing dependencies...
    call npm install --silent
    if errorlevel 1 (
        echo  [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo  [1/3] Done.
) else (
    echo  [1/3] Dependencies OK
)

REM -- Build
echo  [2/3] Building production bundle...
call npm run build
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed. Check output above.
    pause
    exit /b 1
)
echo  [2/3] Build complete.

REM -- Serve
echo  [3/3] Starting server...
echo.
echo  ==========================================
echo    URL : http://localhost:4173/prizeapp
echo    Press Ctrl+C to stop the server
echo  ==========================================
echo.

REM Open browser after 1-second delay (background)
start /b cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:4173/prizeapp"

call npm run preview
