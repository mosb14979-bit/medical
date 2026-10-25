@echo off
setlocal enabledelayedexpansion
title AI Medical Assistant (AMA) — Hardware & Environment Diagnostics
chcp 65001 >nul

echo ===============================================================================
echo                AI Medical Assistant (AMA) — System Diagnostics
echo ===============================================================================
echo.

if not exist ".venv\Scripts\python.exe" (
    echo [WARNING] .venv not detected. Running basic diagnostic using system Python.
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=.venv\Scripts\python.exe
)

echo [1] Checking Operating System and Architecture...
echo Windows Version:
cmd /c ver
echo Processor Architecture: %PROCESSOR_ARCHITECTURE%
echo.

echo [2] Checking Python Runtime...
%PYTHON_CMD% --version
echo.

echo [3] Checking PyTorch and Hardware Acceleration (CUDA/DirectML/CPU)...
%PYTHON_CMD% -c "import torch; print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}'); print(f'Device name: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"CPU Execution Only\"}')" 2>nul
if !errorlevel! neq 0 (
    echo [NOTICE] PyTorch is not yet installed in the selected Python environment.
)
echo.

echo [4] Checking Tesseract OCR Engine and Languages...
set TESSERACT_EXE=C:\Program Files\Tesseract-OCR\tesseract.exe
if exist "%TESSERACT_EXE%" (
    echo Tesseract executable found: %TESSERACT_EXE%
    "%TESSERACT_EXE%" --list-langs 2>nul
) else (
    echo [STATUS] Tesseract-OCR not installed at standard Windows path (%TESSERACT_EXE%).
    echo Laboratory Report OCR will fall back to digital text / synthetic parser.
)
echo.

echo [5] Validating Local Dataset Manifests and Artifacts...
%PYTHON_CMD% scripts\verify_installation.py --diagnostics-only
echo.

echo ===============================================================================
echo Diagnostics complete.
echo ===============================================================================
pause
