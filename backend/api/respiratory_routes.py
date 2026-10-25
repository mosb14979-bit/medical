"""
backend/api/respiratory_routes.py
Flask Blueprint for Respiratory Sound Analysis endpoints.
Handles audio uploads, calls RespiratoryAnalyzerService, logs analysis, and returns DSP metrics.
"""

import os
import uuid
import json
from flask import Blueprint, request, jsonify
from backend.services.respiratory_service import respiratory_service
from backend.security.validators import validate_file_extension, sanitize_safe_filepath
from backend.database.db import execute_commit
from backend.config import Config

respiratory_bp = Blueprint("respiratory", __name__, url_prefix="/api/respiratory")

@respiratory_bp.route("/analyze", methods=["POST"])
def analyze_respiratory():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided in request."}), 400

    file = request.files["audio"]
    if not file or not file.filename:
        return jsonify({"error": "Empty filename."}), 400

    if not validate_file_extension(file.filename, Config.ALLOWED_AUDIO_EXTENSIONS):
        return jsonify({"error": f"Unsupported audio format. Allowed: {', '.join(Config.ALLOWED_AUDIO_EXTENSIONS)}"}), 400

    language = request.form.get("language", "en")
    temp_dir = os.path.join(Config.UPLOAD_FOLDER, "temp_resp")
    os.makedirs(temp_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    safe_path = sanitize_safe_filepath(unique_filename, temp_dir)

    try:
        file.save(safe_path)
        result = respiratory_service.analyze_audio(safe_path, language=language)

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
                        "respiratory",
                        f"Respiratory Sound: {file.filename}",
                        result["sound_class"],
                        result["confidence"],
                        "Medium" if result["sound_class"] in ["wheeze", "crackle", "stridor"] else "Low",
                        language,
                        json.dumps(result["metrics"])
                    )
                )
            except Exception:
                pass

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Audio processing failed: {str(e)}"}), 500
    finally:
        if Config.AUTO_PURGE_UPLOADS and os.path.exists(safe_path):
            try:
                os.remove(safe_path)
            except Exception:
                pass
