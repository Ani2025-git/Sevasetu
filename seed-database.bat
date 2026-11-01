@echo off
title SevaQueue Database Seeder
echo ====================================================
echo Seeding SevaQueue Database with Fictional Demo Data
echo ====================================================
cd /d "%~dp0backend"
if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" seed.py
) else (
    python seed.py
)
echo.
echo Database successfully seeded!
pause

