@echo off
setlocal enabledelayedexpansion
title AI Medical Assistant (AMA) — Server
chcp 65001 >nul

echo ===============================================================================
echo                AI Medical Assistant (AMA) — Local Server
echo ===============================================================================
echo.

if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found. Please run SETUP.bat first.
    pause
    exit /b 1
)

set VENV_PYTHON=.venv\Scripts\python.exe

:: Verify configuration file
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
    )
)

echo Starting AMA Flask backend server on http://127.0.0.1:5000 ...
echo Press Ctrl+C in this window to stop the server safely.
echo.

:: Automatically open default browser after a 2-second delay
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:5000"

:: Run Flask application
%VENV_PYTHON% -m backend.app

if !errorlevel! neq 0 (
    echo.
    echo Server process terminated with code !errorlevel!.
    pause
)
