"""
report.py
Executive Summary Report generation.
Gathers customer data from the database and uses LLM for narrative generation.
"""
import os
import sqlite3
from datetime import date
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db", "insurance_support.db")


def get_conn():
    return sqlite3.connect(DB_PATH)


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# --- Pydantic model for structured LLM output ---
class ExecutiveSummary(BaseModel):
    account_status: str = Field(description="'Active' if any policy is Active, else 'Inactive'")
    portfolio_narrative: str = Field(description="2-3 sentence executive summary of the customer's insurance portfolio")
    key_findings: list[str] = Field(description="3-5 key findings about payment behavior, claims, and coverage")


# --- Data gathering functions ---

def get_customer_profile(customer_id: str) -> dict:
    """Query customers table, return profile in report format."""
    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        row = conn.execute(
            "SELECT * FROM customers WHERE customer_id = ?", (customer_id,)
        ).fetchone()
        if not row:
            return {}
        return {
            "name": f"{row['first_name']} {row['last_name']}",
            "nric": row.get("nric", ""),
            "email": row.get("email", ""),
            "phone": row.get("phone", ""),
            "date_of_birth": row.get("date_of_birth", ""),
            "address": {
                "full_address": row.get("address", ""),
                "region": row.get("region", ""),
            },
        }
    finally:
        conn.close()


def get_policy_portfolio(customer_id: str) -> list[dict]:
    """Query policies + billing for each policy."""
    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        policies = conn.execute(
            "SELECT * FROM policies WHERE customer_id = ? ORDER BY start_date DESC",
            (customer_id,),
        ).fetchall()

        result = []
        for p in policies:
            bills = conn.execute(
                "SELECT bill_id, due_date, status FROM billing WHERE policy_number = ? ORDER BY due_date DESC",
                (p["policy_number"],),
            ).fetchall()

            billing_history = [
                {"bill_id": b["bill_id"], "due_date": b["due_date"], "status": b["status"].capitalize()}
                for b in bills
            ]

            result.append({
                "policy_id": p["policy_number"],
                "type": p["policy_type"],
                "status": p["status"],
                "start_date": p["start_date"],
                "premium": {
                    "amount": p["premium_amount"],
                    "currency": "SGD",
                    "frequency": p["billing_frequency"],
                },
                "billing_history": billing_history,
            })
        return result
    finally:
        conn.close()


def get_claims_history(customer_id: str) -> list[dict]:
    """Query claims joined with policies for ownership."""
    conn = get_conn()
    conn.row_factory = dict_factory
    try:
        rows = conn.execute(
            """
            SELECT c.claim_id, c.claim_date, c.policy_number, c.claim_amount, c.status, c.description
            FROM claims c
            JOIN policies p ON c.policy_number = p.policy_number
            WHERE p.customer_id = ?
            ORDER BY c.claim_date DESC
            """,
            (customer_id,),
        ).fetchall()

        return [
            {
                "claim_id": r["claim_id"],
                "date": r["claim_date"],
                "associated_policy": r["policy_number"],
                "amount": r["claim_amount"],
                "status": r["status"],
                "description": r.get("description", ""),
            }
            for r in rows
        ]
    finally:
        conn.close()


def generate_executive_summary(profile: dict, policies: list, claims: list) -> dict:
    """Use GPT-4o-mini with structured output to produce the executive summary narrative."""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    prompt = f"""You are an insurance analyst writing an executive summary for a customer report.

Customer: {profile.get('name', 'Unknown')}
Policies: {policies}
Claims: {claims}

Rules:
1. account_status: "Active" if ANY policy has status "Active", otherwise "Inactive"
2. portfolio_narrative: A concise 2-3 sentence professional narrative about this customer's insurance portfolio
3. key_findings: 3-5 key observations about payment patterns, claims history, coverage gaps, or risk indicators
"""

    try:
        result = llm.with_structured_output(ExecutiveSummary).invoke(prompt)
        return result.model_dump()
    except Exception as e:
        # Fallback if LLM fails
        has_active = any(p.get("status") == "Active" for p in policies)
        return {
            "account_status": "Active" if has_active else "Inactive",
            "portfolio_narrative": f"Customer holds {len(policies)} policy(ies) with {len(claims)} claim(s) on record.",
            "key_findings": [
                f"Total policies: {len(policies)}",
                f"Total claims: {len(claims)}",
            ],
        }


# --- Main orchestrator ---

def generate_report(customer_id: str) -> dict:
    """Assemble the full executive summary report."""
    profile = get_customer_profile(customer_id)
    policies = get_policy_portfolio(customer_id)
    claims = get_claims_history(customer_id)
    executive_summary = generate_executive_summary(profile, policies, claims)

    return {
        "report_metadata": {
            "report_title": "Customer Insurance Report",
            "generation_date": date.today().isoformat(),
            "customer_id": customer_id,
        },
        "executive_summary": executive_summary,
        "customer_profile": profile,
        "policy_portfolio": policies,
        "claims_history": claims,
    }
