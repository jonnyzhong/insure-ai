# Quickstart

Get the full application running locally in 5 minutes.

## Prerequisites

- ✅ **Python** 3.10 or higher
- ✅ **Node.js** 18 or higher
- ✅ **npm** 9 or higher
- ✅ **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

## Steps

### 1. Clone & Configure

```bash
git clone https://github.com/YOUR_USERNAME/insure-ai.git
cd insure-ai
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-key-here
LANGSMITH_API_KEY=your-key-here  # Optional
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Initialize Data

```bash
# Generate database with 1,000 synthetic customers
python db/setup.py

# Initialize FAQ vector store
python -m vectordb.vector_db
```

::: info
`setup.py` creates an SQLite database with 1,000 customers, ~1,500 policies, ~5,000 billing records, ~300 claims, and vehicle details. This takes about 10 seconds.
:::

### 4. Start Backend Server

```bash
uvicorn api:app --reload --port 8000
```

Verify it's running:

```bash
curl http://localhost:8000/api/health
```

Expected output:

```json
{"status": "ok", "db_exists": true}
```

### 5. Setup & Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

### 6. Use the Application

Open your browser to **http://localhost:5173**

1. Click **Get Started** on the landing page
2. Search for a user in the login combobox (try typing "motor")
3. Select a user and click **Login**
4. Start chatting! Try these:
   - `"What policies do I have?"`
   - `"Do I owe anything?"`
   - `"What is NCD?"`
   - `"Generate report"`

## Expected Result

After logging in, you'll see:

- A **chat interface** with a sidebar showing your name and policy type
- **Agent badges** on AI responses indicating which specialist handled the query
- **Tool call traces** you can expand to see exactly what database queries ran
- An **Executive Report** button in the sidebar that generates a full dashboard

## What's Next?

- **[Installation Guide](/installation/installation)** — Detailed setup with troubleshooting
- **[Basic Usage](/usage/basic-usage)** — Learn all the chat features
