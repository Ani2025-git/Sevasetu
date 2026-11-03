# Seva Setu — Changelog & Version History

All notable changes to the **Seva Setu** platform are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Added
- Complete comprehensive GitHub Documentation System:
  - `docs/ARCHITECTURE.md` (System topology, Mermaid diagrams, frontend & backend architecture).
  - `docs/DATABASE.md` (16 relational tables, columns, constraints, foreign keys, seed procedures).
  - `docs/API_DOCUMENTATION.md` (REST endpoints, auth scopes, payloads, status codes).
  - `docs/FEATURES.md` (Feature matrix, user roles, implementation statuses).
  - `docs/DEVELOPMENT_GUIDE.md` (Step-by-step local Windows & cross-platform guide).
  - `docs/DEPLOYMENT.md` (Vercel, Render, Neon deployment guide).
  - `docs/SECURITY.md` (JWT auth, Bcrypt, RBAC, PII minimization, anti-hallucination policies).
  - `docs/ROADMAP.md` (Phase 1–4 product milestones).
  - `docs/TROUBLESHOOTING.md` (Runbook for Render cold starts, 404 SPA fallback, CORS).
  - `AGENTS.md` (AI Coding Agent guidelines and verification standards).
  - `CONTRIBUTING.md` (Open source contribution guidelines and coding standards).
  - `.env.example` (Safe environment variables template).

---

## [2.1.0] - 2026-11-03
### Added
- **Website Availability Control & Maintenance Mode:**
  - Admin Dashboard master switch to toggle public website availability ONLINE or OFFLINE.
  - Multilingual Maintenance Message Editor supporting Bengali (`bn`), English (`en`), and Hindi (`hi`).
  - Estimated reopening datetime picker with live countdown timer.
  - Branded Maintenance Page component (`MaintenancePage.jsx`) with support contact and discrete Admin portal link.
  - Top administrative notification banner for logged-in admins in Admin Bypass Mode.
  - Immutable status change audit history table in Admin Dashboard.
- **Backend 503 Guard:**
  - Added `@app.before_request` middleware returning **HTTP 503 Service Unavailable** with `Retry-After` header for all public endpoints during maintenance.
  - Whitelisted `/api/website-status`, `/api/health`, `/api/auth/*`, and `/api/admin/*`.
- **Database Model:**
  - Added `WebsiteSettings` singleton model with multilingual titles/messages, reopening datetime, support contact, and audit tracking.
- **Zero-Downtime Schemes Offline Fallback:**
  - Integrated `FALLBACK_SCHEMES` cache to seamlessly serve 7 verified state schemes during Render backend cold starts or temporary spin-ups.

### Changed
- Clarified pending backend deployment status messaging in Admin Website Control.
- Reinforced frontend error handling to prevent broken UI cards during host spin-ups.

---

## [2.0.0] - 2026-11-03
### Added
- **Government Schemes Module:**
  - New dedicated welfare schemes portal at `/schemes` and `/schemes/:slug`.
  - Comprehensive database models: `GovernmentScheme`, `SchemeCategory`, `SchemeDepartment`, `SchemeEligibilityRule`, `SchemeRequiredDocument`, `SchemeOfficialSource`, `SchemeVerificationHistory`.
  - Structured eligibility rules for age, gender, residence, caste, income, and educational enrollment.
  - 7 verified flagship West Bengal schemes seeded: *Kanyashree Prakalpa*, *Lakshmir Bhandar*, *Swasthya Sathi*, *Krishak Bandhu*, *Yuvasree*, *Jai Bangla Pension*, *Snehaloy Housing Scheme*.
  - Administrative scheme management tab with creation, editing, verification submission, publishing, and archiving workflows.
  - "AI Scheme Finder — Coming Soon" educational informational card and modal.
- **Multilingual Support:**
  - Header and drawer language switcher supporting বাংলা, English, and हिन्दी via `LanguageContext`.
- **Responsive Mobile Header:**
  - Redesigned mobile navigation bar with compact brand logo, accessible slide-down drawer, touch targets, and full escape/outside click closing.

### Fixed
- **Vercel SPA 404 Routing:** Configured `vercel.json` and `frontend/vercel.json` rewrites to guarantee direct URL access and browser refreshes on all nested routes.

---

## [1.5.0] - 2026-11-02
### Added
- Professional developer credit in footer: "Developed by Animesh Mishra — Frontend Developer & UI Engineer" with secure portfolio link.
- Self-healing demo user login assurance on backend startup (`ensure_demo_users`).

### Fixed
- PostgreSQL database URI normalization and psycopg2/psycopg3 fallback support.
- Citizen registration `full_name` payload compatibility.

---

## [1.0.0] - 2026-11-01
### Added
- Initial public release of **Seva Setu** platform.
- Public certificate directory: Income, Caste (SC/ST/OBC), Domicile/Residence, Birth, Death, Digital Ration Card.
- Bangla Sahayata Kendra (BSK) physical counter directory and operational hours.
- Interactive Client-Side Document Checklist with real-time percentage tracking and `localStorage` persistence.
- External Redirect Safe Warning Modal for official government portals.
- Citizen registration, authentication, and personal Saved Services dashboard.
- Field Observer queue condition submission interface.
- Administrative Dashboard with centre management, service management, and audit logs.
- Dual deployment architecture: React frontend on Vercel, Python Flask backend on Render, PostgreSQL on Neon.

