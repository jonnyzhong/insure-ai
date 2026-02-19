"""
api.py
FastAPI server wrapping the existing LangGraph insurance agent.
Replicates the flow from the Streamlit app_ui.py.
"""
import os
import sys
import uuid
import sqlite3

# Ensure backend directory is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from langchain_core.messages import HumanMessage, AIMessage
from agent_supervisor import graph
from guardrails import validate_input
from report import generate_report

# --- CONFIG ---
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db", "insurance_support.db")

app = FastAPI(title="InsureAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SERVER-SIDE SESSION STORE ---
sessions: dict = {}

# --- AGENT MAP (mirrors app_ui.py lines 197-205) ---
AGENT_MAP = {
    "search_faq": "FAQ Agent",
    "get_customer_policies": "Policy Agent",
    "get_policy_details": "Policy Agent",
    "get_vehicle_details": "Auto Specialist",
    "get_billing_history": "Billing Agent",
    "get_customer_claims": "Claims Agent",
    "check_claim_status": "Claims Agent",
    "file_new_claim": "Claims Agent",
    "lookup_customer": "Customer Agent",
}

# --- DB HELPERS (from app_ui.py lines 38-72) ---
def get_users():
    """Fetches users by joining Customers & Policies."""
    if not os.path.exists(DB_PATH):
        return []
    try:
        conn = sqlite3.connect(DB_PATH)
        query = """
        SELECT DISTINCT c.email, c.first_name || ' ' || c.last_name, p.policy_type,
               c.customer_id,
               CAST((julianday('now') - julianday(c.date_of_birth)) / 365.25 AS INTEGER) AS age
        FROM customers c
        JOIN policies p ON c.customer_id = p.customer_id
        ORDER BY p.policy_type DESC
        """
        rows = conn.execute(query).fetchall()
        conn.close()
        return [
            {
                "email": r[0],
                "displayName": r[1],
                "policyType": r[2],
                "customerId": r[3],
                "age": r[4],
            }
            for r in rows
        ]
    except Exception as e:
        print(f"DB Read Error: {e}")
        return []


def get_customer_id_by_email(email: str) -> str:
    """Resolves email to internal customer_id."""
    if not os.path.exists(DB_PATH):
        return ""
    try:
        conn = sqlite3.connect(DB_PATH)
        row = conn.execute("SELECT customer_id FROM customers WHERE email = ?", (email,)).fetchone()
        conn.close()
        return row[0] if row else ""
    except Exception:
        return ""


def detect_agent(response_messages) -> tuple:
    """Search backwards for last tool call to identify the agent. Returns (agent_name, tool_calls)."""
    recent = response_messages[-6:]
    for m in reversed(recent):
        if isinstance(m, AIMessage) and hasattr(m, "tool_calls") and m.tool_calls:
            tool_name = m.tool_calls[0]["name"]
            agent_name = AGENT_MAP.get(tool_name, "General")
            tool_calls = [{"name": tc["name"], "args": tc["args"]} for tc in m.tool_calls]
            return agent_name, tool_calls
    return None, []


# --- REQUEST/RESPONSE MODELS ---
class LoginRequest(BaseModel):
    email: str

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ReportRequest(BaseModel):
    session_id: str

class ChatResponse(BaseModel):
    ai_message: str
    agent_name: Optional[str] = None
    tool_calls: list = []
    blocked: bool = False
    block_message: Optional[str] = None


# --- ENDPOINTS ---
@app.get("/api/users")
def list_users():
    """Return user list for the login combobox."""
    users = get_users()
    return {"users": users}


@app.post("/api/login")
def login(req: LoginRequest):
    """
    Select user, run silent 'Who am I?' login, return session.
    Mirrors app_ui.py lines 108-126.
    """
    email = req.email
    customer_id = get_customer_id_by_email(email)
    if not customer_id:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Find display name from users list
    users = get_users()
    user_info = next((u for u in users if u["email"] == email), None)
    display_name = user_info["displayName"] if user_info else "User"
    policy_type = user_info["policyType"] if user_info else ""

    # Silent login: inject "Who am I?" message (mirrors lines 116-124)
    init_msg = HumanMessage(content=f"I am {email}. Who am I?")
    response = graph.invoke({
        "messages": [init_msg],
        "authenticated_customer_id": customer_id
    })

    # Create session
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "messages": response["messages"],
        "authenticated_customer_id": customer_id,
        "email": email,
        "display_name": display_name,
        "policy_type": policy_type,
    }

    return {
        "session_id": session_id,
        "display_name": display_name,
        "email": email,
        "policy_type": policy_type,
        "customer_id": customer_id,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Send a message. Runs guardrails then graph.invoke().
    Mirrors app_ui.py lines 154-213.
    """
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session. Please log in again.")

    # A. Guardrail check (mirrors lines 163-171)
    validation = validate_input(
        req.message,
        session["email"],
        session.get("messages", [])
    )

    if not validation["valid"]:
        # Save rejection to history
        block_msg = validation["message"]
        session["messages"].append(HumanMessage(content=req.message))
        session["messages"].append(AIMessage(content=block_msg))
        return ChatResponse(
            ai_message=block_msg,
            blocked=True,
            block_message=block_msg,
        )

    # B. Agent execution (mirrors lines 173-213)
    session["messages"].append(HumanMessage(content=req.message))

    try:
        response = graph.invoke({
            "messages": session["messages"],
            "authenticated_customer_id": session["authenticated_customer_id"]
        })

        ai_msg = response["messages"][-1]
        session["messages"] = response["messages"]

        # Detect agent (mirrors lines 186-209)
        agent_name, tool_calls = detect_agent(response["messages"])

        return ChatResponse(
            ai_message=ai_msg.content,
            agent_name=agent_name,
            tool_calls=tool_calls,
        )

    except Exception as e:
        return ChatResponse(
            ai_message=f"System error: {str(e)}",
            blocked=True,
            block_message=str(e),
        )


@app.delete("/api/chat/history")
def clear_history(session_id: str):
    """Clear conversation history for a session."""
    if session_id in sessions:
        email = sessions[session_id]["email"]
        customer_id = sessions[session_id]["authenticated_customer_id"]

        # Re-run silent login
        init_msg = HumanMessage(content=f"I am {email}. Who am I?")
        response = graph.invoke({
            "messages": [init_msg],
            "authenticated_customer_id": customer_id
        })
        sessions[session_id]["messages"] = response["messages"]

        return {"status": "cleared"}
    raise HTTPException(status_code=404, detail="Session not found")


@app.post("/api/report")
def get_report(req: ReportRequest):
    """Generate executive summary report for the authenticated customer."""
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session. Please log in again.")

    customer_id = session["authenticated_customer_id"]
    try:
        report = generate_report(customer_id)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@app.get("/api/health")
def health():
    return {"status": "ok", "db_exists": os.path.exists(DB_PATH)}
