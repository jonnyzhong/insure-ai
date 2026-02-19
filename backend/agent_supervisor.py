"""
agent_supervisor.py
Multi-agent LangGraph workflow with supervisor routing.
"""
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

from typing import Literal, TypedDict, Annotated, List
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages
from pydantic import BaseModel

# --- IMPORT TOOLS ---
from customer_tools import lookup_customer
from policy_tools import get_customer_policies, get_policy_details
from claims_tools import get_customer_claims, check_claim_status, file_new_claim
from billing_tools import get_billing_history
from auto_tools import get_vehicle_details
from rag_tools import search_faq

# --- STATE ---
class AgentState(TypedDict):
    messages: Annotated[List, add_messages]
    next: str
    authenticated_customer_id: str  # Set at login, used by tools to enforce ownership

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# --- SECURE TOOL NODE ---
class SecureToolNode:
    """ToolNode wrapper that passes authenticated_customer_id to tools via config."""
    def __init__(self, tools):
        self.tool_node = ToolNode(tools)

    def __call__(self, state: AgentState, config: RunnableConfig = None):
        config = config or {}
        config = {**config, "configurable": {
            **config.get("configurable", {}),
            "authenticated_customer_id": state.get("authenticated_customer_id", "")
        }}
        return self.tool_node.invoke(state, config)

# --- SUPERVISOR NODE ---
class RouterOutput(BaseModel):
    next: Literal["customer_agent", "policy_agent", "claims_agent", "billing_agent", "faq_agent", "FINISH"]

def supervisor_node(state: AgentState):
    messages = state["messages"]

    system_prompt = """
    You are the Insurance Supervisor. Route based on intent:

    1. 'customer_agent': Login, Who am I, Profile updates.

    2. 'policy_agent' (THE CONTRACT & VEHICLE):
       - General Coverage (Start Date, Premium, Type).
       - FOR MOTOR POLICIES ONLY: Specific Vehicle Details (VIN, Make, Model, License Plate).
       - "View my policy details", "What car is covered?", "What is my deductible?".

    3. 'billing_agent' (THE MONEY):
       - Questions about INVOICES, PAYMENTS, PAYMENTS METHOD or AMOUNTS OWED.
       - "Did I pay?", "How much is due?", "Payment history".

    4. 'claims_agent': Accidents, filing reports, check claim status.

    5. 'faq_agent' (KNOWLEDGE BASE):
       - General definitions & Singapore Terms: "What is NCD?", "What is COE?", "Define GIRO", "Who is MAS?".
       - "How does insurance work?", "Explain PayNow".
       - Questions NOT about a specific user's active policy.

    ROUTING RULES:
    - If user asks "What is my VIN?" or "Which car is this?", route to 'policy_agent'.
    - If user asks "How much is my premium?", route to 'policy_agent'.
    - If user asks "Do I owe anything?", route to 'billing_agent'.
    - If user asks "What is NCD?" or "Explain PayNow", route to 'faq_agent'.

    FINISHING RULES:
    - ONLY return 'FINISH' if the user explicitly says "goodbye", "thanks", or "done".
    - If the user provides new information (like a date or description), route it to the relevant agent.
    - If an agent previously asked a question (e.g., "What is the date?"), DO NOT FINISH. Route back to that Agent.
    """

    router = llm.with_structured_output(RouterOutput)
    response = router.invoke([SystemMessage(content=system_prompt)] + messages)
    print(f"   [Supervisor] Routing to: {response.next}")
    return {"next": response.next}

# --- AGENT NODES ---
def customer_agent_node(state: AgentState):
    print("   [Customer Agent] Thinking...")
    agent = llm.bind_tools([lookup_customer])
    res = agent.invoke(state["messages"])
    return {"messages": [res]}

def policy_agent_node(state: AgentState):
    print("   [Policy Agent] Thinking...")
    agent = llm.bind_tools([get_customer_policies, get_policy_details, get_vehicle_details])
    res = agent.invoke(state["messages"])
    return {"messages": [res]}

def claims_agent_node(state: AgentState):
    print("   [Claims Agent] Thinking...")
    agent = llm.bind_tools([get_customer_claims, check_claim_status, file_new_claim])
    res = agent.invoke(state["messages"])
    return {"messages": [res]}

def billing_agent_node(state: AgentState):
    print("   [Billing Agent] Thinking...")
    instructions = """
    You are the Billing Agent.
    1. Use 'get_billing_history' to see status.
    2. If user sees an UNPAID bill and wants to pay, say: "I will connect you to a secure human agent for payment."
    """
    agent = llm.bind_tools([get_billing_history])
    res = agent.invoke([SystemMessage(content=instructions)] + state["messages"])
    return {"messages": [res]}

def faq_agent_node(state: AgentState):
    print("   [FAQ Agent] Thinking...")
    agent = llm.bind_tools([search_faq])
    res = agent.invoke(state["messages"])
    return {"messages": [res]}

# --- GRAPH ---
workflow = StateGraph(AgentState)

# Nodes
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("customer_agent", customer_agent_node)
workflow.add_node("policy_agent", policy_agent_node)
workflow.add_node("claims_agent", claims_agent_node)
workflow.add_node("billing_agent", billing_agent_node)
workflow.add_node("faq_agent", faq_agent_node)

# Tool Nodes
workflow.add_node("customer_tools", ToolNode([lookup_customer]))
workflow.add_node("policy_tools", SecureToolNode([get_customer_policies, get_policy_details, get_vehicle_details]))
workflow.add_node("claims_tools", SecureToolNode([get_customer_claims, check_claim_status, file_new_claim]))
workflow.add_node("billing_tools", SecureToolNode([get_billing_history]))
workflow.add_node("faq_tools", ToolNode([search_faq]))

# Edges
workflow.add_edge(START, "supervisor")

workflow.add_conditional_edges(
    "supervisor",
    lambda x: x["next"],
    {
        "customer_agent": "customer_agent",
        "policy_agent": "policy_agent",
        "claims_agent": "claims_agent",
        "billing_agent": "billing_agent",
        "faq_agent": "faq_agent",
        "FINISH": END
    }
)

def basic_logic(state, tool_node):
    if getattr(state["messages"][-1], "tool_calls", None):
        return tool_node
    return END

workflow.add_conditional_edges("customer_agent", lambda x: basic_logic(x, "customer_tools"))
workflow.add_edge("customer_tools", "customer_agent")

workflow.add_conditional_edges("policy_agent", lambda x: basic_logic(x, "policy_tools"))
workflow.add_edge("policy_tools", "policy_agent")

workflow.add_conditional_edges("claims_agent", lambda x: basic_logic(x, "claims_tools"))
workflow.add_edge("claims_tools", "claims_agent")

workflow.add_conditional_edges("billing_agent", lambda x: basic_logic(x, "billing_tools"))
workflow.add_edge("billing_tools", "billing_agent")

workflow.add_conditional_edges("faq_agent", lambda x: basic_logic(x, "faq_tools"))
workflow.add_edge("faq_tools", "faq_agent")

graph = workflow.compile()
