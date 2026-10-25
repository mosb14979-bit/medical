-- AI Medical Assistant (AMA) SQLite Database Schema
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- System configurations and user preferences
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- General analysis history across all modules
CREATE TABLE IF NOT EXISTS analysis_history (
    id TEXT PRIMARY KEY,
    module TEXT NOT NULL,
    input_summary TEXT,
    primary_finding TEXT,
    confidence REAL,
    risk_tier TEXT,
    language TEXT DEFAULT 'en',
    details_json TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Medical Chatbot conversation messages
CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_prompt TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    citations_json TEXT,
    emergency_flag INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Laboratory parsed reports
CREATE TABLE IF NOT EXISTS lab_reports (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    extracted_text TEXT,
    tests_json TEXT,
    abnormal_count INTEGER DEFAULT 0,
    ocr_confidence REAL,
    requires_review INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_history_timestamp ON analysis_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_conversations(session_id);
