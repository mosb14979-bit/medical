"""
tests/test_skin_service.py
Validates skin lesion analyzer preprocessing, ISIC 7-class prediction output, and dermoscopy warnings.
"""

import os
import tempfile
import numpy as np
from PIL import Image
import pytest
from backend.services.skin_service import skin_service

@pytest.fixture
def sample_dermoscopic_image():
    # Create synthetic 224x224 RGB image with darker periphery (simulating dermoscopic lens)
    arr = np.ones((224, 224, 3), dtype=np.uint8) * 180
    # Darker border
    arr[:20, :, :] = 50
    arr[-20:, :, :] = 50
    arr[:, :20, :] = 50
    arr[:, -20:, :] = 50
    # Lesion center
    arr[90:134, 90:134, 0] = 80 # Brownish/dark
    arr[90:134, 90:134, 1] = 60
    arr[90:134, 90:134, 2] = 50

    img = Image.fromarray(arr)
    temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    img.save(temp_file.name)
    yield temp_file.name
    try:
        os.remove(temp_file.name)
    except Exception:
        pass

def test_skin_analysis_output(sample_dermoscopic_image):
    result = skin_service.analyze_image(sample_dermoscopic_image, language="en")
    assert "primary_class" in result
    assert result["primary_class"] in ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
    assert len(result["predictions"]) == 7
    assert result["primary_confidence"] > 0
    assert "clinical_disclaimer" in result

def test_skin_analysis_arabic(sample_dermoscopic_image):
    result = skin_service.analyze_image(sample_dermoscopic_image, language="ar")
    assert "تنبيه" in result["clinical_disclaimer"]
