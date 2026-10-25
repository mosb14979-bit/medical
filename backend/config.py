"""
backend/config.py
Configuration module for the AI Medical Assistant (AMA) platform.
Loads settings from environment variables and provides sensible local defaults.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    # Flask Environment
    SECRET_KEY = os.getenv("SECRET_KEY", "ama-local-development-secret-key-99420")
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "127.0.0.1")

    # Storage Paths
    DATABASE_PATH = os.path.join(BASE_DIR, os.getenv("DATABASE_PATH", "backend/database/ama_local.sqlite"))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, os.getenv("UPLOAD_FOLDER", "uploads"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH_MB", 16)) * 1024 * 1024

    # Privacy & Retention
    ENABLE_HISTORY_LOGGING = os.getenv("ENABLE_HISTORY_LOGGING", "1") == "1"
    AUTO_PURGE_UPLOADS = os.getenv("AUTO_PURGE_UPLOADS", "1") == "1"

    # Tesseract OCR Windows defaults
    TESSERACT_CMD = os.getenv("TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
    TESSDATA_PREFIX = os.getenv("TESSDATA_PREFIX", r"C:\Program Files\Tesseract-OCR\tessdata")

    # PyTorch Hardware Selection
    TORCH_DEVICE = os.getenv("TORCH_DEVICE", "auto")

    # Allowed File Extensions
    ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".ogg"}
    ALLOWED_DOC_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
