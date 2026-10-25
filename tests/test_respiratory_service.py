"""
tests/test_respiratory_service.py
Validates respiratory audio loading, duration/silence checks, and ICBHI category prediction.
"""

import os
import wave
import tempfile
import numpy as np
import pytest
from backend.services.respiratory_service import respiratory_service

@pytest.fixture
def synthetic_wav_file():
    # Generate 3.0-second synthetic audio wave with 440 Hz tone
    sr = 16000
    duration = 3.0
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    samples = (0.5 * np.sin(2 * np.pi * 440 * t) * 32767).astype(np.int16)

    temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    with wave.open(temp_file.name, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(samples.tobytes())

    yield temp_file.name
    try:
        os.remove(temp_file.name)
    except Exception:
        pass

def test_respiratory_audio_analysis(synthetic_wav_file):
    res = respiratory_service.analyze_audio(synthetic_wav_file, language="en")
    assert "sound_class" in res
    assert res["sound_class"] in ["normal", "wheeze", "crackle", "wheeze_crackle", "stridor"]
    assert res["metrics"]["duration_sec"] >= 2.9
    assert len(res["spectrogram_preview"]) == 20
    assert "clinical_disclaimer" in res

def test_silent_audio_rejection():
    # Silent 2.0-second file
    sr = 16000
    duration = 2.0
    samples = np.zeros(int(sr * duration), dtype=np.int16)

    temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    with wave.open(temp_file.name, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(samples.tobytes())

    with pytest.raises(ValueError, match="silent"):
        respiratory_service.analyze_audio(temp_file.name)

    try:
        os.remove(temp_file.name)
    except Exception:
        pass
