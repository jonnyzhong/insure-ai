"""
auto_tools.py
Domain: Auto Insurance Specifics (Vehicle Data, VIN, License Plate)
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
class PolicyNumberInput(BaseModel):
    policy_number: str = Field(description="The Policy Number (e.g., POL000002)")

# --- TOOLS ---
@tool(args_schema=PolicyNumberInput)
def get_vehicle_details(policy_number: str, config: RunnableConfig = None):
    """
    Retrieves detailed vehicle information for an Auto/Motor Policy.
    Returns: VIN, Make, Model, Year, License Plate, Deductible, and Liability Limits.
    Use this ONLY when the policy is a 'Motor' policy or user asks about car details.
    """
    auth_id = (config or {}).get("configurable", {}).get("authenticated_customer_id", "")

    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        # First verify the policy belongs to the authenticated user
        if auth_id:
            owner_check = conn.execute("SELECT customer_id FROM policies WHERE policy_number = ?", (policy_number,)).fetchone()
            if owner_check and owner_check.get("customer_id") != auth_id:
                return {"status": "denied", "msg": f"Access denied. Policy {policy_number} does not belong to you."}

        query = """
        SELECT
            policy_number,
            vehicle_vin,
            vehicle_make,
            vehicle_model,
            vehicle_year,
            license_plate,
            coverage_type,
            deductible,
            liability_limit
        FROM auto_policy_details
        WHERE policy_number = ?
        """
        cur = conn.execute(query, (policy_number,))
        row = cur.fetchone()

        if not row:
            return {"status": "not_found", "msg": f"No vehicle details found for policy {policy_number}. This tool only works for 'Motor' policies."}

        return (
            f"Vehicle Details for {row['policy_number']}:\n"
            f"- Car: {row['vehicle_year']} {row['vehicle_make']} {row['vehicle_model']}\n"
            f"- Plate: {row['license_plate']}\n"
            f"- VIN: {row['vehicle_vin']}\n"
            f"- Coverage: {row['coverage_type']}\n"
            f"- Deductible: ${row['deductible']}\n"
            f"- Liability Limit: ${row['liability_limit']}"
        )
    finally:
        conn.close()
