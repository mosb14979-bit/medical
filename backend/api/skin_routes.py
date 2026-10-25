"""
backend/api/skin_routes.py
Flask Blueprint for Skin Image Analysis endpoints.
Validates uploads, calls SkinAnalyzerService, logs analysis, and purges files if configured.
"""

import os
import uuid
import json
from flask import Blueprint, request, jsonify
from backend.services.skin_service import skin_service
from backend.security.validators import validate_file_extension, sanitize_safe_filepath
from backend.database.db import execute_commit
from backend.config import Config

skin_bp = Blueprint("skin", __name__, url_prefix="/api/skin")

@skin_bp.route("/analyze", methods=["POST"])
def analyze_skin():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided in multipart request."}), 400

    file = request.files["image"]
    if not file or not file.filename:
        return jsonify({"error": "Empty filename."}), 400

    if not validate_file_extension(file.filename, Config.ALLOWED_IMAGE_EXTENSIONS):
        return jsonify({"error": f"Unsupported file type. Allowed: {', '.join(Config.ALLOWED_IMAGE_EXTENSIONS)}"}), 400

    language = request.form.get("language", "en")
    temp_dir = os.path.join(Config.UPLOAD_FOLDER, "temp_skin")
    os.makedirs(temp_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    safe_path = sanitize_safe_filepath(unique_filename, temp_dir)

    try:
        file.save(safe_path)
        result = skin_service.analyze_image(safe_path, language=language)

        # Log history if enabled
        if Config.ENABLE_HISTORY_LOGGING:
            try:
                rec_id = str(uuid.uuid4())
                execute_commit(
                    """
                    INSERT INTO analysis_history 
                    (id, module, input_summary, primary_finding, confidence, risk_tier, language, details_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        rec_id,
                        "skin",
                        f"Skin Image: {file.filename}",
                        result["primary_class"],
                        result["primary_confidence"],
                        result["risk_tier"],
                        language,
                        json.dumps(result["predictions"])
                    )
                )
            except Exception:
                pass

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Image analysis failed: {str(e)}"}), 500
    finally:
        if Config.AUTO_PURGE_UPLOADS and os.path.exists(safe_path):
            try:
                os.remove(safe_path)
            except Exception:
                pass
