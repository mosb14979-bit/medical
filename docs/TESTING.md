# Testing & Quality Assurance Protocol

## 1. Test Suite Organization

The platform includes an automated testing suite designed for execution via `pytest`:

```text
tests/
├── test_system.py                 # Core startup, configuration, and manifest integrity
├── test_chatbot_rag.py            # Knowledge retrieval, citation verification, red-flag triage
├── test_skin_service.py           # Preprocessing, normalization, confidence calibration
├── test_respiratory_service.py    # Audio validation, feature extraction, spectrogram calculation
├── test_lab_ocr.py                # Regex extraction, out-of-range flag calculation, synthetic report parsing
└── test_security_sanitization.py  # Path traversal, oversized payload rejection, XSS escaping
```

---

## 2. Running Tests Locally

### On Windows 11:
```cmd
.venv\Scripts\activate
pytest tests/ -v
```

### On Linux / macOS:
```bash
python3 -m pytest tests/ -v --tb=short
```

---

## 3. Synthetic Fixtures & Zero Fabricated Data

All unit and integration tests use explicitly labeled **synthetic fixtures**:
- `data/samples/synthetic_lab_report_en.txt`: Simulated CBC and metabolic panel with known expected values (Hemoglobin 14.2 g/dL, Glucose 105 mg/dL).
- `data/samples/synthetic_lab_report_ar.txt`: Simulated Arabic laboratory report with Arabic medical terms (الهيموغلوبين, سكر الدم الصائم).
- Synthetic audio sine wave and chirps to verify spectrogram generation without requiring copyright-restricted auscultation files in Git.
