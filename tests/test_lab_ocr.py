"""
tests/test_lab_ocr.py
Validates laboratory report parsing, out-of-range flag calculations, and synthetic report fixtures.
"""

import os
import pytest
from backend.services.lab_ocr_service import lab_ocr_engine

def test_parse_synthetic_english_report():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    sample_file = os.path.join(workspace, "data", "samples", "synthetic_lab_report_en.txt")
    with open(sample_file, "r", encoding="utf-8") as f:
        text = f.read()

    result = lab_ocr_engine.parse_report_content(text, language="en")
    assert result["total_extracted"] > 5
    
    # Verify specific known tests
    test_map = {t["test_name"].lower(): t for t in result["parsed_tests"]}
    assert "hemoglobin" in test_map
    assert test_map["hemoglobin"]["value"] == 14.2
    assert test_map["hemoglobin"]["flag"] == "NORMAL"

    # Fasting glucose 112 should be flagged HIGH (normal is 70-99)
    assert "fasting glucose" in test_map
    assert test_map["fasting glucose"]["value"] == 112.0
    assert test_map["fasting glucose"]["flag"] == "HIGH"
    assert test_map["fasting glucose"]["requires_review"] is True

def test_parse_synthetic_arabic_report():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    sample_file = os.path.join(workspace, "data", "samples", "synthetic_lab_report_ar.txt")
    with open(sample_file, "r", encoding="utf-8") as f:
        text = f.read()

    result = lab_ocr_engine.parse_report_content(text, language="ar")
    assert result["total_extracted"] > 4
    test_names = [t["test_name"] for t in result["parsed_tests"]]
    assert any("الهيموغلوبين" in n for n in test_names)
    assert any("سكر الدم الصائم" in n for n in test_names)
