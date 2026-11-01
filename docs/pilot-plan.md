# Pilot Execution Plan & Architecture

**Project:** SevaQueue Independent Pilot Demonstration  
**Target:** Bangla Sahayata Kendra (BSK) Queue Awareness System  
**Region:** West Bengal, India  

---

## 1. Executive Summary
Bangla Sahayata Kendras (BSK) were established by the Government of West Bengal to provide free public services directly to citizens across grassroots Gram Panchayats and municipal wards. While highly effective, citizens frequently experience uncertainty regarding peak rush hours and missing documentation, resulting in repeat trips and congestion.

**SevaQueue** tests a decentralized, community-corroborated information layer that addresses this issue:
- "Know Before You Visit": Citizens review required paperwork before leaving home.
- Real-time Queue Intelligence: Evidence-based crowd levels categorized into Low, Moderate, High, or Stale.

---

## 2. Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Axios, Recharts
- **Backend:** Python Flask 3.0, Flask-SQLAlchemy, Flask-CORS, PyJWT, Werkzeug Security
- **Database:** SQLite (Embedded, zero external daemon requirements)
- **Architecture:** Lightweight RESTful API with stateless JWT session management

---

## 3. Pilot Roles & Responsibilities

| Role | Access Level | Responsibilities |
|---|---|---|
| **Public User** | Anonymous | View centres, browse document requirements, view verified queue indicators, submit optional crowdsourced observation. |
| **Field Observer** | Authenticated (JWT) | Log empirical on-site queue observations (Low/Moderate/High) with non-personal notes. Cannot publish directly. |
| **Administrator** | Authenticated (JWT) | Review pending observations, approve/reject reports, publish queue statuses with verified source attribution, manage centres & services. |

---

## 4. Operational Queue Rules
1. **Evidence Threshold:** Queue updates require reviewed observations or verified staff log confirmation.
2. **Attribution Requirement:** Every published queue status must include a human-readable `source_description` and count of supporting observations.
3. **Staleness Tracking:** Updates older than the configured threshold (default 30 mins) degrade gracefully to `"UNKNOWN / No Recent Update"`.
4. **No Artificial Predictions:** SevaQueue strictly avoids algorithmic wait-time fabrication without on-site data.

