# Model Cards & Verification Protocol

## 1. Skin Lesion Classifier (ISIC-HAM10000)

- **Model Architecture**: Deep Residual Convolutional Neural Network (EfficientNet-B0 backbone with customized classification head).
- **Input Dimension**: `(3, 224, 224)` tensor, normalized with standard ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.
- **Output**: 7-class probability distribution via temperature-calibrated Softmax.
- **Training Protocol**:
  - Pre-trained on ImageNet-1K, fine-tuned on HAM10000 with cross-entropy loss weighted inversely by class frequencies.
  - Lesion-level split preventing identical patient lesions across train and validation sets.
  - Data augmentation: Random horizontal/vertical flips, affine rotations ($\pm 30^{\circ}$), subtle color jitter.
- **Evaluation Metrics (Held-out Test Cohort)**:
  - Macro-Averaged F1-Score: 0.812
  - Melanoma (`mel`) Sensitivity / Recall: 0.835
  - Basal Cell Carcinoma (`bcc`) Recall: 0.864
  - Melanocytic Nevi (`nv`) Precision: 0.912
- **Confidence Calibration**: Platt scaling / temperature scaling applied to prevent overconfident erroneous predictions on out-of-distribution inputs.
- **Ethical & Clinical Boundaries**: The model is trained predominantly on Caucasian skin types (Fitzpatrick scale I–III). Performance on richly pigmented skin (Fitzpatrick IV–VI) is clinically unvalidated. It must never replace histopathological biopsy.

---

## 2. Respiratory Auscultation Classifier (ICBHI-2017)

- **Model Architecture**: 2D Spectrogram Convolutional Network with Temporal Max-Pooling.
- **Input Representation**: Log-Mel Spectrogram (128 Mel frequency bins, $N_{\text{FFT}}=1024$, hop length = 512, sample rate normalized to 16,000 Hz).
- **Output**: 5 auscultation categories (`Normal`, `Wheeze`, `Crackle`, `Wheeze+Crackle`, `Stridor`).
- **Evaluation Protocol**:
  - 60/40 Patient-Independent Split (no recording from any patient in the test set appears in training).
  - ICBHI Standard Score ($S_{\text{ICBHI}} = \frac{\text{Sensitivity} + \text{Specificity}}{2}$): 0.738
- **Failure Modes**: Background stethoscope friction, chest hair artifacts, patient speaking or coughing during auscultation.

---

## 3. Laboratory Report OCR Engine

- **Engine**: Tesseract OCR (LSTM-based neural recognizer, v5.x) + Local Heuristic Parser.
- **Supported Languages**: `eng` (English), `ara` (Arabic), `eng+ara` (Bilingual composite).
- **Confidence Metric**: Character-level confidence scores aggregated per parsed bounding box.
- **Mandatory Review Condition**: Any parsed laboratory test with OCR confidence below 75% or with an unparseable reference interval is flagged with a visual warning requiring user confirmation.
