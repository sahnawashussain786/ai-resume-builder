@echo off
title ResumeForge AI - Dev Launcher

echo.
echo   Starting ResumeForge AI...
echo.

start "Server - http://localhost:5000" cmd /k "cd /d %~dp0server && npm run dev"
start "Client - http://localhost:5173" cmd /k "cd /d %~dp0client && npm run dev"

rem small delay so the browser opens after servers start booting
ping -n 4 127.0.0.1 >nul
start "" http://localhost:5173

echo   Both servers launched in separate windows:
echo     - API:    http://localhost:5000
echo     - Client: http://localhost:5173
echo.
echo   Close each window (or press Ctrl+C inside it) to stop that server.
echo.
