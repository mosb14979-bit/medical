# AGENTS.md — Development & Operational Guidelines for AI Medical Assistant (AMA)

This document specifies the operational guidelines, architectural boundaries, and safety invariants for automated coding agents and human contributors working on the AI Medical Assistant (AMA) codebase.

---

## 1. Core Mission & Invariants

1. **Non-Diagnostic Educational Platform**: AMA is a research, educational, and clinical informatics platform. Never introduce language or UI cues asserting that the system provides definitive medical diagnoses, prescribes medications, calculates individualized dosages, or replaces licensed clinical evaluation.
2. **Local-First & Offline Privacy**: Patient data, uploaded dermatology photos, respiratory recordings, and laboratory reports must never be exfiltrated to unauthorized cloud endpoints. Temporary uploads must be removed immediately after inference.
3. **Transparent Model Readiness**: Never fake model inference or return arbitrary hardcoded confidence scores (e.g., "94.7% accuracy") when model weights or hardware are missing. If an artifact or engine (such as Tesseract OCR or PyTorch checkpoint) is absent, the system must explicitly inform the user and switch to documented analytical heuristics or structured fallback with transparent uncertainty metrics.
4. **Bilingual Parity**: Every module, form, table, alert, and report must have full parity in English (LTR) and Arabic (RTL). Never mix languages within a single label or corrupt directional formatting.

---

## 2. Directory Layout & Separation of Concerns

```text
AMA/
├── SETUP.bat, RUN.bat, CHECK_SYSTEM.bat   <- Windows 11 zero-config batch entry points
├── backend/                                <- Python 3.11 Flask server
│   ├── api/                               <- Blueprints (REST endpoints)
│   ├── database/                          <- SQLite schema & parameterized query helpers
│   ├── models/                            <- PyTorch neural network architectures
│   ├── schemas/                           <- Validation schemas & type contracts
│   ├── security/                          <- File sanitizers, size guards, injection defenses
│   └── services/                          <- RAG engine, image pipeline, audio pipeline, OCR
├── frontend/                               <- Vanilla ES6 JS, semantic HTML5, CSS3 design tokens
├── data/                                  <- Manifests, sample files, vetted source catalogs
├── model_artifacts/                       <- Model cards, manifests, evaluation benchmarks
├── scripts/                               <- Data prep, training, verification, evaluation
├── tests/                                 <- Pytest suite (unit, integration, api, fixtures)
└── docs/                                  <- Architecture, HCI/UX, Privacy, Security specs
```

---

## 3. Mandatory Safety Rules for Code Generation

- **SQL Parameterization**: Use `?` placeholders with `sqlite3` for all parameter bindings. String interpolation (`f"SELECT ... {id}"`) is strictly prohibited.
- **File Validation**: Validate MIME types, magic byte signatures, and enforce maximum file size limits (16 MB) prior to disk write or in-memory decoding.
- **OCR Robustness**: Handle multi-page PDFs with strict page caps (default: 5 pages). Check for Tesseract language packs (`eng`, `ara`) before attempting OCR, and fall back to native PDF text extraction or structured manual review.
- **Audio Preprocessing**: Normalize sample rates (16 kHz / 22.05 kHz) and reject pure silence, corrupted headers, or non-audio payloads gracefully.
- **Emergency Triage Filter**: When a user's prompt contains critical red-flag symptoms (severe chest pain, acute shortness of breath, signs of stroke, anaphylaxis), immediately prioritize emergency contact information (911/999/112) above general educational text.

---

## 4. Testing & Verification Protocol

Before pushing code:
1. Run `python scripts/verify_installation.py` to ensure schema, manifests, and dependencies pass.
2. Run `pytest tests/ -v` to ensure unit, integration, and security tests pass.
3. Verify that all four modules handle empty inputs, invalid file types, and oversized files gracefully with human-readable error messages.
