# Human-Computer Interaction & UX Specification

## 1. Ergonomic & Usability Principles

The interface of the AI Medical Assistant (AMA) adheres strictly to **Nielsen's 10 Usability Heuristics** and **WCAG 2.2 AA Accessibility Guidelines**.

### 1. Visibility of System Status
- Explicit status indicators (`Ready`, `Processing`, `Extracting Text`, `Inferring`, `Warning`).
- Dynamic visual feedback during audio playback and file uploads.
- Clear hardware and dependency telemetry (e.g., whether Tesseract OCR or GPU acceleration is active).

### 2. Match Between System and Real World
- Natural clinical terminology (e.g., "Reference Interval", "Adventitious Sounds", "Dermoscopic Features") paired with plain-language explanations.
- Standardized medical unit formats ($\text{mg/dL}$, $\text{g/dL}$, $\text{mmol/L}$, $\text{mIU/L}$).

### 3. User Control & Freedom
- Complete history purging and selective deletion.
- Cancelable operations and reset buttons on all forms.
- Interactive threshold adjusters allowing users to verify and correct parsed OCR values before committing.

### 4. Consistency & Standards
- Universal design tokens across all views: consistent typography (`Plus Jakarta Sans` / `IBM Plex Sans`), monospace figures (`font-mono tabular-nums`), and structured card layouts.
- Reusable alert, table, and button components.

### 5. Error Prevention
- Client-side pre-flight checks: file size constraints, format validation, duration checks for audio.
- Explicit warnings before permanently deleting history records.

### 6. Recognition Rather Than Recall
- Pre-loaded sample reports (English & Arabic), sample skin images, and sample respiratory audio clips to demonstrate valid input formats.
- Persistent instructions and accepted file extensions displayed inside upload drop zones.

### 7. Flexibility & Efficiency
- Full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
- Rapid preset selectors for common medical inquiries.

### 8. Aesthetic & Minimalist Design
- Zero visual fluff: no decorative gradients or bouncing elements.
- Strict 60-30-10 color budget: 60% clinical slate/white background, 30% crisp structural borders/panels, 10% calm cobalt and telemetry accents.

### 9. Error Recovery
- Detailed, friendly diagnostic messages explaining why an operation failed (e.g., "Image too dark or blurry for confident OCR analysis") with actionable corrective steps.

### 10. Help & Documentation
- Contextual tooltips explaining model confidence, reference ranges, and scientific citations.
- Direct access to the Model Card and System Diagnostics from the navigation bar.

---

## 2. Bilingual Parity & RTL Layout System

AMA provides first-class bidirectional localization:
- **Directional Switching**: Changing language toggles the document root `dir="rtl"` / `dir="ltr"` and `lang="ar"` / `lang="en"`.
- **Mirroring Invariants**: Navigation rails, form labels, icons, modal action sequences, and table column alignments automatically mirror to maintain natural reading rhythm.
- **Arabic Typography**: Utilizes modern, legible Arabic fonts with proper letter connections and adjusted line heights to avoid clipping diacritics.
