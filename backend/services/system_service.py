"""
backend/services/system_service.py
System diagnostics, hardware detection, model manifest registry, and OCR status aggregator.
"""

import os
import sys
import platform
import json
import shutil
from backend.config import Config
from backend.services.lab_ocr_service import lab_ocr_engine

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def get_system_diagnostics() -> dict:
    # 1. Hardware & OS
    os_info = {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "python_version": sys.version.split()[0]
    }

    # 2. PyTorch & GPU
    torch_info = {
        "installed": False,
        "version": None,
        "cuda_available": False,
        "device_count": 0,
        "device_name": "CPU"
    }
    try:
        import torch
        torch_info["installed"] = True
        torch_info["version"] = torch.__version__
        torch_info["cuda_available"] = torch.cuda.is_available()
        if torch.cuda.is_available():
            torch_info["device_count"] = torch.cuda.device_count()
            torch_info["device_name"] = torch.cuda.get_device_name(0)
    except ImportError:
        pass

    # 3. OCR Engine
    ocr_info = lab_ocr_engine.is_engine_ready()

    # 4. Model Registry Status
    registry_path = os.path.join(WORKSPACE_ROOT, "model_artifacts", "manifests", "model_registry.json")
    models = {}
    if os.path.exists(registry_path):
        try:
            with open(registry_path, "r", encoding="utf-8") as f:
                registry_data = json.load(f)
                models = registry_data.get("models", {})
        except Exception:
            pass

    return {
        "os": os_info,
        "torch": torch_info,
        "ocr": ocr_info,
        "models": models,
        "status": "operational"
    }
