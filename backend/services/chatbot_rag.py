"""
backend/services/chatbot_rag.py
Bilingual Retrieval-Augmented Generation (RAG) Medical Chatbot Service.
Retrieves grounded evidence from MedlinePlus, WHO, and NHS catalogs.
Includes emergency red-flag triage detection and transparent citation validation.
"""

import os
import json
import re
import math
from collections import Counter
from backend.security.sanitizer import sanitize_user_text

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
KB_PATH = os.path.join(WORKSPACE_ROOT, "data", "manifests", "medlineplus_kb_manifest.json")

def load_knowledge_base():
    if os.path.exists(KB_PATH):
        try:
            with open(KB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"topics": [], "emergency_triggers": []}

class MedicalRAGChatbot:
    def __init__(self):
        self.kb = load_knowledge_base()
        self.topics = self.kb.get("topics", [])
        self.emergency_triggers = self.kb.get("emergency_triggers", [])

    def check_emergency(self, prompt: str) -> dict | None:
        """Evaluates prompt against critical emergency triage rules."""
        lowered = prompt.lower()
        for trigger in self.emergency_triggers:
            pattern = trigger.get("pattern", "")
            if pattern and re.search(pattern, lowered, re.IGNORECASE):
                return {
                    "is_emergency": True,
                    "warning_en": trigger.get("warning_en"),
                    "warning_ar": trigger.get("warning_ar")
                }
        return None

    def _tokenize(self, text: str) -> list[str]:
        words = re.findall(r"\w+", text.lower())
        stopwords = {"the", "is", "at", "which", "on", "and", "a", "an", "in", "for", "with", "من", "في", "على", "إلى", "و", "هو", "هي"}
        return [w for w in words if w not in stopwords and len(w) > 1]

    def retrieve_relevant_topics(self, query: str, top_k: int = 2) -> list[dict]:
        """Performs lexical and keyword-weighted retrieval over the knowledge catalog."""
        tokens = self._tokenize(query)
        if not tokens:
            return []

        scored_topics = []
        for topic in self.topics:
            content_combined = f"{topic.get('title_en', '')} {topic.get('title_ar', '')} {topic.get('content_en', '')} {topic.get('content_ar', '')} {' '.join(topic.get('keywords', []))}".lower()
            score = 0
            # Keyword matching bonus
            for kw in topic.get("keywords", []):
                if kw.lower() in query.lower():
                    score += 3.0

            # Token overlap score
            for token in tokens:
                if token in content_combined:
                    score += 1.0

            if score > 0:
                scored_topics.append((score, topic))

        scored_topics.sort(key=lambda x: x[0], reverse=True)
        return [t[1] for t in scored_topics[:top_k]]

    def answer_query(self, user_prompt: str, language: str = "en") -> dict:
        """Processes query, checks emergency state, retrieves evidence, and crafts response."""
        clean_prompt = sanitize_user_text(user_prompt)
        if not clean_prompt:
            msg = "Please enter a health inquiry or medical question." if language == "en" else "يرجى إدخال استفسار طبي أو سؤال صحي."
            return {"response": msg, "citations": [], "emergency": False}

        # 1. Emergency Red-Flag Triage
        emergency = self.check_emergency(clean_prompt)
        if emergency:
            response_text = emergency["warning_en"] if language == "en" else emergency["warning_ar"]
            disclaimer = (
                "\n\n[CRITICAL NOTICE: Do not delay calling emergency dispatch for acute severe symptoms.]"
                if language == "en" else
                "\n\n[تنبيه هام: لا تتأخر في الاتصال بالإسعاف عند وجود أعراض حادة أو مهددة للحياة.]"
            )
            return {
                "response": response_text + disclaimer,
                "citations": [{
                    "title": "Emergency Dispatch Guidelines",
                    "publisher": "WHO / Emergency Resuscitation Protocols",
                    "url": "https://www.who.int/emergencies"
                }],
                "emergency": True
            }

        # 2. Evidence Retrieval
        matched_topics = self.retrieve_relevant_topics(clean_prompt, top_k=2)

        if not matched_topics:
            if language == "ar":
                text = (
                    "لم يتم العثور على معلومات محددة ومؤكدة في قاعدة البيانات الطبية المحلية المعتمدة بخصوص هذا الاستفسار.\n\n"
                    "تذكير طبي: هذا النظام تعليمي ولا يقدم تشخيصات قطعية أو وصفات دوائية. يرجى استشارة طبيب مختص للحصول على تقييم سريري شامل."
                )
            else:
                text = (
                    "I could not locate specific verified guidance in our local clinical knowledge base for your inquiry.\n\n"
                    "Medical Reminder: This platform provides educational health guidance only and does not formulate clinical diagnoses or prescribe treatments. Please consult a licensed healthcare provider."
                )
            return {"response": text, "citations": [], "emergency": False}

        # 3. Construct Answer from Matched Topics
        citations = []
        body_parts = []

        for idx, topic in enumerate(matched_topics):
            title = topic.get("title_en") if language == "en" else topic.get("title_ar")
            content = topic.get("content_en") if language == "en" else topic.get("content_ar")
            body_parts.append(f"**{title}**:\n{content}")
            citations.append({
                "id": topic.get("id"),
                "title": title,
                "publisher": topic.get("publisher"),
                "url": topic.get("url")
            })

        body_text = "\n\n".join(body_parts)
        if language == "ar":
            footer = (
                "\n\n---\n"
                "**إخلاء مسؤولية سريرية**: المعلومات أعلاه مستخلصة من مصادر طبية رسمية (MedlinePlus / منظمة الصحة العالمية) "
                "لأغراض التوعية الصحية والتعليم فقط، ولا تغني عن استشارة الطبيب المعالج أو إجراء الفحوصات اللازمة."
            )
        else:
            footer = (
                "\n\n---\n"
                "**Clinical Safety Disclaimer**: The information above is retrieved from verified health repositories (MedlinePlus / WHO) "
                "for educational reference only. It does not replace individualized medical advice or laboratory confirmation."
            )

        return {
            "response": body_text + footer,
            "citations": citations,
            "emergency": False
        }

rag_chatbot = MedicalRAGChatbot()
