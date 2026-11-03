# Seva Setu — Platform Features & Implementation Matrix

> **Source Code Scope:** Verified against repository commit tree  
> **Status Classifications:**  
> * **`Implemented`**: Fully operational in production frontend and backend.  
> * **`Partially Implemented`**: Core functionality exists; auxiliary features under staged rollout.  
> * **`Planned`**: Documented on the roadmap; not yet present in active codebase.  
> * **`Deprecated`**: Superseded or scheduled for removal.

---

## Feature Matrix Summary

| Feature | Primary User Roles | Implementation Status | Frontend Component | Backend Blueprint |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | Public, Citizen | `Implemented` | `HomePage.jsx` | `public_bp` |
| **Services Directory** | Public, Citizen | `Implemented` | `ServicesPage.jsx` | `public_bp` |
| **Interactive Document Checklist** | Public, Citizen | `Implemented` | `ServiceDetailsPage.jsx` | `public_bp` |
| **Government Schemes Module** | Public, Citizen | `Implemented` | `SchemesPage.jsx` | `schemes_bp` |
| **AI Scheme Finder** | Public, Citizen | `Planned` | Tooltip / Coming Soon Card | *None (Pending)* |
| **BSK Centres Locator** | Public, Citizen | `Implemented` | `CentreDetailsPage.jsx` | `public_bp` |
| **Multilingual Switcher** | All Users | `Implemented` | `LanguageContext.jsx` | *Client-Side + DB Titles* |
| **External Redirect Modal** | All Users | `Implemented` | `ExternalRedirectModal.jsx` | *Client-Side Guard* |
| **Citizen Account & Bookmarks** | Registered Citizen | `Implemented` | `CitizenDashboard.jsx` | `auth_bp`, `public_bp` |
| **Field Observer Reporting** | Certified Observer | `Implemented` | `ObserverDashboard.jsx` | `observer_bp` |
| **Queue Broadcasts & Policy** | All Users | `Partially Implemented` | `QueueStatusPage.jsx` | `public_bp`, `admin_bp` |
| **Admin Operations Dashboard** | Administrator | `Implemented` | `AdminDashboard.jsx` | `admin_bp` |
| **Admin Scheme Management** | Administrator | `Implemented` | `AdminSchemeManager.jsx` | `admin_bp` |
| **Website Availability & Maintenance** | Public & Admin | `Implemented` | `AdminWebsiteControl.jsx` | `admin_bp`, `public_bp` |

---

## Detailed Feature Specifications

### 1. Homepage & Citizen Gateway
* **Status:** `Implemented`
* **Purpose:** Introduces the citizen assistance platform, highlights primary service categories (Income, Caste, Domicile, Ration), provides quick search, and outlines the pilot vision for West Bengal.
* **User Roles:** Public, Citizen, Observer, Administrator.
* **Frontend:** [`frontend/src/pages/HomePage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/HomePage.jsx)
* **Backend:** [`backend/app/routes/public.py`](file:///d:/Seva%20Queue/backend/app/routes/public.py)
* **API Endpoints:** `GET /api/services`, `GET /api/centres`, `GET /api/schemes`
* **Database Models:** `Service`, `Centre`, `GovernmentScheme`

---

### 2. Government Certificate & Services Directory
* **Status:** `Implemented`
* **Purpose:** Verified directory of West Bengal public certificates and citizen services with eligibility criteria, fee waivers, expected processing timelines, and links to official portals.
* **User Roles:** Public, Citizen.
* **Frontend:** [`frontend/src/pages/ServicesPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/ServicesPage.jsx), [`frontend/src/pages/ServiceDetailsPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/ServiceDetailsPage.jsx)
* **Backend:** [`backend/app/routes/public.py`](file:///d:/Seva%20Queue/backend/app/routes/public.py)
* **API Endpoints:** `GET /api/services`, `GET /api/services/<id>`
* **Database Models:** `Service`, `Centre`

---

### 3. Interactive Document Checklist System
* **Status:** `Implemented`
* **Purpose:** Helps citizens prepare required photocopies and original proofs before visiting a BSK counter. Checkboxes calculate completion percentage in real time and persist progress in `localStorage` per service/scheme.
* **User Roles:** Public, Citizen.
* **Frontend:** Integrated inside `ServiceDetailsPage.jsx` and `SchemeDetailsPage.jsx`.
* **Data Storage:** Client-side `localStorage` (`sevasetu_scheme_checklist_<slug>`).

---

### 4. Government Welfare Schemes Module
* **Status:** `Implemented`
* **Purpose:** Dedicated welfare portal exploring flagship state programs (*Kanyashree Prakalpa*, *Lakshmir Bhandar*, *Swasthya Sathi*, *Krishak Bandhu*, *Yuvasree*, *Jai Bangla Pension*, *Snehaloy Housing Scheme*). Features category filtering, departmental citations, eligibility rule breakdowns, document requirements, and zero-downtime offline fallback cache.
* **User Roles:** Public, Citizen.
* **Frontend:** [`frontend/src/pages/SchemesPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/SchemesPage.jsx), [`frontend/src/pages/SchemeDetailsPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/SchemeDetailsPage.jsx), [`frontend/src/data/fallbackSchemes.js`](file:///d:/Seva%20Queue/frontend/src/data/fallbackSchemes.js)
* **Backend:** [`backend/app/routes/schemes.py`](file:///d:/Seva%20Queue/backend/app/routes/schemes.py)
* **API Endpoints:** `GET /api/schemes`, `GET /api/schemes/categories`, `GET /api/schemes/departments`, `GET /api/schemes/<slug>`
* **Database Models:** `GovernmentScheme`, `SchemeCategory`, `SchemeDepartment`, `SchemeEligibilityRule`, `SchemeRequiredDocument`, `SchemeOfficialSource`, `SchemeVerificationHistory`

---

### 5. AI Scheme Finder
* **Status:** `Planned`
* **Purpose:** An intelligent questionnaire-driven recommendation engine to match a citizen's household income, age, gender, and district with eligible welfare schemes.
* **Current State:** An exploratory card with the button **"AI Scheme Finder – Coming Soon"** is present on `/schemes`. It does not pretend to give simulated recommendations and opens a helpful informational modal.
* **Backend / ML Engine:** Not yet implemented.

---

### 6. BSK Physical Counter Locator
* **Status:** `Implemented`
* **Purpose:** Directory of physical Bangla Sahayata Kendras across West Bengal districts with counter addresses, operational schedules (10:00 AM – 5:00 PM), and contact details.
* **User Roles:** Public, Citizen.
* **Frontend:** [`frontend/src/pages/CentreDetailsPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/CentreDetailsPage.jsx)
* **Backend:** [`backend/app/routes/public.py`](file:///d:/Seva%20Queue/backend/app/routes/public.py)
* **API Endpoints:** `GET /api/centres`, `GET /api/centres/<id>`, `GET /api/centres/<id>/services`
* **Database Models:** `Centre`, `Service`

---

### 7. Trilingual Localization (বাংলা, English, हिन्दी)
* **Status:** `Implemented`
* **Purpose:** Enables instant switching between English, Bengali (বাংলা), and Hindi (हिन्दी) across the header, navigation drawer, maintenance announcements, and footers.
* **Frontend:** [`frontend/src/context/LanguageContext.jsx`](file:///d:/Seva%20Queue/frontend/src/context/LanguageContext.jsx)

---

### 8. External Safe Redirect System
* **Status:** `Implemented`
* **Purpose:** Security guard that interrupts any click leading away from Seva Setu to an authentic government portal (e.g. `edistrict.wb.gov.in`, `wbkanyashree.gov.in`). Confirms official domain authenticity, warns against paying touts, and reminds citizens that BSK services are free.
* **Frontend:** [`frontend/src/components/ExternalRedirectModal.jsx`](file:///d:/Seva%20Queue/frontend/src/components/ExternalRedirectModal.jsx)

---

### 9. Citizen Dashboard & Bookmarked Services
* **Status:** `Implemented`
* **Purpose:** Privacy-preserving user space allowing registered citizens to bookmark critical public services, review document readiness, and monitor service updates.
* **User Roles:** Citizen (`role='citizen'`).
* **Frontend:** [`frontend/src/pages/CitizenDashboard.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/CitizenDashboard.jsx)
* **Backend:** [`backend/app/routes/public.py`](file:///d:/Seva%20Queue/backend/app/routes/public.py)
* **API Endpoints:** `GET /api/saved-services`, `POST /api/saved-services`, `DELETE /api/saved-services/<id>`
* **Database Models:** `SavedService`, `Service`, `User`

---

### 10. Certified Field Observer Queue Reporting
* **Status:** `Implemented`
* **Purpose:** Allows accredited field observers to submit structured crowd reports (active counter count, electronic token functionality, crowd description, estimated wait time) for administrative verification.
* **User Roles:** Field Observer (`role='observer'`).
* **Frontend:** [`frontend/src/pages/ObserverDashboard.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/ObserverDashboard.jsx)
* **Backend:** [`backend/app/routes/observer.py`](file:///d:/Seva%20Queue/backend/app/routes/observer.py)
* **API Endpoints:** `POST /api/observations`, `GET /api/observations/my`
* **Database Models:** `Observation`, `Centre`, `User`

---

### 11. Public Queue Broadcasting Policy
* **Status:** `Partially Implemented`
* **Current State:** The public `/queue` route is explicitly badged as **"Pilot Queue Intelligence — Ground Observer Verification Underway"**. Strict anti-hallucination policies prevent publishing artificial queue numbers unless verified by administrators.
* **Frontend:** [`frontend/src/pages/QueueStatusPage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/QueueStatusPage.jsx), [`frontend/src/components/QueueComingSoonModal.jsx`](file:///d:/Seva%20Queue/frontend/src/components/QueueComingSoonModal.jsx)

---

### 12. Administrative Operations & Scheme Governance
* **Status:** `Implemented`
* **Purpose:** Central command center for authorized state administrators:
  - Overview analytics (service counts, queue trends).
  - Centre and service CRUD management.
  - Review and moderation of observer reports.
  - Scheme lifecycle management (Draft $\rightarrow$ Under Review $\rightarrow$ Published $\rightarrow$ Archived).
  - Comprehensive immutable audit trail.
* **User Roles:** Administrator (`role='admin'`).
* **Frontend:** [`frontend/src/pages/AdminDashboard.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/AdminDashboard.jsx), [`frontend/src/components/AdminSchemeManager.jsx`](file:///d:/Seva%20Queue/frontend/src/components/AdminSchemeManager.jsx)
* **Backend:** [`backend/app/routes/admin.py`](file:///d:/Seva%20Queue/backend/app/routes/admin.py)
* **Database Models:** `AuditLog`, `User`, `Centre`, `Service`, `GovernmentScheme`

---

### 13. Website Availability Control & Maintenance Mode
* **Status:** `Implemented`
* **Purpose:** Administrative master switch to turn the public website ONLINE or OFFLINE:
  - When OFF: Serves a branded multilingual Maintenance Page to all public traffic with estimated reopening countdown, support email, and HTTP 503 response code for public APIs.
  - Authenticated administrators bypass maintenance with a top notification banner and retain full access to `/admin`.
  - Multilingual announcement editor (Bengali, English, Hindi) and live citizen preview modal.
  - Mandatory change notes logged in the audit history.
* **User Roles:** Public (restricted during maintenance), Administrator (controls & bypass).
* **Frontend:** [`frontend/src/components/AdminWebsiteControl.jsx`](file:///d:/Seva%20Queue/frontend/src/components/AdminWebsiteControl.jsx), [`frontend/src/pages/MaintenancePage.jsx`](file:///d:/Seva%20Queue/frontend/src/pages/MaintenancePage.jsx), [`frontend/src/context/WebsiteStatusContext.jsx`](file:///d:/Seva%20Queue/frontend/src/context/WebsiteStatusContext.jsx)
* **Backend:** [`backend/app/routes/admin.py`](file:///d:/Seva%20Queue/backend/app/routes/admin.py), [`backend/app/__init__.py`](file:///d:/Seva%20Queue/backend/app/__init__.py)
* **API Endpoints:** `GET /api/website-status`, `GET /api/admin/website-settings`, `PUT /api/admin/website-settings`
* **Database Models:** `WebsiteSettings`, `AuditLog`

