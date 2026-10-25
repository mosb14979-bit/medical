"""
backend/api/lab_routes.py
Flask Blueprint for Laboratory Report OCR & Analysis endpoints.
Handles document uploads, invokes OCR extraction, parses test metrics, and supports sample fixtures.
"""

import os
import uuid
import json
from flask import Blueprint, request, jsonify
from backend.services.lab_ocr_service import lab_ocr_engine
from backend.security.validators import validate_file_extension, sanitize_safe_filepath
from backend.database.db import execute_commit
from backend.config import Config

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

lab_bp = Blueprint("lab", __name__, url_prefix="/api/lab")

@lab_bp.route("/analyze", methods=["POST"])
def analyze_lab_report():
    language = request.form.get("language", "en")
    
    # Check if direct text content was provided
    direct_text = request.form.get("direct_text")
    if direct_text and direct_text.strip():
        result = lab_ocr_engine.parse_report_content(direct_text, language=language)
        result["ocr_confidence"] = 98.0
        result["notes"] = ["Analyzed directly submitted digital medical report text."]
        return jsonify(result)

    if "document" not in request.files:
        return jsonify({"error": "No document or report file provided in request."}), 400

    file = request.files["document"]
    if not file or not file.filename:
        return jsonify({"error": "Empty filename."}), 400

    if not validate_file_extension(file.filename, Config.ALLOWED_DOC_EXTENSIONS | {".txt"}):
        return jsonify({"error": f"Unsupported format. Allowed: {', '.join(Config.ALLOWED_DOC_EXTENSIONS)}"}), 400

    temp_dir = os.path.join(Config.UPLOAD_FOLDER, "temp_lab")
    os.makedirs(temp_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    safe_path = sanitize_safe_filepath(unique_filename, temp_dir)

    try:
        file.save(safe_path)
        raw_text, ocr_conf, notes = lab_ocr_engine.extract_text_from_file(safe_path)
        result = lab_ocr_engine.parse_report_content(raw_text, language=language)
        result["ocr_confidence"] = round(ocr_conf, 1)
        result["notes"] = notes

        if Config.ENABLE_HISTORY_LOGGING:
            try:
                rec_id = str(uuid.uuid4())
                execute_commit(
                    """
                    INSERT INTO lab_reports 
                    (id, filename, extracted_text, tests_json, abnormal_count, ocr_confidence, requires_review)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        rec_id,
                        file.filename,
                        raw_text[:1000],
                        json.dumps(result["parsed_tests"]),
                        result["abnormal_count"],
                        result["ocr_confidence"],
                        1 if result["abnormal_count"] > 0 else 0
                    )
                )
            except Exception:
                pass

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Report processing failed: {str(e)}"}), 500
    finally:
        if Config.AUTO_PURGE_UPLOADS and os.path.exists(safe_path):
            try:
                os.remove(safe_path)
            except Exception:
                pass

@lab_bp.route("/sample", methods=["GET"])
def get_sample_report():
    lang = request.args.get("lang", "en")
    filename = "synthetic_lab_report_ar.txt" if lang == "ar" else "synthetic_lab_report_en.txt"
    sample_path = os.path.join(WORKSPACE_ROOT, "data", "samples", filename)

    if os.path.exists(sample_path):
        with open(sample_path, "r", encoding="utf-8") as f:
            content = f.read()
        return jsonify({
            "language": lang,
            "filename": filename,
            "content": content
        })
    return jsonify({"error": "Sample file not found"}), 404
