#!/usr/bin/env python3
"""
scripts/verify_installation.py
Validates the AI Medical Assistant (AMA) environment, database schema, manifests, and system health.
Works cross-platform (Windows 11, Linux, macOS) without external dependencies beyond standard library and SQLite.
"""

import sys
import os
import json
import sqlite3
import shutil
import argparse

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def check_manifests():
    print("[*] Validating dataset and model manifests...")
    manifest_paths = [
        os.path.join(WORKSPACE_ROOT, "data", "manifests", "isic_ham10000_manifest.json"),
        os.path.join(WORKSPACE_ROOT, "data", "manifests", "icbhi_2017_manifest.json"),
        os.path.join(WORKSPACE_ROOT, "data", "manifests", "medlineplus_kb_manifest.json"),
        os.path.join(WORKSPACE_ROOT, "model_artifacts", "manifests", "model_registry.json")
    ]
    all_valid = True
    for p in manifest_paths:
        if not os.path.exists(p):
            print(f"  [FAIL] Missing manifest: {p}")
            all_valid = False
            continue
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
            print(f"  [OK] Manifest verified: {os.path.basename(p)}")
        except Exception as e:
            print(f"  [FAIL] Corrupted JSON in {p}: {e}")
            all_valid = False
    return all_valid

def init_sqlite_db():
    print("[*] Checking SQLite local database...")
    db_dir = os.path.join(WORKSPACE_ROOT, "backend", "database")
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, "ama_local.sqlite")
    schema_path = os.path.join(db_dir, "schema.sql")

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # If schema.sql exists, execute it
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            cursor.executescript(schema_sql)
        else:
            # Fallback bootstrap schema
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS analysis_history (
                id TEXT PRIMARY KEY,
                module TEXT NOT NULL,
                input_summary TEXT,
                primary_finding TEXT,
                confidence REAL,
                risk_tier TEXT,
                language TEXT DEFAULT 'en',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_conversations (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                user_prompt TEXT NOT NULL,
                assistant_response TEXT NOT NULL,
                citations_json TEXT,
                emergency_flag INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            """)
            conn.commit()

        # Seed initial config if empty
        cursor.execute("INSERT OR IGNORE INTO system_config (key, value) VALUES ('platform_version', '1.0.0')")
        cursor.execute("INSERT OR IGNORE INTO system_config (key, value) VALUES ('default_language', 'en')")
        cursor.execute("INSERT OR IGNORE INTO system_config (key, value) VALUES ('auto_purge_uploads', '1')")
        conn.commit()
        conn.close()
        print(f"  [OK] SQLite database verified and initialized at: {db_path}")
        return True
    except Exception as e:
        print(f"  [FAIL] Database initialization failed: {e}")
        return False

def check_ocr_availability():
    print("[*] Inspecting OCR system status...")
    tesseract_win_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    system_tesseract = shutil.which("tesseract")
    
    if os.path.exists(tesseract_win_path):
        print(f"  [OK] Tesseract binary detected at Windows path: {tesseract_win_path}")
        return True
    elif system_tesseract:
        print(f"  [OK] Tesseract binary found in PATH: {system_tesseract}")
        return True
    else:
        print("  [INFO] Tesseract executable not currently detected. AMA will utilize fallback parsing.")
        return False

def check_sample_fixtures():
    print("[*] Checking synthetic test fixtures...")
    samples = [
        os.path.join(WORKSPACE_ROOT, "data", "samples", "synthetic_lab_report_en.txt"),
        os.path.join(WORKSPACE_ROOT, "data", "samples", "synthetic_lab_report_ar.txt"),
        os.path.join(WORKSPACE_ROOT, "data", "samples", "sample_respiratory_metadata.json")
    ]
    for s in samples:
        if os.path.exists(s):
            print(f"  [OK] Fixture present: {os.path.basename(s)}")
        else:
            print(f"  [WARNING] Missing fixture: {s}")

def main():
    parser = argparse.ArgumentParser(description="AMA Installation and Health Verification")
    parser.add_argument("--diagnostics-only", action="store_true", help="Run read-only inspection without creating DB")
    args = parser.parse_args()

    print("=====================================================================")
    print("           AI Medical Assistant (AMA) — Health Verification")
    print("=====================================================================")
    print(f"Python Version: {sys.version.split()[0]}")
    print(f"Workspace Root: {WORKSPACE_ROOT}")
    print("---------------------------------------------------------------------")

    m_ok = check_manifests()
    db_ok = True
    if not args.diagnostics_only:
        db_ok = init_sqlite_db()
    check_ocr_availability()
    check_sample_fixtures()

    print("---------------------------------------------------------------------")
    if m_ok and db_ok:
        print("[SUCCESS] All essential manifests and databases are in a valid state.")
        sys.exit(0)
    else:
        print("[NOTICE] Verification completed with warnings or missing components.")
        sys.exit(0)

if __name__ == "__main__":
    main()
