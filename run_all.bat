@echo off
title RetailEdge AI - Master Launcher
echo ========================================================
echo        Starting RetailEdge AI Full System
echo ========================================================
echo.

set ROOT_DIR=%~dp0

echo [1/3] Starting FastAPI AI Service (port 8100)...
start "RetailEdge - AI Service (8100)" cmd /k "cd /d "%ROOT_DIR%ai-service" && "%ROOT_DIR%ai-service\venv\Scripts\uvicorn.exe" app.main:app --host 0.0.0.0 --port 8100 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Node.js Backend Server (port 5000)...
start "RetailEdge - Backend Server (5000)" cmd /k "cd /d "%ROOT_DIR%backend" && node server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Vite Frontend (port 5173)...
start "RetailEdge - Frontend Dashboard (5173)" cmd /k "cd /d "%ROOT_DIR%RetailEdge-main\frontend" && npm run dev"

echo.
echo ========================================================
echo All 3 services are launching in separate windows:
echo   - AI Service:        http://localhost:8100 (Docs: /docs)
echo   - Backend Server:    http://localhost:5000 (Health: /api/health)
echo   - React Dashboard:   http://localhost:5173
echo ========================================================
echo.
pause
