# Seva Setu — Security Architecture & Compliance Policy

> **Platform:** Seva Setu  
> **Security Baseline:** OWASP Top 10, Citizen Privacy & Data Minimization  
> **Target Audience:** Security Auditors, Developers, DevOps, AI Coding Agents

---

## 1. Authentication & Token Management

### 1.1 Stateless JWT Implementation
* **Algorithm:** HMAC-SHA256 (`HS256`).
* **Payload:** Subject (`sub`: user ID), Role (`role`: `citizen`, `observer`, or `admin`), Issuance (`iat`), Expiration (`exp`).
* **Expiration Window:** Defaults to 24 hours (`JWT_EXPIRATION_HOURS = 24`).
* **Token Transport:** Transmitted via HTTP `Authorization` header (`Bearer <token>`).
* **Storage Policy:** Stored in browser `localStorage`. Response interceptors in `frontend/src/services/api.js` detect `401 Unauthorized` responses and cleanly flush tokens upon session expiration.

### 1.2 Password Hashing
* **Algorithm:** Bcrypt with dynamic salting via `werkzeug.security.generate_password_hash` / `check_password_hash`.
* Plaintext passwords are never logged, persisted, or returned in API responses.

---

## 2. Role-Based Access Control (RBAC)

Seva Setu implements strict least-privilege role boundaries enforced at the controller layer via Python decorators in `backend/app/middleware/auth.py`:

```
┌────────────────────────────────────────────────────────┐
│                   Administrator (admin)                │
│  - Website Availability Control (Turn ON/OFF, 503)     │
│  - Publish Welfare Schemes & Verify Categories         │
│  - Centre & Service CRUD                               │
│  - Moderate Observations & Broadcast Queue Statuses    │
│  - Audit Logs & Security Review                        │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 Field Observer (observer)              │
│  - Submit On-Ground Physical Queue Observations        │
│  - View Personal Report History                        │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                   Citizen (citizen)                    │
│  - Save Bookmarked Services to Personal Dashboard      │
│  - Track Document Readiness Checklists                 │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                  Public Visitor (Guest)                │
│  - Explore Welfare Schemes & Eligibility Rules         │
│  - View Certificate Directory & BSK Locations          │
│  - Submit Anonymous Queue Observations                 │
└────────────────────────────────────────────────────────┘
```

### RBAC Decorators
1. **`@jwt_required`**: Requires any valid authenticated user token.
2. **`@observer_required`**: Restricted to users with `role in ('observer', 'admin')`.
3. **`@admin_required`**: Restricted strictly to users with `role == 'admin'`.

---

## 3. Citizen Privacy & Data Minimization

To eliminate risks of sensitive citizen identity theft:

* **Zero Sensitive PII Collection:**
  - Seva Setu **NEVER** asks for, accepts, or stores **Aadhaar Numbers, PAN Numbers, Biometric Scans, Bank Passwords, or SMS OTPs**.
  - Account creation only asks for a name, email address, and password.
* **Document Checklists are 100% Client-Side:**
  - Checkboxes verifying whether a citizen possesses documents (e.g. *Aadhaar copy*, *Land Khazana receipt*) are stored in the user's browser `localStorage` and are never sent to backend servers.
* **Proactive PII Regex Sanitizer:**
  - Located in `backend/app/utils/validators.py` (`check_personal_info`).
  - Automatically scans public feedback and observation descriptions. If a citizen accidentally pastes an Aadhaar number (12 digits) or phone number (10 digits), the request is rejected with a privacy alert.

---

## 4. Input Validation & XSS Prevention

* **Text Sanitization (`sanitize_text` in `validators.py`):**
  - Strips leading/trailing whitespace.
  - Escapes HTML special characters to prevent Cross-Site Scripting (XSS).
* **Slug Sanitization:**
  - Scheme slugs are generated using alphanumeric lowercase hyphens (`^[a-z0-9-]+$`).
* **CORS Policy:**
  - Configurable via `CORS_ORIGINS`. In production, restricts API consumption to authorized frontend origins.

---

## 5. Anti-Hallucination & Public Trust Policy

* **No Synthetic Queue Metrics:**
  - Counter waiting times and queue levels are never fabricated or generated using random simulators. If no verified field observer data exists for a centre, the system displays **"Pending Observer Verification"** rather than presenting inaccurate predictions.
* **External Redirect Modal:**
  - Warns citizens when clicking external links to ensure they know they are entering official West Bengal government portals (`*.gov.in`) and reminds them that BSK services are free of cost.
* **Immutable Audit Trail (`AuditLog`):**
  - Every administrative action (modifying services, publishing schemes, toggling website maintenance, moderating reports) writes an immutable record with admin ID, action type, target entity, timestamp, and mandatory change note.

