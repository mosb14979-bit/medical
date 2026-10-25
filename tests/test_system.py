"""
tests/test_system.py
Validates system configuration, manifest loading, and database integrity.
"""

import os
import json
import pytest
from backend.config import Config
from backend.services.system_service import get_system_diagnostics

def test_config_defaults():
    assert Config.PORT == 5000
    assert Config.MAX_CONTENT_LENGTH > 0
    assert ".jpg" in Config.ALLOWED_IMAGE_EXTENSIONS
    assert ".wav" in Config.ALLOWED_AUDIO_EXTENSIONS
    assert ".pdf" in Config.ALLOWED_DOC_EXTENSIONS

def test_system_diagnostics():
    diag = get_system_diagnostics()
    assert "os" in diag
    assert "torch" in diag
    assert "ocr" in diag
    assert "models" in diag
    assert diag["status"] == "operational"

def test_manifests_exist():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    isic_path = os.path.join(workspace, "data", "manifests", "isic_ham10000_manifest.json")
    icbhi_path = os.path.join(workspace, "data", "manifests", "icbhi_2017_manifest.json")
    kb_path = os.path.join(workspace, "data", "manifests", "medlineplus_kb_manifest.json")

    assert os.path.exists(isic_path)
    assert os.path.exists(icbhi_path)
    assert os.path.exists(kb_path)
