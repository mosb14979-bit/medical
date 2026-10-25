"""
tests/test_chatbot_rag.py
Tests RAG chatbot retrieval, citation validation, and emergency triage triggers in English and Arabic.
"""

import pytest
from backend.services.chatbot_rag import rag_chatbot

def test_emergency_triage_english():
    res = rag_chatbot.answer_query("I have crushing chest pain radiating to my left arm", language="en")
    assert res["emergency"] is True
    assert "EMERGENCY ALERT" in res["response"]
    assert len(res["citations"]) > 0

def test_emergency_triage_arabic():
    res = rag_chatbot.answer_query("أشعر بألم شديد في الصدر وضيق تنفس حاد", language="ar")
    assert res["emergency"] is True
    assert "تنبيه طوارئ" in res["response"]

def test_grounded_retrieval_hypertension():
    res = rag_chatbot.answer_query("What is considered normal blood pressure?", language="en")
    assert res["emergency"] is False
    assert "120/80" in res["response"]
    assert any(c["publisher"] == "MedlinePlus" for c in res["citations"])

def test_grounded_retrieval_arabic_diabetes():
    res = rag_chatbot.answer_query("ما هو المعدل الطبيعي لسكر الدم الصائم؟", language="ar")
    assert res["emergency"] is False
    assert "السكري" in res["response"]
