"""
backend/api/chatbot_routes.py
Flask Blueprint for Medical Chatbot endpoints.
Supports grounded RAG Q&A, citation retrieval, and session message logging.
"""

import uuid
from flask import Blueprint, request, jsonify
from backend.services.chatbot_rag import rag_chatbot
from backend.database.db import execute_commit, execute_query
from backend.config import Config

chatbot_bp = Blueprint("chatbot", __name__, url_prefix="/api/chatbot")

@chatbot_bp.route("/message", methods=["POST"])
def post_message():
    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "")
    language = data.get("language", "en")
    session_id = data.get("session_id", str(uuid.uuid4()))

    if not prompt or not prompt.strip():
        return jsonify({"error": "Prompt cannot be empty"}), 400

    result = rag_chatbot.answer_query(prompt, language=language)

    # Log conversation if enabled
    if Config.ENABLE_HISTORY_LOGGING:
        try:
            import json
            msg_id = str(uuid.uuid4())
            execute_commit(
                """
                INSERT INTO chat_conversations 
                (id, session_id, user_prompt, assistant_response, citations_json, emergency_flag, language)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    msg_id,
                    session_id,
                    prompt,
                    result["response"],
                    json.dumps(result["citations"]),
                    1 if result["emergency"] else 0,
                    language
                )
            )
        except Exception:
            pass

    return jsonify({
        "session_id": session_id,
        "response": result["response"],
        "citations": result["citations"],
        "emergency": result["emergency"]
    })

@chatbot_bp.route("/history", methods=["GET"])
def get_chat_history():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify([])

    rows = execute_query(
        "SELECT id, user_prompt, assistant_response, citations_json, emergency_flag, timestamp FROM chat_conversations WHERE session_id = ? ORDER BY timestamp ASC",
        (session_id,)
    )
    return jsonify(rows)
