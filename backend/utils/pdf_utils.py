"""
backend/utils/pdf_utils.py
Safe PDF document conversion and page-bounded text extraction.
"""

from typing import List

def extract_pdf_pages_safe(pdf_path: str, max_pages: int = 5) -> List[str]:
    """Safely extracts digital text content from up to max_pages."""
    pages_text = []
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        num_pages = min(max_pages, len(reader.pages))
        for i in range(num_pages):
            text = reader.pages[i].extract_text() or ""
            pages_text.append(text)
    except Exception:
        pass
    return pages_text
