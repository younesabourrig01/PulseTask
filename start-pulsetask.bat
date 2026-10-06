@echo off
title PulseTask - Service Launcher
color 0B

echo ==========================================================
echo               PulseTask - Starting All Services
echo ==========================================================
echo.

set "ROOT_DIR=%~dp0"
set "SERVER_DIR=%ROOT_DIR%server"
set "CLIENT_DIR=%ROOT_DIR%client"

:: 1. Verify server directory
if not exist "%SERVER_DIR%" (
    echo [ERROR] Server directory not found at: %SERVER_DIR%
    pause
    exit /b 1
)

:: 2. Verify client directory
if not exist "%CLIENT_DIR%" (
    echo [ERROR] Client directory not found at: %CLIENT_DIR%
    pause
    exit /b 1
)

echo [1/4] Launching Laravel API Server (localhost:8000)...
start "PulseTask - API Server (Port 8000)" cmd /k "cd /d ""%SERVER_DIR%"" && title PulseTask - API Server && php artisan serve"

echo [2/4] Launching Queue Worker (SSH Scripts & Async Jobs)...
start "PulseTask - Queue Worker" cmd /k "cd /d ""%SERVER_DIR%"" && title PulseTask - Queue Worker && php artisan queue:work"

echo [3/4] Launching Scheduler (Uptime Checks every 1 min)...
start "PulseTask - Scheduler" cmd /k "cd /d ""%SERVER_DIR%"" && title PulseTask - Scheduler && php artisan schedule:work"

echo [4/4] Launching Frontend Vite Server (localhost:5173)...
start "PulseTask - Frontend (Vite)" cmd /k "cd /d ""%CLIENT_DIR%"" && title PulseTask - Frontend && npm run dev"

echo.
echo ==========================================================
echo         All 4 PulseTask services are now running!
echo ==========================================================
echo.
echo   * Frontend App:  http://localhost:5173
echo   * Backend API:   http://localhost:8000
echo   * Queue Worker:  Active (processing script runs)
echo   * Scheduler:     Active (checking server uptimes)
echo.
echo Leave the opened terminal windows open while working.
echo To stop all services at once, run: stop-pulsetask.bat
echo ==========================================================
echo.
pause
