# Troubleshooting

## Backend Issues

### "OPENAI_API_KEY not set" or Authentication Error

**Symptom:** Login fails, chat returns errors, or you see `openai.AuthenticationError`.

**Fix:**
1. Verify `.env` exists in the project root (not inside `backend/`)
2. Check the key is valid: `echo $OPENAI_API_KEY`
3. Ensure the key starts with `sk-`
4. Restart the backend server after changing `.env`

```bash
# Verify .env location
ls -la .env          # Should exist at project root

# Verify key is loaded
cd backend
python -c "from dotenv import load_dotenv; load_dotenv('../.env'); import os; print(os.getenv('OPENAI_API_KEY', 'NOT SET')[:10])"
```

---

### "Database not found" or Empty User List

**Symptom:** Login shows no users, or `/api/health` returns `{"db_exists": false}`.

**Fix:**
```bash
cd backend
python db/setup.py
```

Verify:
```bash
ls -la db/insurance_support.db   # Should exist (~2-5 MB)
```

---

### "No module named 'agent_supervisor'" or Import Errors

**Symptom:** Backend crashes on startup with `ModuleNotFoundError`.

**Fix:**
1. Ensure you're running from the `backend/` directory:
   ```bash
   cd backend
   uvicorn api:app --reload --port 8000
   ```
2. Ensure virtual environment is activated:
   ```bash
   source venv/bin/activate   # or venv\Scripts\activate on Windows
   ```
3. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### ChromaDB Collection Empty

**Symptom:** FAQ Agent returns irrelevant or empty results.

**Fix:**
```bash
cd backend
python -m vectordb.vector_db
```

---

### "Invalid session. Please log in again."

**Symptom:** Chat or report requests return 401.

**Causes:**
- Backend server was restarted (sessions are in-memory)
- Session ID is invalid or expired

**Fix:** Log out and log in again from the frontend.

---

### Agent Returns Wrong Data or Routing Error

**Symptom:** Questions are routed to the wrong agent, or tools return unexpected data.

**Fix:**
1. Restart the backend server (reloads all tool registrations)
2. Check the backend console for `[Supervisor] Routing to:` log messages
3. Enable LangSmith tracing (`LANGSMITH_API_KEY` in `.env`) to inspect the full agent trace

---

## Frontend Issues

### CORS Error in Browser Console

**Symptom:** `Access to XMLHttpRequest... has been blocked by CORS policy`

**Fix:**
1. Ensure backend is running on port `8000`
2. Ensure frontend is running on port `5173`
3. If using a different port, add it to `allow_origins` in `backend/api.py`

---

### Blank Page or "Cannot GET /chat"

**Symptom:** Page loads blank or shows a routing error.

**Fix:**
1. Ensure you're accessing `http://localhost:5173` (not `5174` or other port)
2. Check browser console for errors
3. Try clearing browser cache and hard refresh: `Ctrl + Shift + R`

---

### PDF Export Doesn't Download

**Symptom:** Clicking "Export PDF" does nothing or triggers browser print dialog.

**Causes:**
- Report not fully rendered when export is clicked
- html2canvas failed (falls back to `window.print()`)

**Fix:**
1. Wait for the report to fully load before clicking Export
2. If browser print opens, use "Save as PDF" from the print dialog
3. Check browser console for `[PDF]` error messages

---

### Charts Not Rendering

**Symptom:** Report shows empty spaces where charts should be.

**Fix:**
1. Verify `recharts` is installed: `npm ls recharts`
2. If missing: `cd frontend && npm install`
3. Check browser console for Recharts errors

---

### Typing Indicator Stuck

**Symptom:** "AI is typing..." doesn't go away.

**Cause:** The API call failed silently.

**Fix:**
1. Check browser console for network errors
2. Verify backend is running
3. Refresh the page — state will reset

---

## Environment Issues

### Windows: "source: command not found"

**Fix:** Use the Windows activation command:
```powershell
venv\Scripts\Activate.ps1     # PowerShell
venv\Scripts\activate          # Git Bash
```

### Python Version Too Old

**Symptom:** `SyntaxError` on type hints like `list[str]`.

**Fix:** Upgrade to Python 3.10+:
```bash
python --version   # Must be 3.10 or higher
```

### Node Version Too Old

**Symptom:** npm install fails with syntax errors.

**Fix:** Upgrade to Node.js 18+:
```bash
node --version   # Must be 18 or higher
```

---

## Debug Checklist

When something isn't working, check these in order:

1. **Backend running?** `curl http://localhost:8000/api/health`
2. **Database exists?** Check `db_exists: true` in health response
3. **Virtual env active?** `which python` should point to `venv/`
4. **Frontend running?** Open `http://localhost:5173` in browser
5. **Console errors?** Check both backend terminal and browser console
6. **Correct ports?** Backend: 8000, Frontend: 5173
7. **API key valid?** Test with a simple OpenAI call
8. **Latest code?** Restart both servers after code changes
