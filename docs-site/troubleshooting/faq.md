# FAQ

## General

<details><summary><strong>Is this a production-ready application?</strong></summary>

No. InsureAI is a **demo/prototype** application designed to showcase multi-agent LLM architecture patterns. It uses in-memory sessions, SQLite, and email-only login. See the [Production Checklist](/deployment/production-checklist) for what needs to change for production use.

</details>

<details><summary><strong>What LLM model does it use?</strong></summary>

InsureAI uses **GPT-4o-mini** from OpenAI for all LLM operations (supervisor routing, agent responses, guardrail validation, and report narrative generation). You can switch to `gpt-4o` or other OpenAI models by updating the `ChatOpenAI` instances in `agent_supervisor.py`, `guardrails.py`, and `report.py`.

</details>

<details><summary><strong>How much does it cost to run?</strong></summary>

GPT-4o-mini is very cost-effective. A typical chat message costs ~$0.001-0.003 (2-3 LLM calls). A report generation costs ~$0.002-0.005 (1 LLM call for narrative). At moderate usage (~100 messages/day), monthly cost is approximately $5-15.

</details>

<details><summary><strong>Can I use a different LLM provider (Anthropic, Ollama, etc.)?</strong></summary>

Yes, with code changes. Replace `ChatOpenAI` with the appropriate LangChain integration:
- Anthropic: `from langchain_anthropic import ChatAnthropic`
- Ollama: `from langchain_community.chat_models import ChatOllama`

Note that tool-calling and structured output behavior may vary between providers.

</details>

<details><summary><strong>Is the customer data real?</strong></summary>

No. All customer data is **synthetically generated** by `backend/db/setup.py`. Names, NRICs, addresses, and other personal information are randomly generated and do not correspond to real individuals.

</details>

<details><summary><strong>Can I add more customers?</strong></summary>

Yes. Edit the customer count in `backend/db/setup.py` and re-run `python db/setup.py`. This will recreate the entire database with new synthetic data.

</details>

## Technical

<details><summary><strong>Why does login take a few seconds?</strong></summary>

Login runs a silent `"I am {email}. Who am I?"` query through the full LangGraph agent workflow. This establishes identity context so the AI knows who you are in subsequent conversations. It typically takes 2-4 seconds due to the LLM call.

</details>

<details><summary><strong>Why can't I access another customer's data?</strong></summary>

Every database tool checks the `authenticated_customer_id` against the requested `customer_id`. If they don't match, the tool returns "Access denied." This is the tool-level ownership verification layer.

</details>

<details><summary><strong>Why does the guardrail sometimes allow borderline messages?</strong></summary>

The guardrail uses GPT-4o-mini for semantic classification. It includes the last 4 messages as context to handle follow-ups. Borderline cases may pass through because the LLM interprets them as potentially insurance-related. If the LLM guard fails (API error), it fails open (allows the message) to avoid blocking legitimate users.

</details>

<details><summary><strong>Can I add more FAQ entries?</strong></summary>

Yes. Add entries to `backend/vectordb/faq_data.json` and re-run `python -m vectordb.vector_db` from the `backend/` directory. The FAQ agent will immediately be able to search the new entries.

</details>

<details><summary><strong>Why is the report cached per session?</strong></summary>

Report generation requires an LLM call for the executive narrative. Caching avoids redundant API calls when the user clicks the report button multiple times. The cache clears on New Conversation or Sign Out.

</details>

<details><summary><strong>What happens if the OpenAI API is down?</strong></summary>

- **Guardrails:** Fails open (allows messages through)
- **Report narrative:** Falls back to a basic template without AI narrative
- **Chat:** Returns a system error message
- **Login:** Fails (cannot establish identity context)

</details>

<details><summary><strong>Can I run this without an internet connection?</strong></summary>

No. InsureAI requires the OpenAI API for all LLM operations. To run offline, you would need to replace `ChatOpenAI` with a local model like Ollama.

</details>

## Frontend

<details><summary><strong>How do I change the suggested topics?</strong></summary>

Click the gear icon next to "Suggested Topics" in the sidebar. You can add, edit, or remove topics through the settings dialog. Changes are saved to localStorage.

</details>

<details><summary><strong>Why does PDF export fail sometimes?</strong></summary>

The PDF export uses html2canvas to capture the DOM, which may fail if:
- The report isn't fully rendered when you click Export
- Browser security policies block canvas operations
- Very long reports exceed canvas size limits

If it fails, it automatically falls back to `window.print()` (browser print dialog).

</details>

<details><summary><strong>Does it work on mobile?</strong></summary>

Yes. The interface is responsive with a collapsible sidebar on mobile viewports. The report dialog scales to full screen on all devices.

</details>
