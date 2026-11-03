# Seva Setu — Troubleshooting & Operational Runbook

> **Platform:** Seva Setu  
> **Audience:** Developers, Site Reliability Engineers, Support Staff, AI Agents

---

## 1. Issue Index

1. [Render Cold Start & "Failed to Load Schemes"](#1-render-cold-start--failed-to-load-schemes)
2. [Admin "Failed to change website status"](#2-admin-failed-to-change-website-status)
3. [Vercel 404 NOT_FOUND on Page Refresh](#3-vercel-404-not_found-on-page-refresh)
4. [CORS Policy Blocking API Requests](#4-cors-policy-blocking-api-requests)
5. [Neon Database Connection & SSL Errors](#5-neon-database-connection--ssl-errors)
6. [Windows PowerShell Execution Policy Error](#6-windows-powershell-execution-policy-error)
7. [JWT Token Expiration & Unauthorized Redirects](#7-jwt-token-expiration--unauthorized-redirects)

---

## 2. Issues & Solutions

### 1. Render Cold Start & "Failed to Load Schemes"

* **Symptom:** Opening `/schemes` shows temporary loading delay or earlier builds showed a red error card: *"Failed to Load Schemes — Unable to reach the government schemes directory"*.
* **Root Cause:** Render's free tier spins down idle instances after 15 minutes of inactivity. When the first new request arrives, Gunicorn takes 30–50 seconds to initialize.
* **Resolution in Code:** 
  The frontend includes a zero-downtime offline cache ([`frontend/src/data/fallbackSchemes.js`](file:///d:/Seva%20Queue/frontend/src/data/fallbackSchemes.js)). If Render is sleeping or cold-starting, the app immediately serves the verified offline cache. Citizens never see broken error cards.
* **Operational Action:** To wake up the backend manually, run:
  ```powershell
  curl.exe -i https://sevasetu-mb4e.onrender.com/api/health
  ```

---

### 2. Admin "Failed to change website status"

* **Symptom:** Clicking **"TURN OFF WEBSITE (MAINTENANCE)"** in Admin Dashboard displays `⚠️ Failed to change website status.`
* **Root Cause:** Vercel deploys frontend changes in ~20 seconds, whereas Render takes 2–4 minutes to build Python dependencies. If an administrator tests the switch before Render finishes deploying the new API endpoints (`/api/admin/website-settings`), the request returns `404 Not Found`.
* **Resolution:**
  1. Open [dashboard.render.com](https://dashboard.render.com).
  2. Locate `sevasetu-backend`.
  3. In **Deploys / Events**, check if a deployment is in progress.
  4. If auto-deploy was not triggered, click **"Manual Deploy" $\rightarrow$ "Deploy latest commit"**.
  5. Once the deployment status turns green (**Live**), refresh the admin dashboard and toggle again.

---

### 3. Vercel 404 NOT_FOUND on Page Refresh

* **Symptom:** Navigating to `/schemes`, `/services`, or `/bsk-centres` works through links, but pressing browser refresh (`F5`) or directly pasting the URL returns Vercel's `404 NOT_FOUND`.
* **Root Cause:** Single Page Applications (SPAs) manage routing in browser memory. When a direct request hits Vercel, the static CDN looks for a physical directory `/schemes/index.html` unless a rewrite rule is defined.
* **Resolution in Code:**
  Configured in [`vercel.json`](file:///d:/Seva%20Queue/vercel.json) and [`frontend/vercel.json`](file:///d:/Seva%20Queue/frontend/vercel.json):
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://sevasetu-mb4e.onrender.com/api/$1" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

---

### 4. CORS Policy Blocking API Requests

* **Symptom:** Browser console outputs: `Access to XMLHttpRequest at '...' from origin 'https://sevasetu-flax-kappa.vercel.app' has been blocked by CORS policy`.
* **Root Cause:** The `CORS_ORIGINS` environment variable on Render does not list the Vercel domain.
* **Resolution:**
  1. In Render Dashboard, edit `CORS_ORIGINS`.
  2. Set to `https://sevasetu-flax-kappa.vercel.app,http://localhost:5173` (or `*` during development).
  3. Restart the service.

---

### 5. Neon Database Connection & SSL Errors

* **Symptom:** Backend throws: `psycopg2.OperationalError: SSL connection has been closed unexpectedly` or `connection to server at "ep-..." failed: server closed the connection unexpectedly`.
* **Root Cause:** Neon is a serverless database that scales compute to zero on inactivity. Cold starts can briefly sever stale pooled connections.
* **Resolution in Code:**
  Configured in [`backend/config.py`](file:///d:/Seva%20Queue/backend/config.py):
  - `SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True}` automatically tests and recovers broken pooled connections before query execution.
  - Mandatory `?sslmode=require` query parameter in `DATABASE_URL`.

---

### 6. Windows PowerShell Execution Policy Error

* **Symptom:** Running `.\venv\Scripts\Activate.ps1` produces: `File cannot be loaded because running scripts is disabled on this system`.
* **Root Cause:** Default Windows PowerShell restriction on unsigned scripts.
* **Resolution:**
  Run this one-time command in PowerShell:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

### 7. JWT Token Expiration & Unauthorized Redirects

* **Symptom:** An admin or observer suddenly gets redirected to `/login?expired=1`.
* **Root Cause:** JWT tokens expire after 24 hours (`JWT_EXPIRATION_HOURS = 24`). The Axios response interceptor in [`frontend/src/services/api.js`](file:///d:/Seva%20Queue/frontend/src/services/api.js) automatically catches `401 Unauthorized` responses on protected dashboard paths, flushes `sevasetu_token`, and redirects to login for security.
* **Resolution:** Log back in with valid credentials.

