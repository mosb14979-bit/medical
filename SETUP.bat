@echo off
setlocal enabledelayedexpansion
title AI Medical Assistant (AMA) — Windows 11 Automated Setup
chcp 65001 >nul

echo ===============================================================================
echo                AI Medical Assistant (AMA) — System Setup
echo             Local-First Medical Information ^& Research Platform
echo ===============================================================================
echo.

:: 1. Verify Python 3.10+ or 3.11
echo [1/6] Checking Python installation...
set PYTHON_CMD=
for %%c in (python py -3.11 py -3.10) do (
    %%c --version >nul 2>&1
    if !errorlevel! equ 0 (
        set PYTHON_CMD=%%c
        goto :python_found
    )
)

:python_not_found
echo.
echo [ERROR] Python was not detected in PATH.
echo Please install Python 3.11 from https://www.python.org/downloads/
echo Make sure to check "Add Python to PATH" during installation.
echo.
pause
exit /b 1

:python_found
echo Found Python command: !PYTHON_CMD!
!PYTHON_CMD! --version

:: 2. Check and Create Virtual Environment
echo.
echo [2/6] Configuring Python Virtual Environment (.venv)...
if not exist ".venv" (
    echo Creating virtual environment in .venv ...
    !PYTHON_CMD! -m venv .venv
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo Virtual environment created successfully.
) else (
    echo Existing virtual environment detected (.venv).
)

set VENV_PYTHON=.venv\Scripts\python.exe
set VENV_PIP=.venv\Scripts\pip.exe

:: 3. Upgrade pip and wheel
echo.
echo [3/6] Upgrading pip, setuptools, and wheel...
%VENV_PYTHON% -m pip install --upgrade pip setuptools wheel --quiet

:: 4. Install Dependencies from requirements.txt
echo.
echo [4/6] Installing required dependencies from requirements.txt...
echo (This includes Flask, PyTorch CPU/CUDA, scikit-learn, Pillow, pytesseract, pdfplumber, soundfile)
%VENV_PIP% install -r requirements.txt
if !errorlevel! neq 0 (
    echo.
    echo [WARNING] Some dependencies encountered warnings during installation.
    echo Retrying core minimal dependencies...
    %VENV_PIP% install flask flask-cors pillow numpy scikit-learn pytesseract pdfplumber soundfile
)

:: 5. Check Tesseract OCR and Language Packs
echo.
echo [5/6] Inspecting Tesseract OCR for Laboratory Report Analyzer...
set TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
if exist "%TESSERACT_PATH%" (
    echo Tesseract OCR found at: %TESSERACT_PATH%
    "%TESSERACT_PATH%" --version | findstr /i "tesseract"
    
    :: Check for Arabic (ara.traineddata) and English (eng.traineddata)
    set TESSDATA_PREFIX=C:\Program Files\Tesseract-OCR\tessdata
    if exist "!TESSDATA_PREFIX!\eng.traineddata" (
        echo   - English OCR pack (eng.traineddata): INSTALLED
    ) else (
        echo   - [NOTICE] English OCR pack missing in !TESSDATA_PREFIX!
    )
    if exist "!TESSDATA_PREFIX!\ara.traineddata" (
        echo   - Arabic OCR pack (ara.traineddata): INSTALLED
    ) else (
        echo   - [NOTICE] Arabic OCR pack (ara.traineddata) not detected.
        echo     Download ara.traineddata from https://github.com/tesseract-ocr/tessdata
        echo     and copy to !TESSDATA_PREFIX!
    )
) else (
    echo [NOTICE] Tesseract OCR executable not detected at %TESSERACT_PATH%.
    echo For full Laboratory OCR support on Windows:
    echo 1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
    echo 2. Check "Additional language data (Arabic)" during installation.
    echo 3. The application will run in fallback simulation mode if Tesseract is absent.
)

:: 6. Initialize SQLite Database & Sample Knowledge Base
echo.
echo [6/6] Initializing local database and validating manifests...
%VENV_PYTHON% scripts\verify_installation.py

if not exist ".env" (
    echo Creating default .env configuration...
    copy .env.example .env >nul
)

echo.
echo ===============================================================================
echo                     SETUP COMPLETED SUCCESSFULLY
echo ===============================================================================
echo You can now launch the platform anytime by double-clicking RUN.bat.
echo To inspect diagnostic status and model manifests, run CHECK_SYSTEM.bat.
echo.
pause
