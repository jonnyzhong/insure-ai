# Deployment

::: warning
InsureAI currently runs in **development mode only**. The instructions below outline the recommended approach for production deployment, but some features (like persistent sessions) require code changes.
:::

## Local Development

### Start Both Services

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn api:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Health Check | http://localhost:8000/api/health |
| API Docs (auto) | http://localhost:8000/docs |

---

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

This produces a `dist/` folder with static assets. Serve these with any static file server (Nginx, Caddy, Vercel, Netlify).

### Backend Production Server

Replace the development server with Gunicorn + Uvicorn workers:

```bash
pip install gunicorn

gunicorn api:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

---

## Docker Deployment (Recommended)

### Dockerfile — Backend

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY backend/ .
COPY .env .env

RUN pip install --no-cache-dir -r requirements.txt

# Generate database and vector store
RUN python db/setup.py
RUN python -m vectordb.vector_db

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile — Frontend

```dockerfile
FROM node:20-slim AS build

WORKDIR /app
COPY frontend/ .
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - db-data:/app/db
      - vector-data:/app/vectordb/chroma_faq_db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  db-data:
  vector-data:
```

::: info
These Docker files are **reference examples** — they have not been tested with the current codebase. Adjust paths and configurations as needed.
:::

---

## Cloud Deployment Options

| Platform | Frontend | Backend | Notes |
|----------|----------|---------|-------|
| **Vercel + Railway** | Vercel (static) | Railway (Python) | Easy setup, free tiers |
| **AWS** | S3 + CloudFront | EC2 or ECS | Full control, more config |
| **GCP** | Cloud Storage + CDN | Cloud Run | Serverless backend |
| **Azure** | Static Web Apps | App Service | Enterprise integration |
| **Render** | Static Site | Web Service | Simple PaaS |

### Key Considerations

1. **Update CORS origins** in `api.py` to include your production domain
2. **Update API base URL** in `frontend/src/api/client.ts` to point to production backend
3. **Set environment variables** on the server (not committed to git)
4. **Database** — SQLite works for single-instance; use PostgreSQL for multi-instance
5. **Sessions** — Replace in-memory dict with Redis for multi-instance
