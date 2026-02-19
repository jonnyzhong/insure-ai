# Production Checklist

This checklist identifies all demo-grade components that need replacement for a production deployment.

## Critical Changes

### 1. Authentication

**Current:** Email-only login, no password

**Production:**

- [ ] Implement JWT or OAuth 2.0 authentication
- [ ] Add password hashing (bcrypt)
- [ ] Add token expiration and refresh
- [ ] Add rate limiting on login endpoint
- [ ] Consider Singpass integration for Singapore deployments

### 2. Session Storage

**Current:** In-memory Python dictionary

```python
sessions: dict = {}  # Lost on server restart
```

**Production:**

- [ ] Replace with Redis for session storage
- [ ] Add session expiration (e.g., 30 minutes idle timeout)
- [ ] Support multi-instance deployments (shared session store)

### 3. Database

**Current:** SQLite (single file, single-writer)

**Production:**

- [ ] Migrate to PostgreSQL or MySQL
- [ ] Use connection pooling (SQLAlchemy)
- [ ] Add database migrations (Alembic)
- [ ] Implement proper backup strategy
- [ ] Add read replicas for scaling

### 4. CORS Configuration

**Current:** `localhost:5173` and `localhost:3000`

**Production:**

- [ ] Replace with actual production domain(s)
- [ ] Remove localhost origins
- [ ] Consider restricting allowed methods and headers

---

## Security Hardening

### 5. API Security

- [ ] Add API key or token authentication to all endpoints
- [ ] Implement rate limiting (e.g., 60 requests/minute per user)
- [ ] Add request size limits
- [ ] Enable HTTPS/TLS termination
- [ ] Add request logging and audit trail

### 6. Input Validation

**Current guardrails are good, but add:**

- [ ] Input length limits (prevent huge messages)
- [ ] Output filtering (prevent sensitive data leakage in LLM responses)
- [ ] Prompt injection monitoring and alerting

### 7. Secrets Management

- [ ] Use a secrets manager (AWS Secrets Manager, HashiCorp Vault)
- [ ] Rotate API keys regularly
- [ ] Never log API keys or sensitive data

---

## Performance

### 8. Caching

- [ ] Add Redis caching for frequently accessed data (user list, policy lookups)
- [ ] Consider caching guardrail verdicts for repeated queries
- [ ] Frontend: Add service worker for offline capability

### 9. Monitoring

- [ ] Add application monitoring (Datadog, New Relic, or Prometheus)
- [ ] Set up error tracking (Sentry)
- [ ] Monitor LLM API costs and latency
- [ ] Set up alerts for high error rates

### 10. Logging

- [ ] Replace `print()` statements with structured logging
- [ ] Log all API requests with correlation IDs
- [ ] Log guardrail blocks for security monitoring
- [ ] Log LLM token usage for cost tracking

---

## Infrastructure

### 11. Server Configuration

- [ ] Use Gunicorn with multiple Uvicorn workers
- [ ] Set up health check monitoring
- [ ] Configure auto-scaling based on load
- [ ] Set up CI/CD pipeline

### 12. Frontend

- [ ] Build and serve as static assets (Nginx, CDN)
- [ ] Configure environment-specific API base URL
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Add error boundary with reporting

---

## Data

### 13. Database

- [ ] Replace synthetic data with real customer data pipeline
- [ ] Add data encryption at rest
- [ ] Implement data retention policies
- [ ] Add audit logging for all data access

### 14. Vector Store

- [ ] Expand FAQ knowledge base beyond 22 entries
- [ ] Consider using a managed vector database (Pinecone, Weaviate)
- [ ] Implement FAQ content management workflow

---

## Summary Priority

| Priority | Item | Effort |
|----------|------|--------|
| **P0** | Authentication (JWT) | Medium |
| **P0** | HTTPS/TLS | Low |
| **P0** | CORS production domains | Low |
| **P1** | Session storage (Redis) | Medium |
| **P1** | Database (PostgreSQL) | High |
| **P1** | Structured logging | Medium |
| **P2** | Rate limiting | Low |
| **P2** | Monitoring | Medium |
| **P2** | CI/CD pipeline | Medium |
| **P3** | Auto-scaling | High |
| **P3** | CDN | Low |
