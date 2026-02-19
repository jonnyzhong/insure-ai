# Basic Usage

This guide walks through the primary features of InsureAI.

## Login

1. Navigate to `http://localhost:5173` and click **Get Started** (or go directly to `/login`)
2. Click the **search combobox** and start typing a name, email, or policy type
3. Select a user from the dropdown — a **preview card** shows their details
4. Click **Login**

::: info
Behind the scenes, login runs a silent `"I am {email}. Who am I?"` query through the agent graph to establish identity context. This means the AI already knows who you are when you start chatting.
:::

## Chatting

### Asking Questions

Type a message in the input field and press **Enter** or click the send button. The AI will route your question to the appropriate specialist agent.

**Try these example queries:**

| Query | Expected Agent | What Happens |
|-------|---------------|--------------|
| "What policies do I have?" | Policy Agent | Looks up all your policies |
| "What car is covered?" | Policy Agent | Retrieves vehicle VIN, make, model |
| "Do I owe anything?" | Billing Agent | Shows unpaid invoices |
| "What claims do I have?" | Claims Agent | Lists all your claims |
| "What is NCD?" | FAQ Agent | Searches the knowledge base |
| "Who am I?" | Customer Agent | Shows your profile details |

### Understanding Responses

Each AI response includes:

- **Agent Badge** — A colored label showing which specialist handled the query (e.g., "Policy Agent", "Claims Agent")
- **Tool Call Trace** — An expandable panel showing the tools that executed with their arguments
- **Markdown Formatting** — Responses may include bold text, bullet points, and tables

### Guardrail Blocks

If you ask something off-topic, you'll see a **guardrail notice** instead of a regular response:

> "Request Blocked: This question is not related to insurance. I can help you with policy details, billing, claims, and general insurance questions."

This is the three-layer security system working as designed.

## Quick Actions

The sidebar and mobile view include **Quick Action** buttons — pre-configured topic prompts you can click instead of typing. Examples:

- "Show my policies"
- "Check my billing"
- "What claims do I have?"

### Customizing Topics

Click the **gear icon** next to "Suggested Topics" in the sidebar to open the **Topic Settings Dialog**. You can:

- Edit existing topic labels and prompts
- Add new topics
- Remove topics you don't need
- Changes persist across sessions via localStorage

## Starting a New Conversation

Click **New Conversation** in the sidebar to:

1. Clear the chat message history
2. Re-run the silent login query (preserves your identity)
3. Clear any cached reports

Your session remains active — you don't need to log in again.

## Executive Report

### Generating a Report

**Option 1 — Sidebar Button:**
Click the **Executive Report** button (chart icon) in the sidebar.

**Option 2 — Chat Command:**
Type any of these in the chat:
- `generate report`
- `executive summary`
- `show report`
- `show my report`

### Report Contents

The report dialog opens as a full-screen overlay with four sections:

1. **Executive Summary** — AI-generated narrative with account status badge and key findings
2. **Customer Profile** — Name, NRIC, email, phone, DOB, address
3. **Policy Portfolio** — Premium bar chart, billing status pie chart, policy detail cards with billing tables
4. **Claims History** — Claims bar chart by status, claims detail table

### Exporting to PDF

Click the **Export PDF** button in the report header. The system:
1. Temporarily adjusts the dialog layout for full-content capture
2. Uses html2canvas to render the DOM to a canvas
3. Splits the canvas across A4 pages using jsPDF
4. Downloads the PDF file

### Report Caching

Once generated, the report is cached for the current session. Clicking the button again opens the cached version instantly without calling the API. The cache clears when you:
- Click **New Conversation**
- Click **Sign Out**

## Dark Mode

Click the **theme toggle** (sun/moon icon) in the sidebar footer to switch between light and dark modes.

## Signing Out

Click **Sign Out** in the sidebar to:
1. Clear your session
2. Clear all chat messages
3. Clear cached reports
4. Redirect to the login page
