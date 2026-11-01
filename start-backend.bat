@echo off
title SevaQueue Backend API Server
echo ====================================================
echo Starting SevaQueue Python Flask Backend on Port 5000
echo ====================================================
cd /d "%~dp0backend"
if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" run.py
) else (
    python run.py
)
pause

