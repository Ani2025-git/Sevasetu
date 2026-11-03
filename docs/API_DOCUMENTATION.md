# Seva Setu — RESTful API Specification

> **Base URL (Production):** `https://sevasetu-mb4e.onrender.com/api`  
> **Base URL (Vercel Proxy):** `https://sevasetu-flax-kappa.vercel.app/api`  
> **Base URL (Local Development):** `http://127.0.0.1:5000/api`  
> **Authentication Scheme:** `Bearer <JWT_TOKEN>` in `Authorization` header

---

## 1. Authentication & Session APIs (`/api/auth`)

### 1.1 Register Citizen Account
* **Endpoint:** `POST /api/auth/register`
* **Access:** Public (Blocked during Maintenance Mode)
* **Request Body:**
  ```json
  {
    "full_name": "Sujata Roy",
    "email": "sujata.roy@example.com",
    "password": "Password@123",
    "confirm_password": "Password@123"
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Citizen account created successfully",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 8,
      "name": "Sujata Roy",
      "email": "sujata.roy@example.com",
      "role": "citizen"
    }
  }
  ```
* **Errors:** `400 Bad Request` (Email already registered, passwords do not match, weak password).

---

### 1.2 User Login
* **Endpoint:** `POST /api/auth/login`
* **Access:** Public (Always accessible, even during Maintenance Mode)
* **Request Body:**
  ```json
  {
    "email": "admin@sevasetu.org",
    "password": "Admin@123"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "Platform Administrator",
      "email": "admin@sevasetu.org",
      "role": "admin"
    }
  }
  ```
* **Errors:** `401 Unauthorized` (Invalid email or password).

---

### 1.3 Get Current User Profile
* **Endpoint:** `GET /api/auth/me`
* **Access:** Authenticated (`Bearer <token>`)
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "Platform Administrator",
      "email": "admin@sevasetu.org",
      "role": "admin",
      "created_at": "2026-11-01T10:00:00"
    }
  }
  ```

---

## 2. Public Service & Centre Directory APIs (`/api`)

### 2.1 Health Check
* **Endpoint:** `GET /api/health`
* **Access:** Public (Bypasses Maintenance Mode)
* **Success Response (`200 OK`):**
  ```json
  {
    "status": "healthy",
    "application": "Seva Setu",
    "tagline": "Your Government Services, Made Simple.",
    "timestamp": "2026-11-03T16:00:00.000000",
    "mode": "independent-citizen-assistance-platform"
  }
  ```

---

### 2.2 Website Status (Maintenance Check)
* **Endpoint:** `GET /api/website-status`
* **Access:** Public (Bypasses Maintenance Mode)
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "is_maintenance_mode": false,
    "status": "ONLINE",
    "titles": {
      "en": "We'll Be Back Soon",
      "bn": "আমরা শীঘ্রই ফিরে আসব",
      "hi": "हम जल्द ही वापस आएंगे"
    },
    "messages": {
      "en": "Seva Setu is temporarily unavailable while we carry out maintenance.",
      "bn": "তফসিলি রক্ষণাবেক্ষণের জন্য সেবা সেতু সাময়িকভাবে অনুপলব্ধ রয়েছে।",
      "hi": "अनुसूचित रखरखाव के कारण सेवा सेतु अस्थायी रूप से अनुपलब्ध है।"
    },
    "estimated_reopening_at": "2026-11-04T06:00:00Z",
    "support_contact_email": "support@sevasetu.org",
    "updated_at": "2026-11-03T21:30:00Z"
  }
  ```

---

### 2.3 List Government Services
* **Endpoint:** `GET /api/services`
* **Query Parameters:** `search` (string), `category` (string), `department` (string)
* **Access:** Public (Returns `503 Service Unavailable` when maintenance mode is active)
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 6,
    "categories": ["All", "Birth Certificate", "Caste Certificate", "Income Certificate"],
    "services": [
      {
        "id": 1,
        "name": "Income Certificate (e-District)",
        "department": "Department of Personnel & Administrative Reforms / Revenue",
        "category": "Income Certificate",
        "description": "Official Income Certificate issued by competent SDO or BDO.",
        "eligibility": "Any permanent resident citizen of West Bengal.",
        "fees": "Free of Cost",
        "expected_processing_time": "7 to 15 Working Days",
        "online_apply_url": "https://edistrict.wb.gov.in",
        "verification_status": "OFFICIALLY_VERIFIED"
      }
    ]
  }
  ```

---

### 2.4 Get Service Details
* **Endpoint:** `GET /api/services/<id>`
* **Access:** Public
* **Success Response (`200 OK`):** Returns full service entity including structured `required_documents`, offline instructions, and official source citations.

---

### 2.5 List BSK Centres
* **Endpoint:** `GET /api/centres`
* **Query Parameters:** `district` (string), `search` (string)
* **Access:** Public
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "total": 2,
    "districts": ["North 24 Parganas", "South 24 Parganas"],
    "centres": [
      {
        "id": 1,
        "name": "Bangla Sahayata Kendra — Bhangar I BDO Office",
        "district": "South 24 Parganas",
        "address": "Bhangar I BDO Compound, P.O. Bhangar, PIN 743502",
        "operating_hours": "10:00 AM - 5:00 PM (Monday to Friday)",
        "is_active": true
      }
    ]
  }
  ```

---

### 2.6 Submit Anonymous Citizen Observation
* **Endpoint:** `POST /api/public/observations`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "centre_id": 1,
    "queue_level": "MODERATE",
    "wait_time_minutes": 25,
    "crowd_description": "Around 15 people in line, both counters operating."
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Observation submitted for administrative review."
  }
  ```

---

### 2.7 Citizen Saved Services (Bookmarks)
* **Endpoints:**
  * `GET /api/saved-services` — List user's bookmarked services (`200 OK`)
  * `POST /api/saved-services` — Body: `{"service_id": 1}` (`201 Created`)
  * `DELETE /api/saved-services/<service_id>` — Remove bookmark (`200 OK`)
* **Access:** Requires Citizen JWT (`Bearer <token>`)

---

## 3. Government Schemes Module APIs (`/api/schemes`)

### 3.1 List Welfare Schemes
* **Endpoint:** `GET /api/schemes`
* **Query Parameters:**
  * `page` (int, default: 1)
  * `per_page` (int, default: 9)
  * `category` (slug string, e.g. `women-child-welfare`)
  * `department_id` (int)
  * `search` (keyword string)
* **Access:** Public (Offline fallback supported in frontend)
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "total": 7,
    "page": 1,
    "pages": 1,
    "per_page": 9,
    "schemes": [
      {
        "id": 1,
        "name": "Kanyashree Prakalpa (K1 & K2)",
        "slug": "kanyashree-prakalpa",
        "category_id": 3,
        "category_name": "Women & Child Welfare",
        "category_slug": "women-child-welfare",
        "short_description": "Conditional cash transfer to encourage girl-child education.",
        "beneficiary_summary": "Unmarried female students aged 13–19 in recognized schools",
        "verification_status": "VERIFIED",
        "status": "PUBLISHED",
        "official_application_url": "https://wbkanyashree.gov.in"
      }
    ]
  }
  ```

---

### 3.2 Get Scheme Categories
* **Endpoint:** `GET /api/schemes/categories`
* **Success Response (`200 OK`):** Returns list of welfare categories with corresponding published scheme counts.

---

### 3.3 Get Scheme Details by Slug
* **Endpoint:** `GET /api/schemes/<slug>`
* **Access:** Public
* **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "scheme": {
      "id": 1,
      "name": "Kanyashree Prakalpa (K1 & K2)",
      "slug": "kanyashree-prakalpa",
      "short_description": "...",
      "full_description": "...",
      "rules": [
        {
          "criteria_title": "Age Requirement",
          "criteria_description": "Must be between 13 and 18 years old for K1, or completed 18 for K2.",
          "rule_type": "AGE",
          "is_mandatory": true
        }
      ],
      "documents": [
        {
          "document_name": "Birth Certificate / Madhyamik Admit Card",
          "description": "Certified age proof",
          "is_mandatory": true
        }
      ],
      "sources": [
        {
          "source_title": "Official Kanyashree Prakalpa Portal",
          "source_url": "https://wbkanyashree.gov.in",
          "source_type": "OFFICIAL_PORTAL"
        }
      ]
    }
  }
  ```

---

## 4. Field Observer APIs (`/api/observations`)

* **Submit Verified Field Report:** `POST /api/observations`  
  *Access:* Observer Role (`observer@sevasetu.org`). Body: `{"centre_id": 1, "queue_level": "HIGH", "wait_time_minutes": 45, "counter_count_active": 2, "token_system_working": true, "crowd_description": "Long queue due to technical server delay."}`
* **View Submission History:** `GET /api/observations/my` (`200 OK`).

---

## 5. Administrative Control APIs (`/api/admin`)

*All administrative endpoints strictly require an `admin` role JWT token (`@admin_required`).*

### 5.1 Website Availability & Maintenance Control
* **Get Website Settings & Audit Trail:**  
  `GET /api/admin/website-settings`  
  *Response (`200 OK`):* Returns singleton `settings` and recent status change entries from `audit_logs`.
* **Update Website Settings / Toggle Maintenance:**  
  `PUT /api/admin/website-settings`  
  *Request Body:*
  ```json
  {
    "is_maintenance_mode": true,
    "maintenance_title_en": "Scheduled System Maintenance",
    "maintenance_title_bn": "তফসিলি রক্ষণাবেক্ষণ",
    "maintenance_title_hi": "अनुसूचित रखरखाव",
    "maintenance_message_en": "Upgrading server infrastructure. Normal services will resume shortly.",
    "maintenance_message_bn": "সার্ভার পরিকাঠামো আপগ্রেড করা হচ্ছে। শীঘ্রই পরিষেবা চালু হবে।",
    "maintenance_message_hi": "सर्वर बुनियादी ढांचे का उन्नयन किया जा रहा है।",
    "estimated_reopening_at": "2026-11-04T04:30:00Z",
    "support_contact_email": "support@sevasetu.org",
    "reason": "Database migration and performance optimization"
  }
  ```
  *Response (`200 OK`):* Returns updated settings and automatically writes an immutable record to `audit_logs`.

---

### 5.2 Administrative Scheme Management
* **List Schemes (All lifecycle states):** `GET /api/admin/schemes`
* **Get Single Scheme:** `GET /api/admin/schemes/<id>`
* **Create Scheme Draft:** `POST /api/admin/schemes`
* **Update Scheme:** `PUT /api/admin/schemes/<id>`
* **Lifecycle Status Transition:** `PATCH /api/admin/schemes/<id>/status`  
  *Body:* `{"status": "PENDING_APPROVAL"}` or `{"status": "PUBLISHED"}`
* **Publish Scheme:** `POST /api/admin/schemes/<id>/publish`
* **Archive Scheme:** `POST /api/admin/schemes/<id>/archive`
* **Delete Draft:** `DELETE /api/admin/schemes/<id>`

---

### 5.3 Centre & Service Management
* `POST /api/admin/centres` / `PUT /api/admin/centres/<id>` / `DELETE /api/admin/centres/<id>`
* `POST /api/admin/services` / `PUT /api/admin/services/<id>` / `DELETE /api/admin/services/<id>`

---

### 5.4 Queue Moderation & Broadcasting
* **List Pending Observations:** `GET /api/admin/observations?status=PENDING`
* **Moderate Observation:** `POST /api/admin/observations/<id>/review` (`{"action": "APPROVE" | "REJECT"}`)
* **Broadcast Queue Update:** `POST /api/admin/queue-updates` (`{"centre_id": 1, "queue_status": "MODERATE", "source_type": "OBSERVER_VERIFIED"}`)
* **Audit Logs:** `GET /api/admin/audit-logs`

