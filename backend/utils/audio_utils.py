"""
backend/utils/audio_utils.py
Audio signal processing utilities for respiratory cycle extraction and normalization.
"""

import numpy as np

def compute_rms(signal: np.ndarray) -> float:
    """Computes Root Mean Square energy of discrete audio array."""
    if len(signal) == 0:
        return 0.0
    return float(np.sqrt(np.mean(signal ** 2)))

def normalize_peak(signal: np.ndarray) -> np.ndarray:
    """Normalizes peak amplitude to prevent clipping and balance volume."""
    max_amp = np.max(np.abs(signal))
    if max_amp < 1e-6:
        return signal
    return signal / max_amp
