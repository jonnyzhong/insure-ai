"""
customer_tools.py
Domain: Customer Identity & lookup.
"""
import os
import sqlite3
from typing import Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field

# Shared DB Configuration - relative path
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db", "insurance_support.db")

def get_conn():
    return sqlite3.connect(DB_PATH)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# --- SCHEMAS ---
class LookupInput(BaseModel):
    nric: Optional[str] = Field(default=None, description="User NRIC")
    email: Optional[str] = Field(default=None, description="User Email")
    customer_id: Optional[str] = Field(default=None, description="Internal Customer ID")

# --- TOOLS ---
@tool(args_schema=LookupInput)
def lookup_customer(nric: Optional[str] = None,
                    email: Optional[str] = None,
                    customer_id: Optional[str] = None):
    """
    Identifies the customer. Returns their Customer ID and Name.
    Use this first when the user introduces themselves.
    """
    conn = get_conn()
    conn.row_factory = dict_factory
    cur = conn.cursor()
    try:
        query = "SELECT * FROM customers WHERE "
        conditions = []
        params = []

        if customer_id:
            conditions.append("customer_id = ?"); params.append(customer_id)
        if nric:
            conditions.append("nric = ?"); params.append(nric)
        if email:
            conditions.append("email = ?"); params.append(email)

        if not conditions:
            return {"status": "error", "msg": "No identifier provided"}

        cur.execute(query + " OR ".join(conditions), params)
        res = cur.fetchone()

        if res:
            return {"status": "found", "data": res}
        return {"status": "not_found"}
    finally:
        conn.close()
