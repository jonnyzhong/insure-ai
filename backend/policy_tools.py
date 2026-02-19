"""
policy_tools.py
Domain: Insurance Policies & Coverage details.
"""
import os
import sqlite3
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db", "insurance_support.db")

def get_conn():
    return sqlite3.connect(DB_PATH)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# --- SCHEMAS ---
class PolicyInput(BaseModel):
    customer_id: str = Field(description="The internal Customer ID (e.g., CUST001)")

class DetailInput(BaseModel):
    policy_number: str = Field(description="The specific Policy Number (e.g., POL001)")

# --- TOOLS ---
@tool(args_schema=PolicyInput)
def get_customer_policies(customer_id: str, config: RunnableConfig = None):
    """Lists all policies belonging to a specific Customer ID."""
    # Ownership check: only allow access to the authenticated user's policies
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")
    if auth_id and customer_id != auth_id:
        return {"status": "denied", "msg": f"Access denied. You can only view your own policies (your ID: {auth_id})."}

    conn = get_conn()
    conn.row_factory = dict_factory
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM policies WHERE customer_id = ?", (customer_id,))
        return cur.fetchall()
    finally:
        conn.close()

@tool(args_schema=DetailInput)
def get_policy_details(policy_number: str, config: RunnableConfig = None):
    """Gets specific details (premium, dates, type) for a Policy Number."""
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")

    conn = get_conn()
    conn.row_factory = dict_factory
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM policies WHERE policy_number = ?", (policy_number,))
        row = cur.fetchone()
        if not row:
            return {"status": "not_found", "msg": f"Policy {policy_number} not found."}
        # Ownership check: verify this policy belongs to the authenticated user
        if auth_id and row.get("customer_id") != auth_id:
            return {"status": "denied", "msg": f"Access denied. Policy {policy_number} does not belong to you."}
        return row
    finally:
        conn.close()
