# Troubleshooting & Windows 11 Diagnostics Guide

## 1. Common Windows 11 Setup Issues & Resolutions

### Issue 1: "Python was not found" or "py is not recognized"
- **Cause**: Python is not installed or the Windows PATH environment variable was not configured during setup.
- **Solution**: Download Python 3.11 from [python.org](https://www.python.org/downloads/). During the installer greeting screen, **check the box: "Add Python to PATH"**, then re-run `SETUP.bat`.

### Issue 2: Tesseract OCR Not Found or Arabic Pack Missing
- **Diagnostic**: Run `CHECK_SYSTEM.bat`. If it reports `Tesseract executable not detected`:
- **Solution**:
  1. Download the Windows installer from [UB-Mannheim Tesseract Wiki](https://github.com/UB-Mannheim/tesseract/wiki).
  2. Install to the default location: `C:\Program Files\Tesseract-OCR`.
  3. In the installer component selection, expand **Additional script data** and **Additional language data**, then select **Arabic**.
  4. Alternatively, download `ara.traineddata` from [tesseract-ocr/tessdata](https://github.com/tesseract-ocr/tessdata) and paste into `C:\Program Files\Tesseract-OCR\tessdata\`.

### Issue 3: Port 5000 Already in Use
- **Cause**: Another service (such as Docker, Apple AirPlay, or another Flask app) is listening on port 5000.
- **Solution**: Open `.env` and change `PORT=5000` to `PORT=5050` or any available port, then restart `RUN.bat`.

### Issue 4: PyTorch CUDA / GPU Acceleration
- **Note**: AMA automatically runs in optimized **CPU Mode** if an NVIDIA GPU with CUDA is not detected.
- To enable CUDA on Windows 11 with an NVIDIA RTX/GTX GPU, run inside your activated `.venv`:
  ```cmd
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
  ```
  Run `CHECK_SYSTEM.bat` to confirm CUDA status.
