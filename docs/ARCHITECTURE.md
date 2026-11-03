# Seva Setu — System Architecture & Design Specification

> **Platform:** Seva Setu (Citizen Information & Public Service Guide for West Bengal)  
> **Status:** Live & Active  
> **Target Audience:** Developers, System Architects, DevOps, AI Coding Agents

---

## 1. Architectural Overview

Seva Setu is architected as a decoupled, cloud-native **Single Page Application (SPA)** with a Python **RESTful API** backend and a serverless **PostgreSQL** relational database.

```mermaid
flowchart TD
    subgraph Clients["Citizen & Administrative Clients"]
        BrowserMobile["Mobile Browser (320px–430px)"]
        BrowserDesktop["Desktop Browser (1024px–1440px)"]
    end

    subgraph FrontendHosting["Frontend — Vercel Platform"]
        VercelCDN["Vercel Edge Network / CDN"]
        ReactApp["React 18 + Vite SPA<br/>(Tailwind CSS + React Router v6)"]
        VercelRewrite["vercel.json SPA Rewrites & Proxy"]
    end

    subgraph BackendHosting["Backend — Render Web Service"]
        GunicornWSGI["Gunicorn WSGI Server (1 worker, 4 threads)"]
        FlaskCore["Flask Core Application Factory<br/>(create_app)"]
        
        subgraph Middlewares["Security & Routing Middlewares"]
            MaintCheck["Maintenance Mode 503 Guard"]
            CORSMiddleware["Flask-CORS Security"]
            AuthMiddleware["JWT RBAC Middleware"]
        end

        subgraph Blueprints["Modular Route Blueprints"]
            PublicBP["public_bp (/api)"]
            AuthBP["auth_bp (/api/auth)"]
            SchemesBP["schemes_bp (/api/schemes)"]
            ObserverBP["observer_bp (/api/observations)"]
            AdminBP["admin_bp (/api/admin)"]
        end
    end

    subgraph DatabaseLayer["Data Persistence — Neon PostgreSQL"]
        NeonDB[("Neon Cloud PostgreSQL 16<br/>(Connection Pooling + SSL)")]
        LocalSQLite[("Local SQLite Fallback<br/>(sevaqueue.db)")]
    end

    BrowserMobile --> VercelCDN
    BrowserDesktop --> VercelCDN
    VercelCDN --> ReactApp
    ReactApp --> VercelRewrite
    VercelRewrite -->|HTTPS REST API| GunicornWSGI
    GunicornWSGI --> FlaskCore
    FlaskCore --> Middlewares
    Middlewares --> Blueprints
    Blueprints -->|SQLAlchemy ORM| NeonDB
    FlaskCore -.->|Local Dev Fallback| LocalSQLite
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack
* **Framework:** React 18
* **Build System:** Vite 5 with Rollup chunking
* **Styling:** Tailwind CSS with custom government color tokens (`#173B72` Navy, `#2878C8` Digital Blue, `#F39A32` Saffron)
* **Routing:** React Router DOM v6 with declarative protected route guards
* **Icons:** Lucide React
* **Data Visualization:** Recharts (Admin analytics charts)
* **HTTP Client:** Axios with dynamic base URL and global interceptors

### 2.2 Component Hierarchy & State Flow

```mermaid
graph TD
    App["App.jsx (Root Component)"]
    AuthProvider["AuthProvider (JWT & User Session)"]
    WebsiteStatusProvider["WebsiteStatusProvider (Maintenance Guard)"]
    LanguageProvider["LanguageProvider (বাংলা, English, हिन्दी)"]
    Router["BrowserRouter"]
    MainLayout["MainLayout"]

    App --> AuthProvider
    AuthProvider --> WebsiteStatusProvider
    WebsiteStatusProvider --> LanguageProvider
    LanguageProvider --> Router
    Router --> MainLayout

    MainLayout --> Navbar["Navbar (Responsive Drawer + Language Switcher)"]
    MainLayout --> MaintenanceBanner["Admin Bypass Banner (Conditional)"]
    MainLayout --> RouteViews["Page View Routes"]
    MainLayout --> Footer["Footer (Developer Credit & Disclaimer)"]
    MainLayout --> ObsModal["ObservationModal (Global)"]

    RouteViews --> Home["HomePage"]
    RouteViews --> Services["ServicesPage & ServiceDetailsPage"]
    RouteViews --> Schemes["SchemesPage & SchemeDetailsPage"]
    RouteViews --> Centres["CentreDetailsPage"]
    RouteViews --> Queue["QueueStatusPage"]
    RouteViews --> Dashboards["CitizenDashboard / ObserverDashboard / AdminDashboard"]
    RouteViews --> MaintPage["MaintenancePage (When Site Offline)"]
```

### 2.3 Context Providers
1. **`AuthContext` (`frontend/src/context/AuthContext.jsx`)**:
   - Manages user authentication state, token storage (`localStorage.getItem('sevasetu_token')`), user profile, and role helpers (`isAdmin`, `isObserver`, `isCitizen`).
2. **`WebsiteStatusContext` (`frontend/src/context/WebsiteStatusContext.jsx`)**:
   - Polls `GET /api/website-status` and listens to global Axios 503 response codes.
   - Provides `isMaintenanceMode`, multilingual announcement text, estimated reopening countdown data, and dynamic refresh controls.
3. **`LanguageContext` (`frontend/src/context/LanguageContext.jsx`)**:
   - Manages 3 supported languages: Bengali (`bn`), English (`en`), and Hindi (`hi`).
   - Persists user language preference in `localStorage.getItem('sevasetu_lang')` and dispatches browser custom events.

---

## 3. Backend Architecture

### 3.1 Application Factory Pattern
The Flask backend is structured using the **Application Factory pattern** in `backend/app/__init__.py`:

```python
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    CORS(app, origins=app.config.get('CORS_ORIGINS'), supports_credentials=True)
    ...
```

This architecture allows:
- Clean test isolation.
- Uniform execution across local development, Gunicorn WSGI on Render (`app.py`), and serverless environments (`api/index.py`).
- Centralized middleware and blueprint registration.

### 3.2 Security & Interception Middleware

```mermaid
sequenceDiagram
    autonumber
    actor Client as Citizen / Admin Browser
    participant Flask as Flask @app.before_request
    participant Auth as JWT Auth Validator
    participant Route as Blueprint Route Handler
    participant DB as Neon PostgreSQL

    Client->>Flask: HTTP Request (e.g. GET /api/schemes)
    alt Method == OPTIONS (CORS Preflight)
        Flask-->>Client: 200 OK (CORS Headers)
    else Path is Whitelisted (/api/website-status, /api/health, /api/auth/*)
        Flask->>Route: Process Request Directly
        Route-->>Client: 200 OK Response
    else Maintenance Mode is ACTIVE (is_maintenance_mode == True)
        alt Path starts with /api/admin
            Flask->>Auth: Validate JWT Admin Token
            alt User is Admin
                Auth->>Route: Allow Admin Bypass
                Route-->>Client: 200 OK (Admin Dashboard / Controls)
            else Invalid / Non-Admin Token
                Auth-->>Client: 401 Unauthorized / 403 Forbidden
            end
        else Public Request (/api/schemes, /api/services, /api/centres)
            Flask-->>Client: 503 Service Unavailable + Retry-After Header
        end
    else Maintenance Mode is INACTIVE (Normal Operations)
        Flask->>Route: Forward Request to Target Blueprint
        Route->>DB: Query / Mutate Data
        DB-->>Route: Result Set
        Route-->>Client: 200 OK JSON Response
    end
```

---

## 4. Database Architecture

### 4.1 Connection & Pooling Configuration
Defined in `backend/config.py`:
- **SSL Mode:** Mandatory in cloud environments (`sslmode=require`).
- **Driver Agnostic:** Dynamically selects `psycopg` (v3) or `psycopg2-binary` (v2) based on the runtime environment.
- **Connection Health:** `pool_pre_ping=True` ensures stale or severed pooled connections are refreshed before queries execute.
- **Local Fallback:** If `DATABASE_URL` is omitted or contains template placeholders, the app gracefully spins up a local SQLite database (`sevaqueue.db`).

### 4.2 Entity Relationship Map

```mermaid
erDiagram
    users ||--o{ saved_services : bookmarks
    users ||--o{ observations : submits
    users ||--o{ queue_updates : publishes
    users ||--o{ audit_logs : triggers
    users ||--o{ government_schemes : authors
    users ||--o{ scheme_verification_history : verifies
    users ||--o{ website_settings : modifies

    centres ||--o{ services : hosts
    centres ||--o{ observations : receives
    centres ||--o{ queue_updates : broadcasts

    services ||--o{ saved_services : bookmarked_by

    scheme_categories ||--o{ government_schemes : categorizes
    scheme_departments ||--o{ government_schemes : operates
    government_schemes ||--o{ scheme_eligibility_rules : enforces
    government_schemes ||--o{ scheme_required_documents : requires
    government_schemes ||--o{ scheme_official_sources : cites
    government_schemes ||--o{ scheme_verification_history : audits

    users {
        int id PK
        string name
        string email UK
        string password_hash
        string role "citizen | observer | admin"
        datetime created_at
    }

    centres {
        int id PK
        string name
        string district
        string address
        string operating_hours
        boolean is_active
    }

    services {
        int id PK
        string name
        string department
        string category
        json required_documents
        boolean is_active
        string verification_status
    }

    government_schemes {
        int id PK
        string name
        string slug UK
        string beneficiary_summary
        string verification_status "VERIFIED | UNDER_REVIEW"
        string status "DRAFT | PUBLISHED | ARCHIVED"
        string official_application_url
    }

    website_settings {
        int id PK
        boolean is_maintenance_mode
        string maintenance_title_en
        string maintenance_title_bn
        string maintenance_title_hi
        text maintenance_message_en
        datetime estimated_reopening_at
        string support_contact_email
    }
```

---

## 5. Deployment Architecture

| Dimension | Frontend | Backend | Database |
| :--- | :--- | :--- | :--- |
| **Hosting Platform** | **Vercel** | **Render** | **Neon** |
| **Service Type** | Static Edge Network / CDN | Linux Web Service | Serverless PostgreSQL 16 |
| **Runtime** | Node.js (Build-time only) | Python 3.11.9 | PostgreSQL Engine |
| **Entry Point** | `dist/index.html` | `app.py` / `gunicorn app:app` | Connection Pooler Port 5432 |
| **Routing / Rewrites** | `vercel.json` SPA Fallback + `/api/(.*)` Proxy | Flask URL Map | Neon Database Cluster |
| **Scaling** | Global Anycast Edge | Free Tier (Auto-sleeps on idle) | Serverless Compute Autoscaling |
| **Domain** | `sevasetu-flax-kappa.vercel.app` | `sevasetu-mb4e.onrender.com` | `ep-patient-field-b3u4vghe-pooler...` |

---

## 6. Offline Resilience Strategy

To guarantee that citizens never experience a broken UI due to cloud host spin-ups or network interruptions:
1. **Fallback Scheme Directory (`frontend/src/data/fallbackSchemes.js`)**:
   - The frontend packages 7 verified West Bengal government schemes (*Kanyashree Prakalpa*, *Lakshmir Bhandar*, *Swasthya Sathi*, *Krishak Bandhu*, *Yuvasree*, *Jai Bangla Pension*, *Snehaloy Housing Scheme*).
   - If the Render backend is cold-starting, undergoing maintenance, or unreachable, the frontend dynamically loads the verified offline cache.
2. **Local Checklist Persistence**:
   - Citizen document preparation checkboxes are tracked in the browser's `localStorage` per scheme slug (`sevasetu_scheme_checklist_<slug>`), ensuring no data loss when navigating or refreshing.
3. **Graceful Status Interception**:
   - When maintenance mode is switched ON by an administrator, the backend returns HTTP 503 while the frontend renders `<MaintenancePage />` with Bengali, English, and Hindi text, live countdowns, and a discrete portal for administrators to log in and restore public access.

