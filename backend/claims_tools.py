"""
claims_tools.py
Domain: Claims Management (Status Checks & Filing)
"""
import os
import sqlite3
import random
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

# --- INPUT SCHEMAS ---
class CustomerClaimsInput(BaseModel):
    customer_id: str = Field(description="The internal Customer ID (e.g., CUST001)")

class ClaimStatusInput(BaseModel):
    claim_id: str = Field(description="The Claim ID (e.g., CLM001)")

class FileClaimInput(BaseModel):
    policy_number: str = Field(description="The Policy Number (e.g., POL-001)")
    incident_date: str = Field(description="Date of incident (YYYY-MM-DD)")
    reason: str = Field(description="Description of what happened")
    amount: float = Field(description="Estimated claim amount")

# --- TOOLS ---
@tool(args_schema=CustomerClaimsInput)
def get_customer_claims(customer_id: str, config: RunnableConfig = None):
    """
    Retrieves ALL claims for a customer by joining claims with policies.
    Use this when the user asks about their claims in general, e.g. "what claims do I have?", "show my claims".
    """
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")
    if auth_id and customer_id != auth_id:
        return f"Access denied. You can only view your own claims (your ID: {auth_id})."

    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        rows = conn.execute(
            """
            SELECT c.claim_id, c.claim_date, c.claim_amount, c.status, c.description,
                   c.policy_number, p.policy_type
            FROM claims c
            JOIN policies p ON c.policy_number = p.policy_number
            WHERE p.customer_id = ?
            ORDER BY c.claim_date DESC
            """,
            (customer_id,),
        ).fetchall()

        if not rows:
            return "No claims found for your account."

        report = []
        for r in rows:
            report.append(
                f"• {r['claim_id']} | {r['claim_date']} | {r['policy_type']} ({r['policy_number']}) | "
                f"${r['claim_amount']} | Status: {r['status']} | {r['description']}"
            )
        return f"Found {len(rows)} claim(s):\n" + "\n".join(report)
    finally:
        conn.close()


@tool(args_schema=ClaimStatusInput)
def check_claim_status(claim_id: str, config: RunnableConfig = None):
    """Checks the status of an existing claim."""
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")

    conn = get_conn()
    conn.row_factory = dict_factory
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM claims WHERE claim_id = ?", (claim_id,))
        res = cur.fetchone()
        if not res:
            return {"status": "not_found", "msg": f"Claim {claim_id} not found."}
        # Ownership check: verify the claim's policy belongs to the authenticated user
        if auth_id and res.get("policy_number"):
            owner = cur.execute("SELECT customer_id FROM policies WHERE policy_number = ?", (res["policy_number"],)).fetchone()
            if owner and owner.get("customer_id") != auth_id:
                return {"status": "denied", "msg": f"Access denied. Claim {claim_id} does not belong to you."}
        return {"status": "found", "data": res}
    finally:
        conn.close()

@tool(args_schema=FileClaimInput)
def file_new_claim(policy_number: str, incident_date: str, reason: str, amount: float, config: RunnableConfig = None):
    """
    Submits a NEW claim into the database.
    Use this ONLY after you have collected all 4 fields from the user.
    """
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")

    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        # Ownership check: verify the policy belongs to the authenticated user
        if auth_id:
            owner = conn.execute("SELECT customer_id FROM policies WHERE policy_number = ?", (policy_number,)).fetchone()
            if not owner:
                return {"status": "error", "msg": f"Policy {policy_number} not found."}
            if owner.get("customer_id") != auth_id:
                return {"status": "denied", "msg": f"Access denied. Policy {policy_number} does not belong to you. You cannot file a claim against it."}

        new_id = f"CLM{random.randint(1000,9999)}"
        query = """
        INSERT INTO claims (claim_id, policy_number, incident_date, status, amount, reason)
        VALUES (?, ?, ?, 'Pending', ?, ?)
        """
        conn.execute(query, (new_id, policy_number, incident_date, amount, reason))
        conn.commit()

        return {"status": "success", "claim_id": new_id, "msg": "Claim filed successfully."}
    except Exception as e:
        return {"status": "error", "msg": str(e)}
    finally:
        conn.close()
