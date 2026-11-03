# Seva Setu — Database Architecture & Schema Specification

> **Engine:** PostgreSQL 16 (Neon Serverless) with SQLite local fallback  
> **ORM:** Flask-SQLAlchemy 3.1.1  
> **Schema Definition:** `backend/app/models/`  
> **Initial Seed Data:** `backend/seed.py`

---

## 1. Schema Overview

The database contains **16 interconnected relational tables** grouped into 5 logical domains:

1. **Identity & Access Management:** `users`
2. **Citizen Services & Physical Infrastructure:** `centres`, `services`, `saved_services`
3. **Crowdsourced Queue Intelligence:** `observations`, `queue_updates`
4. **Welfare Schemes Knowledge Base:** `government_schemes`, `scheme_categories`, `scheme_departments`, `scheme_eligibility_rules`, `scheme_required_documents`, `scheme_official_sources`, `scheme_verification_history`
5. **System Governance & Audit:** `audit_logs`, `settings`, `website_settings`

---

## 2. Table Specifications

### 2.1 `users`
Stores user identities, hashed credentials, and system roles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique user identifier |
| `name` | `VARCHAR(100)` | Not Null | Citizen or staff display name |
| `email` | `VARCHAR(120)` | Not Null, Unique, Indexed | User login email (normalized to lowercase) |
| `password_hash` | `VARCHAR(255)` | Not Null | Bcrypt hashed password |
| `role` | `VARCHAR(20)` | Not Null, Default `'citizen'` | Role permissions: `'citizen'`, `'observer'`, `'admin'` |
| `created_at` | `TIMESTAMP` | Default `utcnow()` | Registration timestamp |

*Relationships:*
* `saved_services` (1:N via `user_id`)
* `observations` (1:N via `observer_user_id` / `reviewed_by`)
* `queue_updates` (1:N via `published_by`)
* `audit_logs` (1:N via `user_id`)
* `government_schemes` (1:N via `created_by` / `updated_by`)

---

### 2.2 `centres`
Bangla Sahayata Kendras (BSK) and government service facilitation centers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique centre identifier |
| `name` | `VARCHAR(150)` | Not Null | Centre name (e.g. *BSK Alipore SDO Office*) |
| `district` | `VARCHAR(100)` | Not Null, Indexed | District (e.g. *South 24 Parganas*) |
| `subdivision` | `VARCHAR(100)` | Nullable | Administrative subdivision |
| `block_municipality` | `VARCHAR(100)` | Nullable | Block or municipality name |
| `address` | `TEXT` | Not Null | Physical location details |
| `pincode` | `VARCHAR(10)` | Nullable | Postal code |
| `latitude` | `FLOAT` | Nullable | Geolocation latitude |
| `longitude` | `FLOAT` | Nullable | Geolocation longitude |
| `contact_number` | `VARCHAR(20)` | Nullable | Physical counter inquiry telephone |
| `operating_hours` | `VARCHAR(100)` | Default `'10:00 AM - 5:00 PM'` | Operating hours schedule |
| `is_active` | `BOOLEAN` | Default `True` | Whether the centre is operational |
| `created_at` | `TIMESTAMP` | Default `utcnow()` | Record creation date |

*Relationships:*
* `services` (1:N via `centre_id`)
* `observations` (1:N via `centre_id`)
* `queue_updates` (1:N via `centre_id`)

---

### 2.3 `services`
Government public service profiles (e.g., certificates, licenses, digital ration cards).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique service identifier |
| `name` | `VARCHAR(150)` | Not Null, Indexed | Public name of the service |
| `department` | `VARCHAR(150)` | Not Null | Operating government department |
| `category` | `VARCHAR(100)` | Not Null | Category (e.g. *Income Certificate*, *Caste Certificate*) |
| `description` | `TEXT` | Not Null | Overview of the service |
| `eligibility` | `TEXT` | Nullable | Eligibility prerequisites |
| `fees` | `VARCHAR(50)` | Default `'Free of Cost'` | Statutory charges / BSK fee policy |
| `expected_processing_time`| `VARCHAR(100)`| Nullable | Expected processing duration (e.g. *7–15 Days*) |
| `online_apply_url` | `VARCHAR(255)` | Nullable | Authentic West Bengal application portal link |
| `offline_instructions` | `TEXT` | Nullable | Physical counter submission steps |
| `official_source_url` | `VARCHAR(255)` | Nullable | Citations and government gazette URL |
| `centre_id` | `INTEGER` | Foreign Key `centres.id` | Facilitating BSK facility |
| `required_documents` | `JSON` | Nullable | Array of required documents for checklist |
| `is_active` | `BOOLEAN` | Default `True` | Service availability flag |
| `last_verified_at` | `TIMESTAMP` | Default `utcnow()` | Last administrative verification date |
| `verification_status` | `VARCHAR(50)` | Default `'OFFICIALLY_VERIFIED'`| Status: `'OFFICIALLY_VERIFIED'`, `'NEEDS_REVIEW'` |
| `created_at` | `TIMESTAMP` | Default `utcnow()` | Record creation date |

---

### 2.4 `saved_services`
Citizen personal bookmarks connecting users to saved services.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Identifier |
| `user_id` | `INTEGER` | Foreign Key `users.id`, Not Null | Bookmarking citizen |
| `service_id` | `INTEGER` | Foreign Key `services.id`, Not Null | Bookmarked service profile |
| `created_at` | `TIMESTAMP` | Default `utcnow()` | Bookmark timestamp |

---

### 2.5 `observations`
Field reports submitted by citizens (anonymous) or authorized observers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Observation report ID |
| `centre_id` | `INTEGER` | Foreign Key `centres.id`, Not Null | BSK facility observed |
| `observer_user_id` | `INTEGER` | Foreign Key `users.id`, Nullable | Submitting user ID (null if anonymous) |
| `is_anonymous` | `BOOLEAN` | Default `False` | Anonymous submission flag |
| `queue_level` | `VARCHAR(20)` | Not Null | Queue state: `'LOW'`, `'MODERATE'`, `'HIGH'` |
| `wait_time_minutes` | `INTEGER` | Nullable | Estimated citizen wait duration |
| `crowd_description` | `TEXT` | Nullable | Physical field crowd description |
| `counter_count_active`| `INTEGER` | Default `1` | Active service desks operating |
| `token_system_working`| `BOOLEAN` | Default `True` | Electronic token machine operational |
| `submitted_at` | `TIMESTAMP` | Default `utcnow()`, Indexed | Time of report |
| `review_status` | `VARCHAR(20)` | Default `'PENDING'`, Indexed | Review status: `'PENDING'`, `'APPROVED'`, `'REJECTED'` |
| `reviewed_by` | `INTEGER` | Foreign Key `users.id`, Nullable | Reviewing administrator |
| `reviewed_at` | `TIMESTAMP` | Nullable | Moderation timestamp |

---

### 2.6 `queue_updates`
Verified administrative broadcasts of physical counter crowd levels.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Broadcast ID |
| `centre_id` | `INTEGER` | Foreign Key `centres.id`, Not Null | Broadcasted centre |
| `status` | `VARCHAR(20)` | Not Null | Official status: `'LOW'`, `'MODERATE'`, `'HIGH'` |
| `source_type` | `VARCHAR(50)` | Default `'OBSERVER_VERIFIED'` | Source: `'OBSERVER_VERIFIED'`, `'ADMIN_OVERRIDE'` |
| `source_description` | `VARCHAR(255)`| Nullable | Public methodology citation |
| `published_by` | `INTEGER` | Foreign Key `users.id`, Not Null | Publishing administrator |
| `published_at` | `TIMESTAMP` | Default `utcnow()`, Indexed | Time of broadcast |
| `is_active` | `BOOLEAN` | Default `True` | Active status flag |

---

### 2.7 `government_schemes`
Flagship government welfare schemes of West Bengal.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique scheme identifier |
| `name` | `VARCHAR(200)` | Not Null | Scheme name (e.g. *Kanyashree Prakalpa*) |
| `slug` | `VARCHAR(200)` | Not Null, Unique, Indexed | Clean URL slug (e.g. `kanyashree-prakalpa`) |
| `category_id` | `INTEGER` | Foreign Key `scheme_categories.id`, Nullable | Scheme category |
| `department_id` | `INTEGER` | Foreign Key `scheme_departments.id`, Nullable | Implementing government department |
| `short_description` | `TEXT` | Not Null | Summary for scheme cards |
| `full_description` | `TEXT` | Nullable | Detailed scheme rules and entitlements |
| `beneficiary_summary`| `VARCHAR(255)`| Nullable | Target demographic (e.g. *Unmarried female students*) |
| `verification_status`| `VARCHAR(50)` | Default `'VERIFIED'` | Status: `'VERIFIED'`, `'UNDER_REVIEW'`, `'NEEDS_UPDATE'` |
| `status` | `VARCHAR(50)` | Default `'DRAFT'`, Indexed | Lifecycle: `'DRAFT'`, `'PENDING_APPROVAL'`, `'PUBLISHED'`, `'ARCHIVED'` |
| `last_verified_at` | `TIMESTAMP` | Default `utcnow()` | Official government verification date |
| `official_application_url` | `VARCHAR(500)`| Nullable | Portal URL (e.g. `wbkanyashree.gov.in`) |
| `official_info_url` | `VARCHAR(500)`| Nullable | Guidelines and notifications URL |
| `application_instructions` | `TEXT` | Nullable | Step-by-step application instructions |
| `created_by` | `INTEGER` | Foreign Key `users.id`, Nullable | Creating administrator |
| `updated_by` | `INTEGER` | Foreign Key `users.id`, Nullable | Last modifying administrator |
| `created_at` | `TIMESTAMP` | Default `utcnow()` | Created timestamp |
| `updated_at` | `TIMESTAMP` | Default `utcnow()` | Last modified timestamp |

*Child Tables:*
* `scheme_eligibility_rules` (1:N via `scheme_id`)
* `scheme_required_documents` (1:N via `scheme_id`)
* `scheme_official_sources` (1:N via `scheme_id`)
* `scheme_verification_history` (1:N via `scheme_id`)

---

### 2.8 Supporting Scheme Tables
* **`scheme_categories`**: Welfare categories (`id`, `name`, `slug` [Unique], `description`, `icon_name`).
* **`scheme_departments`**: Implementing state ministries (`id`, `name`, `website_url`).
* **`scheme_eligibility_rules`**: Formal rule engine (`id`, `scheme_id` [FK], `rule_type`, `criteria_title`, `criteria_description`, `minimum_age`, `maximum_age`, `gender_requirement`, `max_annual_income`, `residence_requirement`, `caste_requirement`, `occupation_requirement`, `is_mandatory`).
* **`scheme_required_documents`**: Document verification list (`id`, `scheme_id` [FK], `document_name`, `description`, `is_mandatory`, `alternative_documents`).
* **`scheme_official_sources`**: Citations and gazette notifications (`id`, `scheme_id` [FK], `source_title`, `source_url`, `source_department`, `source_type`, `verified_at`).
* **`scheme_verification_history`**: Audit log of verification passes (`id`, `scheme_id` [FK], `verified_by` [FK], `verification_status`, `notes`, `verified_at`).

---

### 2.9 `website_settings`
Singleton configuration for website availability, maintenance mode, and multilingual announcements.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key | Singleton row (always `id = 1`) |
| `is_maintenance_mode` | `BOOLEAN` | Default `False`, Not Null | Public availability toggle |
| `maintenance_title_en` | `VARCHAR(255)`| Default `"We'll Be Back Soon"` | English title |
| `maintenance_title_bn` | `VARCHAR(255)`| Default `"আমরা শীঘ্রই ফিরে আসব"` | Bengali title |
| `maintenance_title_hi` | `VARCHAR(255)`| Default `"हम जल्द ही वापस आएंगे"` | Hindi title |
| `maintenance_message_en`| `TEXT` | Not Null | English announcement body |
| `maintenance_message_bn`| `TEXT` | Nullable | Bengali announcement body |
| `maintenance_message_hi`| `TEXT` | Nullable | Hindi announcement body |
| `estimated_reopening_at`| `TIMESTAMP` | Nullable | Scheduled reopening datetime for countdown |
| `support_contact_email`| `VARCHAR(255)`| Default `'support@sevasetu.org'` | Emergency contact email |
| `updated_by` | `INTEGER` | Foreign Key `users.id`, Nullable | Administrator who performed last change |
| `updated_at` | `TIMESTAMP` | Default `utcnow()` | Timestamp of last change |

---

### 2.10 `audit_logs`
Immutable compliance log recording security events, data mutations, and website status toggles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique log entry ID |
| `user_id` | `INTEGER` | Foreign Key `users.id`, Nullable | Acting user ID |
| `action` | `VARCHAR(100)` | Not Null, Indexed | Action code (e.g. `WEBSITE_STATUS_CHANGE`, `CREATE_SCHEME`) |
| `entity_type` | `VARCHAR(100)` | Not Null | Target model (e.g. `WebsiteSettings`, `GovernmentScheme`) |
| `entity_id` | `VARCHAR(50)` | Nullable | Target record ID |
| `details` | `TEXT` | Nullable | Human-readable explanation and mandatory reason |
| `ip_address` | `VARCHAR(50)` | Nullable | Client IP address |
| `created_at` | `TIMESTAMP` | Default `utcnow()`, Indexed | Audit event timestamp |

---

## 3. Database Initialization & Seeding

* **Automatic Schema Creation:** Handled on application startup via `db.create_all()` within `app.py`, `backend/app.py`, and `api/index.py`.
* **Singleton Guarantee:** `WebsiteSettings.get_settings()` creates record ID 1 with default bilingual messages if the table is empty.
* **Seed Script (`backend/seed.py`)**:
  - `ensure_demo_users()` creates default accounts if missing:
    * Administrator: `admin@sevasetu.org` / `Admin@123`
    * Field Observer: `observer@sevasetu.org` / `Observer@123`
    * Citizen: `citizen@sevasetu.org` / `Citizen@123`
  - `seed_database()` populates verified pilot BSK centres (*Bhangar I BDO Office*, *Alipore SDO Office*) and certificate services.
  - `seed_schemes()` populates 7 flagship welfare programs with complete rules and document requirements.

