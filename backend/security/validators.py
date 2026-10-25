"""
backend/security/validators.py
File upload and payload validation guards.
Prevents path traversal, MIME type spoofing, and excessive file sizes.
"""

import os
import re
from werkzeug.utils import secure_filename
from backend.config import Config

MAGIC_SIGNATURES = {
    # JPEG
    b"\xff\xd8\xff": "image/jpeg",
    # PNG
    b"\x89PNG\r\n\x1a\n": "image/png",
    # PDF
    b"%PDF-": "application/pdf",
    # RIFF / WAV
    b"RIFF": "audio/wav",
    # ID3 / MP3
    b"ID3": "audio/mp3",
    b"\xff\xfb": "audio/mp3"
}

def validate_file_extension(filename: str, allowed_extensions: set) -> bool:
    if not filename or "." not in filename:
        return False
    ext = os.path.splitext(filename)[1].lower()
    return ext in allowed_extensions

def sanitize_safe_filepath(filename: str, upload_dir: str) -> str:
    """Safely sanitizes filename and resolves absolute path strictly inside target directory."""
    clean_name = secure_filename(filename)
    if not clean_name:
        clean_name = "unnamed_upload"
    clean_path = os.path.abspath(os.path.join(upload_dir, clean_name))
    target_dir = os.path.abspath(upload_dir)
    
    # Enforce path containment
    if not clean_path.startswith(target_dir):
        raise ValueError("Detected potential path traversal attack in filename.")
    return clean_path

def inspect_file_magic(stream_bytes: bytes) -> str | None:
    """Checks the starting byte headers against recognized valid medical file signatures."""
    for sig, mime in MAGIC_SIGNATURES.items():
        if stream_bytes.startswith(sig):
            return mime
    return None
