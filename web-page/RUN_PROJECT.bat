@echo off
setlocal
echo ===================================================
echo   AuraHR ^& Employee Dashboard - Full Stack Launcher
echo ===================================================

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "start_full_project.ps1"

exit
