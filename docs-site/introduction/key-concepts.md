# Key Concepts

Understanding these concepts will help you navigate the codebase and documentation.

## Multi-Agent Architecture

### Supervisor Agent

The **Supervisor** is a LLM node that receives every user message and decides which specialist agent should handle it. It uses **structured output** (Pydantic `RouterOutput` model) to produce a routing decision.

```python
class RouterOutput(BaseModel):
    next: Literal[
        "customer_agent", "policy_agent", "claims_agent",
        "billing_agent", "faq_agent", "FINISH"
    ]
```

The supervisor does **not** answer questions — it only routes.

### Specialist Agents

Each specialist agent is a LangGraph node that:

1. Receives the full message history
2. Has access to a specific set of **tools** (database query functions)
3. Calls tools as needed via LLM tool-calling
4. Returns a natural language response

| Agent | Domain | Tools |
|-------|--------|-------|
| Customer Agent | Identity & profile | `lookup_customer` |
| Policy Agent | Policies & vehicles | `get_customer_policies`, `get_policy_details`, `get_vehicle_details` |
| Billing Agent | Invoices & payments | `get_billing_history` |
| Claims Agent | Claims lifecycle | `get_customer_claims`, `check_claim_status`, `file_new_claim` |
| FAQ Agent | General knowledge | `search_faq` (RAG) |

### Tool Nodes

Tool nodes are LangGraph nodes that **execute** the tool calls requested by an agent. They sit between the agent and the database.

```
Agent Node → (tool_calls in message) → Tool Node → (tool results) → Agent Node
```

## Security Model

### Guardrails

The **guardrail** is a pre-processing filter that runs **before** any agent sees the message. It has two layers:

1. **Regex Pre-Filter** — Fast pattern matching for SQL injection and jailbreak attempts
2. **LLM Semantic Guard** — GPT-4o-mini with `GuardrailVerdict` structured output that classifies whether the message is insurance-related and safe

### SecureToolNode

The `SecureToolNode` is a wrapper around LangGraph's `ToolNode` that injects the `authenticated_customer_id` into the tool's runtime config. Every tool then checks:

```python
auth_id = config.get("configurable", {}).get("authenticated_customer_id", "")
if auth_id and customer_id != auth_id:
    return "Access denied."
```

This ensures users can **only query their own data**, even if the LLM hallucinates a different customer ID.

### Sessions

Sessions are server-side dictionaries keyed by UUID. Each session stores:

- `messages` — Full LangGraph conversation history
- `authenticated_customer_id` — The customer ID established at login
- `email` — The user's email address
- `display_name` — The user's full name

## State Graph

The LangGraph `StateGraph` defines the flow between nodes:

```python
class AgentState(TypedDict):
    messages: Annotated[List, add_messages]   # Conversation history
    next: str                                  # Routing decision
    authenticated_customer_id: str             # Security context
```

The `messages` field uses LangGraph's `add_messages` reducer, which appends new messages rather than replacing the list.

## RAG (Retrieval-Augmented Generation)

The FAQ agent uses **ChromaDB** as a vector store. At startup, 22 Singapore insurance FAQs are embedded and stored. When a user asks a general question, the `search_faq` tool performs cosine similarity search to find relevant answers.

## Executive Report

The report system operates **outside** the LangGraph agent workflow. It's a dedicated endpoint (`POST /api/report`) that:

1. Queries the database directly for customer profile, policies, billing, and claims
2. Sends the aggregated data to GPT-4o-mini with `ExecutiveSummary` structured output
3. Returns the combined report as JSON
4. The frontend renders it as an interactive dashboard with Recharts charts

Reports are **cached per session** on the frontend to avoid redundant API calls.
