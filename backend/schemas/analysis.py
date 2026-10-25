"""
backend/schemas/analysis.py
Validation schemas and response structures for AI Medical Assistant modules.
"""

from typing import List, Optional, Dict, Any

class ChatRequestSchema:
    def __init__(self, prompt: str, language: str = "en", session_id: Optional[str] = None):
        self.prompt = prompt.strip()
        self.language = language if language in ["en", "ar"] else "en"
        self.session_id = session_id

class SkinPredictionSchema:
    def __init__(self, class_code: str, confidence: float, description: str, risk_tier: str):
        self.class_code = class_code
        self.confidence = confidence
        self.description = description
        self.risk_tier = risk_tier

    def to_dict(self) -> Dict[str, Any]:
        return {
            "class_code": self.class_code,
            "confidence": self.confidence,
            "description": self.description,
            "risk_tier": self.risk_tier
        }
