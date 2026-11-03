# Seva Setu — Production Deployment Guide

> **Frontend Hosting:** Vercel (Edge CDN)  
> **Backend Hosting:** Render (Linux Python Web Service)  
> **Database:** Neon (Serverless PostgreSQL 16 with SSL)  
> **Repository:** `https://github.com/Ani2025-git/internship`

---

## 1. Architecture & Hosting Topology

Seva Setu operates a dual-host production topology:

```
[Citizen Browser]
       │
       ▼
 [Vercel CDN] ──────── (Static Assets / React SPA Routes)
       │
       ▼ (/api/* Proxy via vercel.json)
[Render Backend] ──── (Gunicorn + Flask WSGI)
       │
       ▼ (SSL / Connection Pooler)
[Neon PostgreSQL] ─── (Stateful Data)
```

---

## 2. Frontend Deployment (Vercel)

The React frontend is continuously deployed on Vercel from the GitHub `main` branch.

### 2.1 Project Settings on Vercel
* **Framework Preset:** `Vite`
* **Root Directory:** `./` (or `frontend`)
* **Build Command:** `npm run build`
* **Output Directory:** `frontend/dist` (or `dist`)
* **Node.js Version:** `20.x`

### 2.2 SPA Rewrites & Routing (`vercel.json`)
To prevent `404 NOT_FOUND` errors when citizens directly open or refresh routes like `/schemes`, `/services`, or `/bsk-centres`, `vercel.json` defines SPA fallback rules while preserving API proxying:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://sevasetu-mb4e.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2.3 Frontend Environment Variables
Set in Vercel **Project Settings $\rightarrow$ Environment Variables**:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://sevasetu-mb4e.onrender.com/api` | Direct production backend API URL |

---

## 3. Backend Deployment (Render)

The Flask backend is deployed on Render as a Python Web Service.

### 3.1 Service Configuration (`render.yaml`)
* **Service Type:** Web Service
* **Runtime:** Python 3
* **Branch:** `main`
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `gunicorn app:app`
* **Health Check Path:** `/api/health`

### 3.2 Backend Environment Variables on Render
Set in Render **Dashboard $\rightarrow$ Environment**:

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` | Specific Python release |
| `FLASK_ENV` | `production` | Production mode |
| `FLASK_DEBUG` | `false` | Disable debug tracebacks |
| `DATABASE_URL` | `postgresql://<user>:<password>@<neon-pooler-host>/<db>?sslmode=require` | Neon PostgreSQL pooled URL |
| `SECRET_KEY` | *(Generate Random 32+ Chars)* | Flask session signing key |
| `JWT_SECRET_KEY` | *(Generate Random 32+ Chars)* | JWT token signing key |
| `JWT_EXPIRATION_HOURS` | `24` | Token validity window |
| `CORS_ORIGINS` | `https://sevasetu-flax-kappa.vercel.app` | Restrict cross-origin callers |
| `STALE_THRESHOLD_MINUTES`| `30` | Queue freshness threshold |

---

## 4. Database Setup (Neon PostgreSQL)

1. Create a serverless PostgreSQL 16 project on [Neon](https://neon.tech).
2. Choose **AWS Asia Pacific (Mumbai / Singapore)** for minimal latency in India.
3. Obtain the **Pooled Connection String** with `sslmode=require`.
4. Run the schema migrations or startup initializer:
   - On application boot, `db.create_all()` automatically provisions all 16 tables.
   - `WebsiteSettings.get_settings()` initializes the singleton maintenance control record.

---

## 5. Post-Deployment Verification Protocol

Run the following checks after any production deployment:

### 1. Backend Health Check
```powershell
curl -i https://sevasetu-mb4e.onrender.com/api/health
```
*Expected:* HTTP `200 OK` with JSON `"status": "healthy"`.

### 2. Public Welfare Schemes Endpoint
```powershell
curl -i https://sevasetu-mb4e.onrender.com/api/schemes
```
*Expected:* HTTP `200 OK` with `"total": 7` verified schemes.

### 3. SPA Route Refresh Verification
1. Open `https://sevasetu-flax-kappa.vercel.app/schemes` in a browser.
2. Press `F5` / Refresh $\rightarrow$ Verify that the page reloads cleanly without Vercel 404.
3. Directly open `/schemes/kanyashree-prakalpa` in a private browsing window $\rightarrow$ Verify details load.

### 4. Admin Portal & Maintenance Mode Test
1. Log in at `https://sevasetu-flax-kappa.vercel.app/login` with `admin@sevasetu.org`.
2. Open **Website Control** tab.
3. Test the **Live Citizen Preview** modal across Bengali, English, and Hindi.

