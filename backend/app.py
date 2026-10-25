"""
backend/app.py
Main entry point for the AI Medical Assistant (AMA) Flask application.
Serves Jinja2 templates, static assets, and registers all medical analysis API Blueprints.
"""

import os
import sys
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.api.chatbot_routes import chatbot_bp
from backend.api.skin_routes import skin_bp
from backend.api.respiratory_routes import respiratory_bp
from backend.api.lab_routes import lab_bp
from backend.api.system_routes import system_bp
from backend.api.history_routes import history_bp

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEMPLATE_DIR = os.path.join(BASE_DIR, "frontend", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "static")

def create_app():
    app = Flask(
        __name__,
        template_folder=TEMPLATE_DIR,
        static_folder=STATIC_DIR
    )
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register API Blueprints
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(skin_bp)
    app.register_blueprint(respiratory_bp)
    app.register_blueprint(lab_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(history_bp)

    # Web Page Template Routes
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/chatbot")
    def chatbot_page():
        return render_template("chatbot.html")

    @app.route("/skin-analyzer")
    def skin_page():
        return render_template("skin_analyzer.html")

    @app.route("/respiratory-analyzer")
    def respiratory_page():
        return render_template("respiratory_analyzer.html")

    @app.route("/lab-analyzer")
    def lab_page():
        return render_template("lab_analyzer.html")

    @app.route("/history")
    def history_page():
        return render_template("history.html")

    @app.route("/model-info")
    def model_info_page():
        return render_template("model_info.html")

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("base.html", error_msg="404 - Page or resource not found"), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template("base.html", error_msg="500 - Internal processing error"), 500

    return app

app = create_app()

if __name__ == "__main__":
    print(f"[*] Starting AI Medical Assistant server on http://{Config.HOST}:{Config.PORT}")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
