# Seva Setu — Connecting Citizens with Government Services

> **"Your Government Services, Made Simple."**  
> An independent, citizen-centric public assistance and government welfare guide platform for **West Bengal, India**.

[![Live Website](https://img.shields.io/badge/Live_Website-sevasetu--flax--kappa.vercel.app-2878C8?style=for-the-badge&logo=vercel)](https://sevasetu-flax-kappa.vercel.app/)
[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://sevasetu-flax-kappa.vercel.app/)
[![Backend Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://sevasetu-mb4e.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

---

## ⚠️ Independent Citizen Assistance Platform Disclaimer

**Seva Setu is an independent educational and civic assistance platform.**  
It is **NOT** officially affiliated with, operated by, sponsored by, or an agency of the Government of West Bengal or the Bangla Sahayata Kendra (BSK) project.

All application forms, official certificates, and document verifications must be submitted directly through authentic government portals or in person at designated BSK physical facilitation counters.
* **Bangla Sahayata Kendra (BSK):** [https://bsk.wb.gov.in](https://bsk.wb.gov.in)
* **West Bengal e-District 2.0:** [https://edistrict.wb.gov.in](https://edistrict.wb.gov.in)
* **Oasis Caste Certificate Portal:** [https://castcertificatewb.gov.in](https://castcertificatewb.gov.in)
* **Janma-Mrityu Tathya (Birth/Death):** [https://janmamrityutathya.wb.gov.in](https://janmamrityutathya.wb.gov.in)
* **Department of Food & Supplies:** [https://food.wb.gov.in](https://food.wb.gov.in)

---

## 📖 Table of Contents

- [Problem Statement & Purpose](#-problem-statement--purpose)
- [Key Platform Features](#-key-platform-features)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Repository Structure](#-repository-structure)
- [Database Schema & Models](#-database-schema--models)
- [Local Development Setup](#-local-development-setup)
- [Demo Credentials](#-demo-credentials)
- [Deployment Configuration](#-deployment-configuration)
- [Documentation Index](#-documentation-index)
- [Product Roadmap](#-product-roadmap)
- [Developer Credit](#-developer-credit)

---

## 🎯 Problem Statement & Purpose

Navigating government welfare schemes and public certificates in India often presents significant friction for citizens due to:
1. **Scattered Information:** Eligibility criteria, mandatory document lists, and authentic URLs are dispersed across dozens of disparate department websites.
2. **Document Readiness Anxiety:** Citizens arrive at Block Development Offices (BDO) or BSK counters missing crucial photocopies or declarations, requiring multiple round trips.
3. **Predatory Touts & Fake Portals:** Vulnerable citizens fall prey to middlemen who charge fees for services that are legally free of cost at government counters.
4. **Physical Counter Crowding:** Absence of crowd transparency leads to unpredictable wait times at physical facilitation desks.

### The Seva Setu Solution
Seva Setu simplifies access by offering:
* A unified, verified directory of **government certificate services** and **flagship welfare schemes**.
* **Interactive Client-Side Document Checklists** with real-time completion tracking.
* **External Safe Redirect Modals** verifying authentic `.gov.in` destinations and emphasizing free services.
* **Trilingual Accessibility** in Bengali (বাংলা), English, and Hindi (हिन्दी).
* **Website Availability Control & Maintenance Mode** for seamless system governance.

---

## 🌟 Key Platform Features

| Module | Citizen Benefit | Key Capabilities |
| :--- | :--- | :--- |
| **Government Schemes** | Discover welfare entitlements | Flagship schemes (*Kanyashree*, *Lakshmir Bhandar*, *Swasthya Sathi*, *Krishak Bandhu*, etc.), categorized search, eligibility rules engine, and verified offline cache. |
| **Services Directory** | Understand certificate processes | Detailed guidelines for Income, Caste, Domicile, Birth, Death, and Digital Ration Card services with fee policies and processing durations. |
| **Interactive Checklists** | Eliminate missing document trips | Interactive checkboxes calculating document readiness (0%–100%) stored safely in browser `localStorage`. |
| **Physical BSK Locator** | Find local service counters | Physical counter addresses, designated operating hours (10:00 AM – 5:00 PM), and notified holiday schedules. |
| **Safe Redirect Guard** | Protect against fraudulent touts | Warns citizens whenever an external link transitions to official state portals (`*.gov.in`), confirming zero government fees. |
| **Citizen Dashboard** | Track personal preparation | Secure personal account to bookmark services and monitor readiness without collecting sensitive PII. |
| **Observer Queue Reports** | Crowdsource counter conditions | Certified field observers submit structured crowd and token machine reports for administrative moderation. |
| **Admin Operations** | Full platform governance | Comprehensive management of services, centres, scheme lifecycle workflows, and immutable audit logs. |
| **Website Control** | Graceful maintenance handling | Master ON/OFF toggle, HTTP 503 guard with `Retry-After`, multilingual announcements, and live preview modal. |

---

## 🛠️ Technology Stack

```
Frontend:   React 18  │  Vite 5  │  Tailwind CSS  │  React Router v6  │  Lucide React  │  Recharts
Backend:    Python 3.11  │  Flask 3.0  │  Flask-SQLAlchemy 3.1  │  Gunicorn 22.0  │  PyJWT
Database:   PostgreSQL 16 (Neon Serverless + SSL)  │  SQLite Local Fallback
Hosting:    Vercel (Frontend Edge CDN)  │  Render (Backend Web Service)
```

---

## 🏗️ Architecture Overview

Seva Setu utilizes a decoupled Single Page Application (SPA) architecture communicating with a RESTful Flask backend:

```
[Citizen Browser (Mobile / Desktop)]
                │
                ▼
      [Vercel Edge Network] ── (React SPA Static Assets & Route Fallbacks)
                │
                ▼ (/api/* Proxy)
      [Render Web Service] ─── (Gunicorn WSGI + Flask Application Factory)
                │
                ├── [Maintenance 503 Guard] (Inspects WebsiteSettings)
                ├── [JWT RBAC Middleware]   (@admin_required, @observer_required)
                └── [Route Blueprints]      (public, auth, schemes, observer, admin)
                            │
                            ▼ (SSL Connection Pooler)
                [Neon Serverless PostgreSQL 16]
```

*For comprehensive architecture specifications and data-flow diagrams, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).*

---

## 📁 Repository Structure

```
Seva Queue/
├── api/
│   └── index.py                     # Serverless WSGI entry point
├── backend/
│   ├── app/
│   │   ├── middleware/              # JWT auth and RBAC decorators
│   │   ├── models/                  # 16 SQLAlchemy relational models
│   │   ├── routes/                  # Modular Blueprints (auth, public, schemes, admin, observer)
│   │   ├── services/                # Queue estimation & audit logging services
│   │   └── utils/                   # PII filters and text sanitizers
│   ├── app.py / run.py / wsgi.py    # Production and WSGI entry points
│   ├── config.py                    # Environment & database configuration
│   ├── requirements.txt             # Python backend dependencies
│   └── seed.py                      # Database schema and initial data seeder
├── docs/                            # Complete technical documentation system
│   ├── ARCHITECTURE.md              # System design and Mermaid diagrams
│   ├── DATABASE.md                  # Detailed schema, tables, and relationships
│   ├── API_DOCUMENTATION.md         # REST API endpoints, payloads, and codes
│   ├── FEATURES.md                  # Comprehensive feature implementation matrix
│   ├── DEVELOPMENT_GUIDE.md         # Windows & local development instructions
│   ├── DEPLOYMENT.md                # Vercel, Render, and Neon production guide
│   ├── SECURITY.md                  # JWT, Bcrypt, RBAC, and PII protection policies
│   ├── ROADMAP.md                   # Product milestones (Phase 1 to 4)
│   └── TROUBLESHOOTING.md           # Operational runbook and error resolutions
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI widgets, modals, navbar, footer
│   │   ├── context/                 # AuthContext, LanguageContext, WebsiteStatusContext
│   │   ├── data/                    # Verified offline fallback schemes cache
│   │   ├── pages/                   # Route views (Home, Schemes, Services, Dashboards)
│   │   └── services/                # Axios API client and request interceptors
│   ├── package.json                 # Node.js dependencies
│   ├── vite.config.js               # Vite build and proxy configuration
│   └── sync-dist.js                 # Production dist synchronization script
├── AGENTS.md                        # AI coding agent directives & standards
├── CHANGELOG.md                     # Semantic version history
├── CONTRIBUTING.md                  # Contributor guide and coding standards
├── render.yaml                      # Render Infrastructure-as-Code blueprint
├── vercel.json                      # Vercel SPA rewrites and API proxy configuration
└── .env.example                     # Environment variables template
```

---

## 🗄️ Database Schema & Models

The database contains **16 interconnected relational tables**:
* **Identity:** `users`
* **Services & Facilities:** `centres`, `services`, `saved_services`
* **Queue Intelligence:** `observations`, `queue_updates`
* **Welfare Schemes:** `government_schemes`, `scheme_categories`, `scheme_departments`, `scheme_eligibility_rules`, `scheme_required_documents`, `scheme_official_sources`, `scheme_verification_history`
* **Governance:** `website_settings`, `audit_logs`, `settings`

*For column types, constraints, and entity-relationship diagrams, see [`docs/DATABASE.md`](./docs/DATABASE.md).*

---

## 💻 Local Development Setup

### 1. Clone & Setup Backend
```powershell
# Clone repository
git clone https://github.com/Ani2025-git/internship.git Sevasetu
cd Sevasetu/backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate       # Windows PowerShell
# source venv/bin/activate    # Linux / macOS

# Install dependencies & seed database
pip install -r requirements.txt
python seed.py

# Start Flask API server
python run.py
```
*Backend runs at:* `http://127.0.0.1:5000`

### 2. Setup Frontend
```powershell
# In a second terminal window:
cd Sevasetu/frontend
npm install
npm run dev
```
*Frontend application opens at:* `http://localhost:5173`

*For detailed Windows troubleshooting, see [`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md).*

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@sevasetu.org` | `Citizen@123` | Bookmark services, track document readiness checklists |
| **Field Observer** | `observer@sevasetu.org` | `Observer@123` | Submit physical queue crowd assessments |
| **Administrator** | `admin@sevasetu.org` | `Admin@123` | Full dashboard, scheme workflows, website availability master switch |

---

## 🚀 Deployment Configuration

* **Frontend:** Hosted on **Vercel** (`https://sevasetu-flax-kappa.vercel.app/`). Uses `vercel.json` for SPA fallback routing.
* **Backend:** Hosted on **Render** (`https://sevasetu-mb4e.onrender.com/`). Managed via `render.yaml` with Gunicorn WSGI.
* **Database:** Hosted on **Neon Serverless PostgreSQL** with pooled connections and SSL.

*For complete deployment instructions, see [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).*

---

## 📚 Documentation Index

| Document | Primary Contents |
| :--- | :--- |
| **[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)** | System design, component hierarchy, sequence diagrams, offline resilience |
| **[`docs/DATABASE.md`](./docs/DATABASE.md)** | 16 tables, field types, constraints, foreign keys, and ER diagrams |
| **[`docs/API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)** | Comprehensive RESTful API catalog with request/response payloads |
| **[`docs/FEATURES.md`](./docs/FEATURES.md)** | Feature matrix, user roles, file locations, implementation statuses |
| **[`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md)** | Beginner-friendly local development setup for Windows, macOS, and Linux |
| **[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)** | Step-by-step production deployment for Vercel, Render, and Neon |
| **[`docs/SECURITY.md`](./docs/SECURITY.md)** | Stateless JWT tokens, Bcrypt, RBAC, PII minimization, anti-hallucination |
| **[`docs/ROADMAP.md`](./docs/ROADMAP.md)** | Development roadmap: Completed, In Progress, Planned, and Future Ideas |
| **[`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md)** | Runbook for cold starts, 404 SPA fallback, CORS, and database errors |
| **[`AGENTS.md`](./AGENTS.md)** | AI coding agent architecture directives, coding rules, and verification standards |
| **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** | Open-source contribution guidelines, coding standards, and PR workflows |
| **[`CHANGELOG.md`](./CHANGELOG.md)** | Semantic version history of releases and functional additions |

---

## 🗺️ Product Roadmap

* **Phase 1 (Completed):** Certificate directory, physical BSK locator, interactive document checklist, citizen bookmarks.
* **Phase 2 (Completed):** Government Schemes module (7 flagship programs), trilingual localization, mobile header redesign, website availability control & 503 guard.
* **Phase 3 (In Progress):** District-wide expansion across all 23 districts of West Bengal, observer field submission PWA.
* **Phase 4 (Planned):** Guided AI Scheme Eligibility Finder (recommendation questionnaire based on household criteria).

*See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for full details.*

---

## 👨‍💻 Developer Credit

**Developed by Animesh Mishra**  
Frontend Developer & UI Engineer  

* **Portfolio:** [https://ani2025-git.github.io/my-portfolio/](https://ani2025-git.github.io/my-portfolio/)
* **Live Website:** [https://sevasetu-flax-kappa.vercel.app/](https://sevasetu-flax-kappa.vercel.app/)
* **Repository:** [https://github.com/Ani2025-git/internship](https://github.com/Ani2025-git/internship)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
