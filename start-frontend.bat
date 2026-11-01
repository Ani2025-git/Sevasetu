@echo off
title SevaQueue Vite Frontend Server
echo ====================================================
echo Starting SevaQueue React Vite Frontend on Port 5173
echo ====================================================
cd /d "%~dp0frontend"
node node_modules\vite\bin\vite.js --host
pause

