"""
Database connection module for SQLite (standalone version).
"""
import os
import sqlite3
from contextlib import contextmanager
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "insurance_support.db")


def get_db_path() -> str:
    """Get the database file path."""
    return DB_PATH


def connect_db(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Connect to SQLite database."""
    if db_path is None:
        db_path = get_db_path()
    return sqlite3.connect(db_path)


@contextmanager
def get_db_connection(db_path: Optional[str] = None):
    """Context manager for database connections."""
    conn = connect_db(db_path)
    try:
        yield conn
    finally:
        conn.close()
