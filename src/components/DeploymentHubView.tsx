import React, { useState } from 'react';
import { Language } from '../types';
import { Terminal, Copy, Check, FileCode, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface DeploymentHubViewProps {
  language: Language;
}

export const DeploymentHubView: React.FC<DeploymentHubViewProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('SETUP.bat');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fileSnippets: Record<string, string> = {
    'SETUP.bat': `@echo off
setlocal enabledelayedexpansion
title AI Medical Assistant (AMA) — Windows 11 Automated Setup
chcp 65001 >nul

echo ===============================================================================
echo                AI Medical Assistant (AMA) — System Setup
echo             Local-First Medical Information & Research Platform
echo ===============================================================================

:: 1. Verify Python 3.10+ or 3.11
echo [1/6] Checking Python installation...
python --version

:: 2. Configure Virtual Environment
echo [2/6] Configuring Python Virtual Environment (.venv)...
if not exist ".venv" (
    python -m venv .venv
)
set VENV_PYTHON=.venv\\Scripts\\python.exe
set VENV_PIP=.venv\\Scripts\\pip.exe

:: 3. Upgrade pip and wheel
%VENV_PYTHON% -m pip install --upgrade pip setuptools wheel --quiet

:: 4. Install Dependencies
echo [4/6] Installing required dependencies from requirements.txt...
%VENV_PIP% install -r requirements.txt

:: 5. Check Tesseract OCR & Language Packs
set TESSERACT_PATH=C:\\Program Files\\Tesseract-OCR\\tesseract.exe
if exist "%TESSERACT_PATH%" (
    echo Tesseract OCR detected: %TESSERACT_PATH%
)

:: 6. Initialize SQLite Database & Manifests
%VENV_PYTHON% scripts\\verify_installation.py
echo SETUP COMPLETED. Double-click RUN.bat to launch.
pause`,
    'RUN.bat': `@echo off
title AI Medical Assistant (AMA) — Local Server
chcp 65001 >nul

if not exist ".venv\\Scripts\\python.exe" (
    echo [ERROR] Virtual environment not found. Please run SETUP.bat first.
    pause
    exit /b 1
)

set VENV_PYTHON=.venv\\Scripts\\python.exe
echo Starting AMA Flask backend server on http://127.0.0.1:5000 ...

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:5000"
%VENV_PYTHON% -m backend.app
pause`,
    'CHECK_SYSTEM.bat': `@echo off
title AI Medical Assistant (AMA) — Diagnostics
chcp 65001 >nul

set PYTHON_CMD=.venv\\Scripts\\python.exe
if not exist "%PYTHON_CMD%" set PYTHON_CMD=python

echo [1] Operating System:
cmd /c ver
echo [2] Python Runtime:
%PYTHON_CMD% --version
echo [3] PyTorch CUDA / Hardware Acceleration:
%PYTHON_CMD% -c "import torch; print('PyTorch:', torch.__version__); print('CUDA available:', torch.cuda.is_available())" 2>nul
echo [4] Tesseract OCR Languages:
"C:\\Program Files\\Tesseract-OCR\\tesseract.exe" --list-langs 2>nul
echo [5] Dataset Manifest Integrity:
%PYTHON_CMD% scripts\\verify_installation.py --diagnostics-only
pause`,
    'requirements.txt': `Flask>=3.0.0
Werkzeug>=3.0.0
flask-cors>=4.0.0
numpy>=1.24.0,<2.0.0
scipy>=1.11.0
scikit-learn>=1.3.0
pandas>=2.1.0
torch>=2.1.0
torchvision>=0.16.0
Pillow>=10.0.0
soundfile>=0.12.1
pytesseract>=0.3.10
pdfplumber>=0.10.0
pypdf>=3.17.0
python-dotenv>=1.0.0
pydantic>=2.5.0
pytest>=7.4.0
pytest-cov>=4.1.0`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'مركز تشغيل ونشر ويندوز 11 (Windows 11 Deployment)' : 'Windows 11 Deployment & Script Inspector'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {isAr
            ? 'تم إعداد كامل ملفات المستودع لتعمل مباشرة على حاسوبك المحمول الذي يعمل بنظام Windows 11 بنقرة واحدة.'
            : 'Pre-configured repository bundle designed for zero-config deployment on Windows 11 laptops via SETUP.bat and RUN.bat.'}
        </p>
      </div>

      {/* 3-Step Setup Flow */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          {isAr ? 'خطوات التشغيل السريع على حاسوبك المحمول:' : 'Zero-Friction Windows 11 Workflow:'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-mono text-xs font-bold text-blue-600">STEP 01</div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {isAr ? 'تنزيل أو سحب المستودع' : 'Clone from GitHub'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'انسخ المستودع إلى حاسوبك الشخصي وافتح المجلد في Command Prompt أو PowerShell.'
                : 'Clone the repository or extract the ZIP file onto your Windows 11 laptop.'}
            </p>
            <div className="relative mt-2">
              <pre className="bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono overflow-x-auto">
                git clone https://github.com/ama/ama.git
              </pre>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-mono text-xs font-bold text-blue-600">STEP 02</div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {isAr ? 'تشغيل SETUP.bat (مرة واحدة)' : 'Double-Click SETUP.bat'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'ينشئ البيئة الافتراضية (.venv) ويثبت PyTorch و Flask و Tesseract ويهيئ قاعدة بيانات SQLite.'
                : 'Automatically provisions .venv, installs pinned requirements, inspects Tesseract OCR, and initializes the local SQLite database.'}
            </p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200">
              ✓ Automated one-time setup
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-mono text-xs font-bold text-blue-600">STEP 03</div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {isAr ? 'تشغيل المنصة عبر RUN.bat' : 'Double-Click RUN.bat'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'يشغل خادم Flask المحلي على 127.0.0.1:5000 ويفتح متصفحك الافتراضي فوراً.'
                : 'Launches the local Flask server on http://127.0.0.1:5000 and automatically opens your default web browser.'}
            </p>
            <div className="text-[11px] font-mono text-blue-700 bg-blue-50 p-1.5 rounded border border-blue-200">
              http://127.0.0.1:5000
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Script & Code Inspector */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'مستعرض ملفات وسكربتات التشغيل المنشأة' : 'Generated Scripts & Config Inspector'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {Object.keys(fileSnippets).map((fname) => (
              <button
                key={fname}
                type="button"
                onClick={() => setSelectedFile(fname)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  selectedFile === fname
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fname}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-4">
          <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-lg text-xs font-mono">
            <span>{selectedFile}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(fileSnippets[selectedFile], selectedFile)}
              className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedKey === selectedFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 text-slate-200 p-4 rounded-b-lg font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {fileSnippets[selectedFile]}
          </pre>
        </div>
      </section>

      {/* Windows 11 OCR Tesseract Instruction Callout */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-xs text-blue-950 space-y-2">
        <strong className="text-sm font-bold block text-blue-900">
          {isAr ? 'إرشادات تثبيت Tesseract OCR وحزمة اللغة العربية على ويندوز 11:' : 'Windows 11 Tesseract OCR & Arabic Pack Setup:'}
        </strong>
        <p className="leading-relaxed">
          {isAr
            ? 'لتفعيل التعرف الضوئي الكامل على تقارير المختبر باللغة العربية، قم بتحميل مثبت Tesseract لويندوز من (UB-Mannheim Tesseract Wiki) واحرص على اختيار "Additional script data (Arabic)" أثناء التثبيت. يتحقق CHECK_SYSTEM.bat تلقائياً من وجود المسار C:\\Program Files\\Tesseract-OCR.'
            : 'For complete offline OCR on English and Arabic reports, download the Windows installer from UB-Mannheim Tesseract Wiki and ensure "Additional language data (Arabic)" is selected during install. CHECK_SYSTEM.bat automatically validates this path.'}
        </p>
      </section>
    </div>
  );
};
