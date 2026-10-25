"""
tests/test_security_sanitization.py
Tests input sanitization, XSS escaping, path traversal defense, and PII scrubbing.
"""

import os
import pytest
from backend.security.sanitizer import sanitize_user_text, strip_potential_pii
from backend.security.validators import sanitize_safe_filepath, validate_file_extension

def test_xss_sanitization():
    raw_prompt = "<script>alert('xss');</script>What is blood pressure?"
    clean = sanitize_user_text(raw_prompt)
    assert "<script>" not in clean
    assert "What is blood pressure?" in clean

def test_pii_redaction():
    text_with_phone_email = "Patient John Doe at doctor@clinic.org, phone 555-123-4567. Normal CBC."
    redacted = strip_potential_pii(text_with_phone_email)
    assert "doctor@clinic.org" not in redacted
    assert "[REDACTED_EMAIL]" in redacted
    assert "555-123-4567" not in redacted
    assert "[REDACTED_PHONE]" in redacted

def test_path_traversal_prevention():
    upload_dir = "/tmp/ama_uploads"
    with pytest.raises(Exception):
        sanitize_safe_filepath("../../etc/passwd", upload_dir)

def test_allowed_file_extensions():
    allowed = {".jpg", ".png", ".pdf"}
    assert validate_file_extension("report.pdf", allowed) is True
    assert validate_file_extension("malware.exe", allowed) is False
    assert validate_file_extension("script.bat", allowed) is False
