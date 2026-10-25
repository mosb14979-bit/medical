# Model Artifacts Directory

This folder manages model metadata, manifests, and architecture definitions. Checkpoint weight files (`.pth`, `.pt`, `.onnx`) exceeding 50 MB are not committed to Git to preserve repository hygiene.

To download or train model weights, refer to `scripts/train_skin_model.py` and `scripts/train_respiratory_model.py`.
The platform functions gracefully with structural verification and calibrated analytical pipelines when weights are pending.
