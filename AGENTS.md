# Seva Setu — AI Coding Agent Directives & Engineering Standards

> **Role:** Operational and Architecture Directives for AI Coding Assistants (Antigravity, Gemini, Copilot, Claude, Cursor)  
> **Mission:** Maintain code quality, architectural consistency, security, and public trust in Seva Setu.

---

## 1. Core Technology Stack & Deployment Topology

Every AI coding agent operating in this repository must respect and preserve the existing stack:

* **Frontend:** React 18, Vite 5, Tailwind CSS, React Router v6, Lucide React, Recharts.
* **Backend:** Python 3.10+, Flask, Flask-SQLAlchemy, Flask-CORS, Gunicorn.
* **Database:** PostgreSQL 16 (Neon Serverless) with SQLite local fallback.
* **Frontend Hosting:** Vercel (Edge CDN, Single Page Application).
* **Backend Hosting:** Render (Linux Web Service, Gunicorn WSGI).
* **Repository:** `https://github.com/Ani2025-git/internship`

> [!CAUTION]
> **DO NOT** introduce alternative frontend frameworks (e.g. Next.js, Remix, Vue), alternative backend frameworks (FastAPI, Django, Express), or replace PostgreSQL with MongoDB/Firebase.

---

## 2. Mandatory Coding Rules

1. **Inspect Before Modifying:**
   - Always read existing files, imports, route definitions, and model columns before writing new code.
   - Never assume an API or table exists without checking `backend/app/models/` and `backend/app/routes/`.
2. **Reuse Existing Patterns & Components:**
   - Reuse existing UI components (`frontend/src/components/`): `ExternalRedirectModal`, `ConfirmModal`, `QueueBadge`, `Navbar`, `Footer`.
   - Reuse frontend API service layer (`frontend/src/services/api.js`): `publicService`, `schemeService`, `adminService`, `authService`.
   - Reuse backend authentication decorators (`backend/app/middleware/auth.py`): `@jwt_required`, `@observer_required`, `@admin_required`.
   - Reuse audit logging (`backend/app/services/audit_service.py`): `log_audit()`.
3. **Avoid Duplicate Functionality:**
   - Do not create parallel service files or redundant route blueprints.
4. **Strict Input Sanitization & Data Minimization:**
   - Validate every request body in Flask before committing to the database.
   - Use `sanitize_text()` from `backend/app/utils/validators.py` for free-text inputs.
   - Run `check_personal_info()` to proactively block accidental citizen submissions of sensitive PII (Aadhaar, phone numbers).
5. **Environment Variables & Secrets Security:**
   - Never hardcode database credentials, passwords, or JWT secrets in Python or JavaScript files.
   - Use `os.getenv()` in Python and `import.meta.env` in Vite.
   - Never commit `.env` files containing live credentials.
6. **Preserve Backward Compatibility:**
   - Ensure existing public endpoints remain backward-compatible when adding new parameters.

---

## 3. Database Integrity & Migration Rules

1. **Zero Data Loss:**
   - Never drop existing tables or delete production citizen records in live deployments.
   - Avoid `db.drop_all()` in production code.
2. **Schema Synchronization:**
   - When modifying or adding models in `backend/app/models/`:
     - Register the new model in `backend/app/models/__init__.py`.
     - Update all startup entry points (`app.py`, `backend/app.py`, `backend/run.py`, `api/index.py`).
     - Update `docs/DATABASE.md`.
3. **Preserve Relationships:**
   - Maintain existing foreign key relationships between `users`, `centres`, `services`, `observations`, and `government_schemes`.

---

## 4. Verification & Testing Protocol

Before considering any task complete, an AI coding agent must perform:

1. **Code Syntax & Dependency Validation:**
   - Check that all imported modules exist in `package.json` and `requirements.txt`.
2. **Production Build Verification:**
   - Run a clean production build to catch JSX, TypeScript, lint, or bundler errors:
     ```powershell
     cd frontend
     node node_modules/vite/bin/vite.js build
     node sync-dist.js
     ```
3. **Route & Auth Integrity:**
   - Verify that new routes work across all 3 user roles: Guest, Citizen, Administrator.
4. **Responsive Layouts:**
   - Verify that UI components adapt gracefully to mobile viewports (320px–430px) as well as desktop (1024px–1440px).
5. **No Claims Without Verification:**
   - Never state that a feature is working without having tested the endpoint or build output.

---

## 5. Documentation Maintenance Directives

Whenever a coding task alters features, endpoints, schemas, or configurations, the agent must update the relevant documentation:

* **If APIs Change:** Update [`docs/API_DOCUMENTATION.md`](file:///d:/Seva%20Queue/docs/API_DOCUMENTATION.md).
* **If Database Schema Changes:** Update [`docs/DATABASE.md`](file:///d:/Seva%20Queue/docs/DATABASE.md).
* **If Features Change or Are Added:** Update [`docs/FEATURES.md`](file:///d:/Seva%20Queue/docs/FEATURES.md).
* **If Dependencies or Setup Change:** Update [`docs/DEVELOPMENT_GUIDE.md`](file:///d:/Seva%20Queue/docs/DEVELOPMENT_GUIDE.md) and [`README.md`](file:///d:/Seva%20Queue/README.md).
* **If Priorities Shift:** Update [`docs/ROADMAP.md`](file:///d:/Seva%20Queue/docs/ROADMAP.md).
* **Every Meaningful Release:** Append a new entry to [`CHANGELOG.md`](file:///d:/Seva%20Queue/CHANGELOG.md).

---

## 6. Standard Task Completion Report Format

At the conclusion of every engineering task, the agent must provide a structured report following this format:

```markdown
### Summary of Changes
1. **What Was Implemented:** Brief description of functional enhancements.
2. **Files Created:** List of new files with paths.
3. **Files Modified:** List of modified files with key changes.
4. **Database Changes:** Models or columns added, modified, or migrated.
5. **APIs Added or Changed:** Endpoint paths, HTTP methods, and auth requirements.
6. **Tests & Verification Performed:** Local runs, build results, and live probes.
7. **Known Issues / Pending External Actions:** e.g., Render deployment pending.
8. **Documentation Updated:** List of documentation files refreshed.
```

