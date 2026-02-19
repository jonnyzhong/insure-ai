# Error Handling

## HTTP Status Codes

| Code | Meaning | When Returned |
|------|---------|---------------|
| `200` | Success | Normal responses, including guardrail blocks |
| `401` | Unauthorized | Invalid or missing session_id |
| `404` | Not Found | Customer email not found, session not found |
| `500` | Server Error | LLM failure, database error, report generation failure |

## Error Response Format

All error responses follow FastAPI's standard format:

```json
{
  "detail": "Human-readable error message"
}
```

## Guardrail Blocks vs. Errors

Guardrail blocks are **not** HTTP errors — they return `200 OK` with the `blocked` flag:

```json
{
  "ai_message": "Request Blocked: This question is not related to insurance...",
  "agent_name": null,
  "tool_calls": [],
  "blocked": true,
  "block_message": "Request Blocked: This question is not related to insurance..."
}
```

This is because a guardrail block is a **valid application response**, not a system failure.

## Error Scenarios

### Login Errors

| Scenario | Status | Detail |
|----------|--------|--------|
| Email not found in database | `404` | `"Customer not found"` |
| Database file missing | `404` | `"Customer not found"` (empty user list) |

### Chat Errors

| Scenario | Status | Response |
|----------|--------|----------|
| Invalid session ID | `401` | `{"detail": "Invalid session. Please log in again."}` |
| Guardrail blocks message | `200` | `{blocked: true, block_message: "..."}` |
| LLM/agent failure | `200` | `{ai_message: "System error: ...", blocked: true}` |

### Report Errors

| Scenario | Status | Detail |
|----------|--------|--------|
| Invalid session ID | `401` | `"Invalid session. Please log in again."` |
| LLM API failure | `500` | `"Report generation failed: ..."` |
| Database query failure | `500` | `"Report generation failed: ..."` |

## Fallback Behavior

### Guardrail Fallback

If the guardrail LLM call fails (e.g., OpenAI API is down), the system **fails open**:

```python
except Exception as e:
    print(f"GUARDRAIL ERROR: {e}")
    return {"valid": True}  # Allow the message through
```

This prioritizes availability over strict filtering.

### Report Narrative Fallback

If the executive summary LLM call fails, the report engine generates a basic summary without AI:

```python
except Exception:
    return {
        "account_status": "Active" if has_active else "Inactive",
        "portfolio_narrative": f"Customer holds {len(policies)} policy(ies)...",
        "key_findings": [f"Total policies: {len(policies)}", ...],
    }
```

### PDF Export Fallback

If html2canvas fails, the frontend falls back to `window.print()`:

```typescript
const success = await exportToPDF(reportRef.current, title);
if (!success) {
  window.print();  // Browser native print dialog
}
```

## Frontend Error Handling

The frontend handles errors at three levels:

1. **API Layer** — Axios interceptors catch network errors
2. **Store Layer** — Zustand stores set `error` state for UI display
3. **Component Layer** — Error boundaries and conditional rendering

```typescript
// Report error state
if (error) {
  return (
    <div className="flex flex-col items-center py-16">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p>Failed to Generate Report</p>
      <p>{error}</p>
    </div>
  );
}
```
