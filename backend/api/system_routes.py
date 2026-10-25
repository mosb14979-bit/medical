"""
backend/api/system_routes.py
Flask Blueprint for System Diagnostics and Model Manifests.
"""

import os
import json
from flask import Blueprint, jsonify
from backend.services.system_service import get_system_diagnostics

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

system_bp = Blueprint("system", __name__, url_prefix="/api/system")

@system_bp.route("/status", methods=["GET"])
def system_status():
    return jsonify(get_system_diagnostics())

@system_bp.route("/manifests", methods=["GET"])
def get_manifests():
    manifest_dir = os.path.join(WORKSPACE_ROOT, "data", "manifests")
    manifests = {}
    if os.path.exists(manifest_dir):
        for fname in os.listdir(manifest_dir):
            if fname.endswith(".json"):
                fpath = os.path.join(manifest_dir, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        manifests[fname] = json.load(f)
                except Exception:
                    pass
    return jsonify(manifests)
