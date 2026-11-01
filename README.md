# Seva Setu — Connecting Citizens with Government Services

> **"Government Services, Made Simpler."**  
> An independent digital citizen assistance platform and government service guide for **West Bengal, India**.

---

## ⚠️ Independent Citizen Assistance Platform Notice
**Seva Setu is an independent educational and citizen assistance platform.**  
It is **NOT** officially affiliated with, operated by, endorsed by, or partnered with the Government of West Bengal or any Bangla Sahayata Kendra (BSK). All application forms, certificates, and document verifications must be submitted directly through official government portals or at authorized BSK physical counters.

Official state portals:
- **Bangla Sahayata Kendra (BSK):** [https://bsk.wb.gov.in](https://bsk.wb.gov.in)
- **West Bengal e-District Portal:** [https://edistrict.wb.gov.in](https://edistrict.wb.gov.in)
- **Oasis Caste Certificate Portal:** [https://castcertificatewb.gov.in](https://castcertificatewb.gov.in)
- **Janma-Mrityu Tathya (Birth & Death):** [https://janmamrityutathya.wb.gov.in](https://janmamrityutathya.wb.gov.in)
- **Food & Supplies Department:** [https://food.wb.gov.in](https://food.wb.gov.in)

---

## 🌟 Key Platform Capabilities

### 1. Government Certificate Directory
- Comprehensive service profiles for primary West Bengal public certificates:
  * **Income Certificate** (Personnel & Administrative Reforms / e-District)
  * **Caste Certificate (SC / ST / OBC)** (Backward Classes Welfare Department)
  * **Residential / Domicile Certificate** (Home & Hill Affairs)
  * **Birth Certificate** (Department of Health & Family Welfare / Janma-Mrityu Tathya)
  * **Death Certificate** (Health & Family Welfare)
  * **Digital Ration Card (NFSA / RKSY)** (Department of Food & Supplies)
- Filter by department and certificate category with instant search.
- Verified details: Processing timelines, government fees (e.g. Free), and eligibility rules.

### 2. Interactive Document Checklist System
- Clear list of mandatory proofs required before applying.
- Interactive checkable checkboxes with dynamic progress tracking (0% to 100%).
- State saved to browser `localStorage` per service so preparation progress is never lost.
- One-click copy checklist and print options for offline preparation.

### 3. Safe Direct Application System
- Direct links to authentic Government of West Bengal web portals.
- **External Redirect Notice Modal:** Proactively warns citizens whenever they leave Seva Setu for an official portal, confirming domain authenticity and reminding citizens not to share passwords or pay intermediaries.

### 4. Offline Application & BSK Locator
- Comprehensive instructions for in-person applications at Bangla Sahayata Kendras (BSK) and Block Development Offices (BDO).
- Centre details, physical address, published operating hours (10:00 AM – 5:00 PM), and notified holiday schedules.

### 5. Transparent BSK Queue Feature — Coming Soon
- Explicitly marked as **"Coming Soon"** to maintain absolute public trust.
- Strict policy against fabricated, estimated, or simulated wait counters.
- Blueprint for on-ground observer verification before live publishing.
- District-wise notification subscription for citizens.

### 6. Citizen Account & Saved Services
- Simple, privacy-preserving registration (Full Name, Email, Password).
- No sensitive PII collected (no Aadhaar, PAN, phone OTP, or bank passbooks).
- Personal dashboard to bookmark services and review document preparation.

### 7. Governance & Administrative Dashboard
- Complete CRUD controls for service profiles and BSK centres.
- Review queue submissions from certified field observers.
- Immutable audit log and system settings.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Citizen** | `citizen@sevasetu.org` | `Citizen@123` | Save services, track checklists, access personal citizen dashboard |
| **Field Observer** | `observer@sevasetu.org` | `Observer@123` | Submit field queue observations for review |
| **Administrator** | `admin@sevasetu.org` | `Admin@123` | Service management, centre controls, queue broadcasts, audit logs |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Recharts
- **Backend:** Python 3.10+, Flask, Flask-SQLAlchemy, Flask-CORS, Flask-Migrate, Gunicorn
- **Database:** PostgreSQL (Production / Neon) with SQLite automatic local fallback
- **Security:** Bcrypt password hashing, JWT stateless token authentication, regex PII sanitizers

---

## 🚀 Deployment Guide

### A. Frontend Deployment (Vercel)
1. Push repository to GitHub: `https://github.com/Ani2025-git/Sevasetu.git`
2. Import project into [Vercel](https://vercel.com).
3. Set the following Build Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (or `./`)
   - **Build Command:** `node node_modules/vite/bin/vite.js build && node sync-dist.js`
   - **Output Directory:** `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-on-render.onrender.com`

### B. Backend Deployment (Render)
1. Create a **Web Service** on [Render](https://render.com) connected to the repository.
2. Settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT run:app`
3. Environment Variables:
   - `FLASK_ENV`: `production`
   - `DATABASE_URL`: `postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require`
   - `JWT_SECRET_KEY`: `<secure-random-key>`
   - `AUTO_SEED`: `true` (auto-populates verified West Bengal services and demo accounts on first boot)

---

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Ani2025-git/Sevasetu.git
cd Sevasetu
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
python run.py
```
Backend API will be running at `http://127.0.0.1:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend development server will open at `http://localhost:5173`.
