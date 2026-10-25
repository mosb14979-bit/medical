# Data Directory & Manifest Architecture

This directory houses dataset manifests, vetted knowledge bases, and synthetic evaluation samples. Large raw datasets (>100MB) are intentionally excluded from the Git repository to keep the codebase lightweight and compliant with data distribution rules.

## Directory Substructure
- `manifests/`: Machine-readable JSON specifications containing dataset versions, download instructions, checksum schemes, and class distributions.
- `samples/`: Lightweight synthetic test records used for automated CI testing and offline evaluation (no patient private health info).
- `raw/`: Target download directory for external datasets (ignored by Git).
- `processed/`: Intermediate feature caches and normalized inputs (ignored by Git).
