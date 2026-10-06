@echo off
title PulseTask - Stop All Services
color 0C

echo ==========================================================
echo               PulseTask - Stopping All Services
echo ==========================================================
echo.

echo Stopping PHP and Artisan processes...
taskkill /F /IM php.exe /T 2>nul
if %errorlevel%==0 (
    echo [OK] PHP / Artisan services terminated.
) else (
    echo [INFO] No running PHP processes found.
)

echo.
echo Stopping Node / Vite processes...
taskkill /F /IM node.exe /T 2>nul
if %errorlevel%==0 (
    echo [OK] Vite frontend services terminated.
) else (
    echo [INFO] No running Node processes found.
)

echo.
echo ==========================================================
echo         All PulseTask services have been stopped.
echo ==========================================================
echo.
pause
