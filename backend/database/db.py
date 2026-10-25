"""
backend/database/db.py
Database connection helper and parameterized query utilities.
Strictly enforces SQL parameterization to eliminate SQL injection vulnerabilities.
"""

import sqlite3
import os
import json
from contextlib import contextmanager
from backend.config import Config

@contextmanager
def get_db_connection():
    """Provides a thread-safe context manager for SQLite database transactions."""
    os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def execute_query(query: str, params: tuple = ()):
    """Executes a parameterized query and returns all matching rows as dictionaries."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def execute_scalar(query: str, params: tuple = ()):
    """Executes a parameterized query and returns the first column of the first row."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return row[0] if row else None

def execute_commit(query: str, params: tuple = ()) -> int:
    """Executes an INSERT, UPDATE, or DELETE parameterized query and returns affected rows."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.rowcount
