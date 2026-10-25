"""
backend/api/history_routes.py
Flask Blueprint for local analysis history management and privacy purging.
"""

from flask import Blueprint, request, jsonify
from backend.database.db import execute_query, execute_commit

history_bp = Blueprint("history", __name__, url_prefix="/api/history")

@history_bp.route("", methods=["GET"])
def list_history():
    module = request.args.get("module")
    if module:
        rows = execute_query(
            "SELECT * FROM analysis_history WHERE module = ? ORDER BY timestamp DESC LIMIT 50",
            (module,)
        )
    else:
        rows = execute_query(
            "SELECT * FROM analysis_history ORDER BY timestamp DESC LIMIT 50"
        )
    return jsonify(rows)

@history_bp.route("/delete/<string:record_id>", methods=["DELETE", "POST"])
def delete_record(record_id: str):
    count = execute_commit("DELETE FROM analysis_history WHERE id = ?", (record_id,))
    return jsonify({"success": count > 0, "deleted_id": record_id})

@history_bp.route("/clear", methods=["POST"])
def clear_all_history():
    execute_commit("DELETE FROM analysis_history")
    execute_commit("DELETE FROM chat_conversations")
    execute_commit("DELETE FROM lab_reports")
    return jsonify({"success": True, "message": "All historical records permanently wiped."})
