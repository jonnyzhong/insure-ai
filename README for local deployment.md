# InsureAI — AI Insurance Assistant

A professional React + FastAPI application wrapping a multi-agent LangGraph insurance chatbot with 5 specialized AI agents.

## Architecture

```
Frontend (React + Vite + TypeScript)
  ↕ REST API
Backend (FastAPI)
  ↕ graph.invoke()
LangGraph Supervisor → 5 Agents → SQLite + ChromaDB
```

**Agents:** Customer, Policy, Claims, Billing, FAQ (RAG)

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file in project root
cp ../.env.example ../.env
# Edit ../.env with your OpenAI API key

# Generate database
python db/setup.py

# Seed FAQ vector database
python -m vectordb.vector_db

# Start server
uvicorn api:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Open the App

Visit `http://localhost:5173` in your browser.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4, shadcn/ui |
| State | Zustand |
| Backend | FastAPI, LangGraph, LangChain |
| LLM | GPT-4o-mini (via OpenAI API) |
| Database | SQLite (structured data), ChromaDB (FAQ vector search) |
| Context | Singapore insurance (NCD, COE, GIRO, PayNow, MAS) |

## Features

- Professional landing page with AuraChat design
- Searchable login with 1000+ demo users
- Real-time chat with AI agent routing visualization
- Agent badges showing which specialist handled each query
- Security guardrails (off-topic, prompt injection, data access)
- Dark mode support
- WCAG-compliant accessibility
- Responsive design (mobile, tablet, desktop)
