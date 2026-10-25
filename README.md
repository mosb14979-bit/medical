# AI Medical Assistant (AMA)
### Bilingual, Local-First Medical Information & Research Platform

[![CI Pipeline](https://github.com/organization/ama/actions/workflows/tests.yml/badge.svg)](https://github.com/organization/ama/actions/workflows/tests.yml)
[![Python 3.10 | 3.11](https://img.shields.io/badge/Python-3.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform: Windows 11 | Linux](https://img.shields.io/badge/Platform-Windows%2011%20%7C%20Linux-lightgrey.svg)]()

> **CRITICAL MEDICAL DISCLAIMER**: This application is a scientific research and educational software prototype. It is **NOT** a clinically certified medical device and is **NOT** designed to provide medical diagnoses, treatment plans, or drug dosage recommendations. In case of acute or life-threatening symptoms, immediately contact local emergency services (e.g., 911, 999, 112) or seek attention from licensed healthcare professionals.

---

## 🌟 Overview & Core Capabilities

The **AI Medical Assistant (AMA)** is designed for local-first, privacy-preserving medical exploration. It runs on personal hardware without transmitting sensitive health data to third-party cloud servers.

The platform provides four specialized medical modules:
1. **Medical Chatbot (RAG Engine)**:
   - Grounded knowledge retrieval from trusted medical catalogs (MedlinePlus, WHO, NHS).
   - Real citation tracking with original source attribution.
   - Clinical red-flag and emergency warning detection.
   - Dual-language comprehension (English & Arabic).
2. **Skin Image Analyzer**:
   - Dermoscopic lesion classification based on the international HAM10000 / ISIC dataset standard.
   - Support for 7 standardized diagnostic classes: Actinic keratoses (`akiec`), Basal cell carcinoma (`bcc`), Benign keratosis (`bkl`), Dermatofibroma (`df`), Melanoma (`mel`), Melanocytic nevi (`nv`), and Vascular lesions (`vasc`).
   - Clear distinction between calibrated dermatoscopic images and regular smartphone photos.
3. **Respiratory Sound Analyzer**:
   - Digital stethoscopic sound analysis based on the ICBHI 2017 Respiratory Sound Database ontology.
   - Sound classification (Normal, Wheezes, Crackles, Stridor, Wheeze + Crackle).
   - Audio feature extraction including spectrograms and temporal-spectral metrics.
4. **Laboratory Report Analyzer**:
   - End-to-end local OCR supporting English and Arabic report images (JPG, PNG) and multi-page PDFs.
   - Image contrast enhancement, Otsu binarization, and skew correction.
   - Parsing engine for test names, numerical values, units, reference intervals, and out-of-range flags.
   - Strict warning when user verification is required for low-contrast or ambiguous figures.

---

## 🚀 Rapid Windows 11 Deployment

This repository is pre-configured for zero-friction deployment on **Windows 11**:

### Step 1: Clone or Download
```cmd
git clone https://github.com/your-username/ama.git
cd ama
```

### Step 2: One-Time Automated Setup
Double-click `SETUP.bat` or run in Command Prompt:
```cmd
SETUP.bat
```
This script will:
- Detect your Python 3.10+ / 3.11 installation.
- Create an isolated virtual environment in `.venv`.
- Upgrade pip and install all pinned requirements from `requirements.txt`.
- Inspect your Tesseract OCR installation and Arabic/English language packs.
- Initialize the local SQLite database (`backend/database/ama_local.sqlite`).

### Step 3: Run the Platform
Double-click `RUN.bat` or run:
```cmd
RUN.bat
```
Your default web browser will automatically open:
```text
http://127.0.0.1:5000
```

### Step 4: System Diagnostics
Run `CHECK_SYSTEM.bat` at any time to verify hardware acceleration (CUDA/CPU), Tesseract status, and model manifests.

---

## 🌐 Full Arabic & English Bilingual Experience
AMA features complete bidirectional localization:
- **English**: LTR typography, clinical terminology, and standard Western medical conventions.
- **Arabic**: Full RTL (Right-to-Left) layout, authentic Arabic medical typography, translated reference ranges, and culturally nuanced communication.

---

## 📊 Repository Structure

```text
AMA/
├── AGENTS.md                          # Guidance for automated tools and agentic workflows
├── README.md                          # Platform documentation and quickstart guide
├── requirements.txt                   # Pinned Python dependencies
├── SETUP.bat                          # Automated Windows 11 setup script
├── RUN.bat                            # Windows 11 server launch script
├── CHECK_SYSTEM.bat                   # Hardware and environment diagnostics tool
├── backend/                           # Python Flask backend
│   ├── app.py                         # Application entry point and blueprint registry
│   ├── config.py                      # Environment and configuration settings
│   ├── extensions.py                  # Database and system extensions
│   ├── api/                           # REST API routes (chatbot, skin, resp, lab, history)
│   ├── database/                      # SQLite schema and query abstraction
│   ├── models/                        # PyTorch model architectures
│   ├── schemas/                       # Request/Response validation schemas
│   ├── security/                      # Sanitization and file upload security guards
│   ├── services/                      # RAG, CV inference, audio DSP, and OCR engines
│   └── utils/                         # Helper functions (audio, image, PDF)
├── frontend/                          # Flask static & template assets
│   ├── templates/                     # Semantic HTML5 Jinja2 templates
│   └── static/                        # CSS3 styling, vanilla ES modules, icons
├── data/                              # Sample reports, manifests, and catalog schemas
├── model_artifacts/                   # Model registry, architecture cards, manifests
├── scripts/                           # Training, evaluation, and data preparation scripts
├── tests/                             # Unit, integration, and security test suites
└── docs/                              # Comprehensive architectural and HCI specifications
```

---

## 🔒 Privacy & Local Security
- **No Remote Telemetry**: Medical inputs are processed locally on your machine.
- **Auto-Purge**: Uploaded temporary files are scrubbed immediately following inference.
- **Configurable Retention**: Historical records can be disabled, inspected, or wiped completely via the History tab.

---

## 📜 Documentation Index
- [Architecture & Data Flow](docs/ARCHITECTURE.md)
- [HCI & Usability Specification](docs/HCI_UX_SPECIFICATION.md)
- [Datasets & Licensing](docs/DATASETS_AND_LICENSES.md)
- [Model Cards & Performance](docs/MODEL_CARD.md)
- [Privacy & Security Protocol](docs/PRIVACY.md)
- [Testing & Quality Assurance](docs/TESTING.md)
- [Troubleshooting & Windows Guide](docs/TROUBLESHOOTING.md)
