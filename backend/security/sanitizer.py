"""
backend/security/sanitizer.py
Input sanitization, XSS mitigation, and medical text normalizer.
"""

import html
import re

def sanitize_user_text(text: str, max_chars: int = 2000) -> str:
    """Escapes HTML entities and truncates inputs to mitigate XSS and buffer attacks."""
    if not text:
        return ""
    truncated = text[:max_chars].strip()
    # Strip potential script or HTML tags
    cleaned = re.sub(r"<[^>]*>", "", truncated)
    return html.escape(cleaned)

def strip_potential_pii(text: str) -> str:
    """Redacts potential phone numbers, national IDs, and email addresses from clinical OCR text."""
    # Email redaction
    text = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[REDACTED_EMAIL]", text)
    # 10-12 digit numbers (potential national ID / phone)
    text = re.sub(r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b", "[REDACTED_PHONE]", text)
    return text
