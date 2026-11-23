@echo off
echo ========================================================
echo   Menjalankan ExpaLens Business Intelligence (React + FastAPI)
echo   Departemen Outgoing Exchange AIESEC in Universitas Andalas
echo ========================================================
echo.

start "ExpaLens Backend (FastAPI)" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.main:app --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "ExpaLens Frontend (React)" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

echo.
echo Server Backend aktif di:  http://127.0.0.1:8000
echo Antarmuka React aktif di: http://localhost:5173
echo.
pause
