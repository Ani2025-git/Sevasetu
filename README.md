# Sevasetu (SevaQueue) — Smart Government Service Visit & Queue Information Platform

> **"Know Before You Visit."**  
> An independent civic innovation demonstration project for **Bangla Sahayata Kendras (BSK)** in West Bengal, India.

---

## ⚠️ Important Independent Pilot Disclaimer
**SevaQueue is an independent demonstration prototype.**  
It is **NOT** officially affiliated with, endorsed by, certified by, or operated by the Government of West Bengal or any Bangla Sahayata Kendra. All centre metrics, sample documents, and queue updates represent simulated pilot demonstration observations.

For official government services and applications, visit the official portal:  
👉 **[https://bsk.wb.gov.in](https://bsk.wb.gov.in)**

---

## 🌟 Key Features

### 1. Public Citizen Portal (No Registration Required)
- **Explore BSK Centres:** View centre addresses, official opening hours, and notified weekly holidays.
- **Service Document Checklists:** Verified document requirements (proof of ID, residence, photographs) for Income, Caste, Ration Card, Swasthya Sathi, and Scholarships.
- **Real-Time Queue Indicator:** Evidence-backed status badges (**Low**, **Moderate**, **High**, or **No Recent Update**).
- **Staleness Tracking:** Observations older than **30 minutes** are flagged as stale so citizens are never misled.
- **Privacy First (No PII):** No citizen accounts required; automated regex filters prevent submission of phone numbers or Aadhaar numbers.

### 2. Field Observer Portal (Secure JWT Auth)
- Log empirical queue observations (Low / Moderate / High / Unknown).
- Add approximate waiting ranges and non-personal field notes.
- Review own submission history and status (**Pending**, **Approved**, **Rejected**).
- Observers cannot publish directly to the public dashboard.

### 3. Administrator Operations Dashboard
- **Overview & Analytics:** Real-time statistics, Recharts observation distribution chart, recent broadcasts.
- **Centre Management:** Add, edit, or delete BSK service centres with confirmation dialogs.
- **Service Management:** Maintain service catalogs, document checklists, and official portal links.
- **Queue Publishing:** Broadcast queue updates with mandatory evidence source attribution and supporting observation counts.
- **Observation Review:** Approve or reject pending citizen and field observer submissions.
- **Audit Logs:** Immutable audit log tracking all administrative changes.
- **User Management:** Create observer accounts and toggle account status.
- **Configurable Settings:** Custom staleness time limits (e.g., 30 mins) and anonymous submission controls.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@sevaqueue.org` | `Admin@123` | Full dashboard operations, queue publishing, observation review, user & centre management |
| **Field Observer** | `observer@sevaqueue.org` | `Observer@123` | Submit observations, view personal log history |
| **Volunteer Observer**| `volunteer@sevaqueue.org`| `Volunteer@123` | Submit observations, view personal log history |
| **Public Citizen** | *(No login needed)* | *(None)* | Browse centres, read checklists, view queue status, submit anonymous observation |

*Tip: The `/login` page includes **One-Click Demo Fill buttons** for instant evaluation.*

---

## 🚀 Quick Start Instructions (Windows)

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

---

### Step 1: Initialize Database & Seed Sample Data
Open PowerShell or Command Prompt in the project root:

```powershell
cd "d:\Seva Queue\backend"

# If using the pre-configured virtual environment:
.\venv\Scripts\python.exe seed.py

# Or if using system python:
python seed.py
```
*(Or simply double-click `seed-database.bat`)*

---

### Step 2: Start the Backend API Server
```powershell
cd "d:\Seva Queue\backend"

# Run Flask server on port 5000:
.\venv\Scripts\python.exe run.py
```
*(Or double-click `start-backend.bat`)*  
The API server will run at: `http://127.0.0.1:5000`

---

### Step 3: Start the React Frontend Server
In a second terminal window:

```powershell
cd "d:\Seva Queue\frontend"

# Launch Vite development server on port 5173:
node node_modules/vite/bin/vite.js
```
*(Or double-click `start-frontend.bat`)*  
The web application will open at: `http://localhost:5173`

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/login` — Authenticate staff/observer and receive JWT bearer token.
- `POST /api/auth/logout` — Logout user session.
- `GET /api/auth/me` — Retrieve active user profile.

### Public Endpoints
- `GET /api/health` — API health check and pilot status.
- `GET /api/centres` — List active BSK service centres with current queue summaries.
- `GET /api/centres/:id` — Centre details, operating hours, and location data.
- `GET /api/centres/:id/services` — Filter services available at a specific centre.
- `GET /api/centres/:id/queue` — Current queue status, source description, and staleness flag.
- `GET /api/services` — Master catalog of services with required document checklists.
- `POST /api/public/observations` — Optional anonymous observation submission (reviewed before publish).
- `GET /api/public/disclaimer` — Pilot charter and legal disclaimer.

### Observer Endpoints
- `POST /api/observations` — Submit queue observation with notes (requires Observer/Admin token).
- `GET /api/observations/my` — List authenticated observer's submission history.

### Administrator Endpoints
- `GET /api/admin/dashboard` — Platform statistics, 7-day trend, and queue metrics.
- `POST /api/admin/centres` | `PUT /api/admin/centres/:id` | `DELETE /api/admin/centres/:id` — Centre CRUD.
- `POST /api/admin/services` | `PUT /api/admin/services/:id` | `DELETE /api/admin/services/:id` — Service CRUD.
- `GET /api/admin/observations` — View all submitted observations.
- `POST /api/admin/observations/:id/review` — Approve or reject an observation.
- `POST /api/admin/queue-updates` — Publish official queue status with evidence attribution.
- `GET /api/admin/history` — Historical queue broadcasts.
- `GET /api/admin/audit-logs` — Immutable audit logs.
- `GET /api/admin/users` | `POST /api/admin/users` | `PUT /api/admin/users/:id` — User accounts.
- `GET /api/admin/settings` | `PUT /api/admin/settings` — Stale threshold and policy settings.

---

## 🛡️ Security & Privacy Features
- **Password Hashing:** Passwords encrypted using Werkzeug secure password hashes.
- **JWT Authorization:** Bearer token authentication with role-based access validation.
- **SQL Injection Prevention:** Built entirely on SQLAlchemy ORM parameterized queries.
- **Cross-Site Scripting (XSS) Sanitization:** Input sanitizers clean all user-provided strings.
- **Anti-PII Detection:** Rejection of observations containing phone numbers or Aadhaar patterns.
- **Audit Logging:** System automatically logs all key modifications.

---

## 📂 Project Structure
```
d:\Seva Queue\
├── backend/
│   ├── app/
│   │   ├── middleware/        # JWT & Role authorization
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── routes/            # REST API endpoints (auth, public, observer, admin)
│   │   ├── services/          # Queue staleness logic & audit services
│   │   └── utils/             # Input & anti-PII validators
│   ├── config.py              # Application settings
│   ├── run.py                 # Backend runner
│   ├── seed.py                # Database seeder with sample data
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, QueueBadge, Modals
│   │   ├── context/           # AuthContext (JWT management)
│   │   ├── pages/             # Home, CentreDetails, Services, Queue, Dashboards
│   │   ├── services/          # Axios API client
│   │   ├── App.jsx            # React Router & protected routes
│   │   ├── main.jsx           # Entrypoint
│   │   └── index.css          # Tailwind CSS
│   ├── vite.config.js         # Vite configuration with API proxy
│   └── package.json           # Frontend dependencies
│
├── docs/
│   ├── disclaimer.md          # Independent project legal charter
│   ├── privacy-policy.md      # Zero-PII privacy guarantee
│   └── pilot-plan.md          # Architecture and queue model plan
│
├── seed-database.bat          # 1-click DB seeder
├── start-backend.bat          # 1-click Backend launcher
├── start-frontend.bat         # 1-click Frontend launcher
├── .env.example               # Environment variables template
├── .gitignore                 # Version control exclusions
└── README.md                  # Complete documentation
```

---

## 🧪 Testing Verification
All endpoints, authentication flows, queue calculations, and UI components have been tested.
To verify API health directly:
```powershell
curl http://127.0.0.1:5000/api/health
```
Expected response:
```json
{
  "application": "SevaQueue",
  "mode": "independent-pilot-demonstration",
  "status": "healthy",
  "tagline": "Know Before You Visit"
}
```

