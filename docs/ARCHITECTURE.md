# AMA Architecture & Data Flow Specification

## 1. High-Level System Architecture

The AI Medical Assistant (AMA) employs a modular, local-first layered architecture designed for deterministic execution, high performance, and zero cloud dependency.

```text
+-----------------------------------------------------------------------------------+
|                            Presentation Layer                                     |
|  - Semantic HTML5 / CSS3 Design Tokens / Vanilla ES6 Javascript                   |
|  - Bidirectional Localization Engine (LTR English / RTL Arabic)                  |
|  - Responsive Medical Dashboard, Visualizers & Real-time Client Form Validators   |
+-----------------------------------------------------------------------------------+
                                       |
                                       v  HTTP / JSON / Multi-part FormData
+-----------------------------------------------------------------------------------+
|                        Flask Application & API Gateway                            |
|  - Flask Blueprints: /api/chatbot, /api/skin, /api/respiratory, /api/lab, /api/sys|
|  - Security Middleware: MIME & Signature Validation, File Size & Path Normalization|
+-----------------------------------------------------------------------------------+
       |                       |                       |                      |
       v                       v                       v                      v
+--------------+       +---------------+       +---------------+      +-------------+
| RAG Chatbot  |       | Skin Analyzer |       |  Respiratory  |      |  Lab Report |
| Service      |       | Pipeline      |       |  Analyzer DSP |      |  OCR & NLP  |
| - Text Token |       | - Preprocess  |       | - Normaliz.   |      | - Deskew/Otsu
| - BM25/Cosine|       | - PyTorch CNN |       | - Spec FFT    |      | - Tesseract |
| - Evidence KB|       | - Softmax Cal |       | - Feature Ext |      | - Regex Par.|
| - Red-Flag Dx|       | - Derm vs Cam |       | - ICBHI Model |      | - Ref Range |
+--------------+       +---------------+       +---------------+      +-------------+
       \                       |                       |                      /
        +--------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                             Storage & Persistence                                 |
|  - SQLite (WAL mode, parameterized transactions, auto-indexing)                   |
|  - Zero-retention ephemeral scratchpad for image/audio inference                  |
|  - Encrypted / Local audit trails and customizable history purging                |
+-----------------------------------------------------------------------------------+
```

---

## 2. Module Implementations & Data Flow

### 2.1 Module A: Medical Chatbot (RAG Engine)
1. **Query Ingestion**: Sanitizes incoming user prompt, strips script injection vectors, and extracts clinical keyphrases.
2. **Emergency Triage Check**: Fast regex-based screening against an emergency ontology (cardiac arrest, anaphylaxis, severe respiratory failure). If matched, returns prioritized emergency protocols.
3. **Retrieval**: Executes dual lexical (BM25) and cosine vector similarity searches over the vetted knowledge base (MedlinePlus, WHO, NHS guidelines).
4. **Answer Construction**: Ranks candidate passages, synthesizes an informative response in the user's selected language, appends verifiable source citations, and adds explicit clinical limitation warnings.

### 2.2 Module B: Skin Image Analyzer
1. **Validation**: Verifies image dimensions (min 128x128, max 4096x4096), RGB channels, and file headers (JPEG/PNG).
2. **Preprocessing**: Normalizes resolution to 224x224, applies ImageNet mean/standard deviation normalization.
3. **PyTorch Inference**: Evaluates image against an EfficientNet/MobileNet architecture trained on the 7 ISIC/HAM10000 classes.
4. **Reliability & Metadata**: Calibrates logits, checks color distribution to warn if an image appears to be an unmagnified phone photo rather than a dermoscopic scan, and outputs class confidence breakdown.

### 2.3 Module C: Respiratory Sound Analyzer
1. **Audio Validation**: Inspects WAV/MP3 container, verifies duration (1.0s to 60.0s), detects silence or clipped amplitude.
2. **DSP Pipeline**: Resamples to 16 kHz or 22.05 kHz, removes DC offset, computes STFT (Short-Time Fourier Transform) and log-Mel spectrogram (128 Mel bands).
3. **Classification**: Evaluates spectral features against ICBHI 2017 sound categories (Normal, Wheezes, Crackles, Stridor, Wheeze+Crackle).
4. **Visual Delivery**: Generates frequency vs. time visual representations and highlights detected adventitious breath sounds.

### 2.4 Module D: Laboratory Report Analyzer
1. **Document Ingestion**: Accepts PNG, JPEG, and multi-page PDF documents. Converts PDF pages safely to 300 DPI images.
2. **Computer Vision Enhancement**: Grayscale conversion, adaptive Otsu thresholding, morphological noise reduction, and Hough transform deskewing.
3. **Dual OCR Execution**: Dispatches to Tesseract OCR with dual language support (`eng+ara`), reporting confidence per line.
4. **Deterministic Information Extraction**: Parses test nomenclature (e.g., Hemoglobin, Fasting Blood Glucose, Creatinine, TSH), numeric values, measurement units, and printed reference intervals.
5. **Flagging Engine**: Compares observed value with lower/upper reference boundaries and assigns semantic flags (`Low`, `Normal`, `High`, `Critical`), with mandatory manual review markers for low-contrast scans.
