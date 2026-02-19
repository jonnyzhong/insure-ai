"""
billing_tools.py
Domain: Smart Invoices (Read-Only Connection to Existing DB)
"""
import os
import sqlite3
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db", "insurance_support.db")

def get_conn():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")
    return sqlite3.connect(DB_PATH)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# --- INPUT SCHEMAS ---
class HistoryInput(BaseModel):
    customer_id: str = Field(description="The internal Customer ID (e.g., CUST001)")

# --- TOOLS ---
@tool(args_schema=HistoryInput)
def get_billing_history(customer_id: str, config: RunnableConfig = None):
    """
    Retrieves bills by joining Policies -> Billing -> Payments.
    """
    # Ownership check: only allow access to the authenticated user's billing
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")
    if auth_id and customer_id != auth_id:
        return f"Access denied. You can only view your own billing history (your ID: {auth_id})."

    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        query = """
        SELECT
            b.bill_id,
            b.amount,
            b.due_date,
            b.status as bill_status,
            p.policy_type,
            p.policy_number,
            pay.status as payment_status,
            pay.payment_date,
            pay.payment_method
        FROM billing b
        JOIN policies p ON b.policy_number = p.policy_number
        LEFT JOIN payments pay ON b.bill_id = pay.bill_id
        WHERE p.customer_id = ?
        ORDER BY b.due_date DESC
        """
        cur = conn.execute(query, (customer_id,))
        rows = cur.fetchall()

        if not rows:
            return "No billing history found."

        report = []
        for r in rows:
            final_status = "PAID" if r.get('payment_status') == 'Success' else r.get('bill_status', 'Unknown')

            detail = f"• {r['due_date']} | {r['policy_type']} (Bill: {r['bill_id']}): ${r['amount']} -> [{final_status}]"

            if final_status == "PAID":
                detail += f" (via {r.get('payment_method', 'Unknown')} on {r.get('payment_date', '')})"

            report.append(detail)

        return "\n".join(report)
    finally:
        conn.close()
