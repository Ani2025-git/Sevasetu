# Privacy & Data Ethics Policy

**Platform Name:** SevaQueue  
**Effective Date:** 2026 Pilot Demonstration Edition  

---

## 1. Principles of Civic Privacy
SevaQueue is architected under the principle of **Zero-Unnecessary-Data-Collection**. We believe civic platforms should respect citizen privacy and minimize risk.

---

## 2. No Mandatory Citizen Registration
- Public citizens browsing service document checklists, checking operating schedules, or inspecting queue indicators do not require registration or personal account creation.
- No citizen emails, phone numbers, or residential addresses are collected to view platform information.

---

## 3. Strict No-PII (Personally Identifiable Information) Boundary
- **Never Collect Aadhaar or Identification Details:** SevaQueue never requests, transmits, or stores Aadhaar numbers, EPIC (Voter ID) numbers, Ration card IDs, PAN numbers, or bank account numbers.
- **Automated PII Detection:** Both frontend observation forms and backend API endpoints employ regular expression pattern analyzers to reject observation submissions containing mobile numbers or identification digit sequences.
- **Anonymous Public Observations:** Public crowd reports are recorded anonymously without persisting user identity or tracking telemetry.

---

## 4. Staff & Observer Authentication
- Only authorized administrative coordinators and designated field observers possess registered credentials.
- All passwords are encrypted using one-way cryptographic hashing (`generate_password_hash` via Werkzeug/scrypt).
- Role-based access control enforces least-privilege principles. Observers cannot directly publish unreviewed queue statuses.

---

## 5. Audit Logging
Administrative actions (creating centres, updating service checklists, reviewing observations, and altering platform parameters) are captured in an internal audit table to ensure accountability and integrity.

