# Seva Setu — Product Roadmap & Milestones

> **Platform:** Seva Setu (Citizen Information & Welfare Guide)  
> **Development Lifecycle:** Iterative, Community-Driven, Pilot to State-Scale  
> **Current Phase:** Phase 2 (Welfare Schemes & Platform Governance)

---

## 1. Completed Milestones

### Phase 1: Core Foundation & Certificate Directory
- [x] Initial full-stack boilerplate (React 18 + Vite + Tailwind CSS + Flask + Neon PostgreSQL).
- [x] Directory of primary West Bengal certificates (*Income, Caste, Domicile, Birth, Death, Digital Ration Card*).
- [x] Physical counter locator for Bangla Sahayata Kendras (BSK) with hours and holiday schedules.
- [x] Safe External Redirect system warning citizens when transitioning to authentic `*.gov.in` websites.
- [x] Interactive Client-Side Document Checklist with `localStorage` persistence and completion progress.
- [x] Citizen registration and authenticated Saved Services personal dashboard.
- [x] Field Observer role for crowdsourcing on-ground queue conditions.
- [x] Administrative Dashboard with full CRUD controls, queue moderation, and immutable audit logs.

### Phase 2: Welfare Schemes & Platform Governance
- [x] Complete Government Schemes Module (`/schemes`, `/schemes/:slug`).
- [x] Detailed eligibility rule engine (Age, Gender, Income, Residence, Caste, Student status).
- [x] Integration of 7 flagship West Bengal schemes (*Kanyashree Prakalpa*, *Lakshmir Bhandar*, *Swasthya Sathi*, *Krishak Bandhu*, *Yuvasree*, *Jai Bangla Pension*, *Snehaloy Housing Scheme*).
- [x] Zero-downtime verified offline fallback cache (`FALLBACK_SCHEMES`) to survive cloud cold starts.
- [x] Trilingual system (বাংলা, English, हिन्दी) with persistent language selector.
- [x] Mobile header redesign: Compact navigation, accessible drawer, touch targets (320px–430px).
- [x] Vercel SPA 404 routing fix with comprehensive URL rewrites.
- [x] Website Availability Control: Admin master switch, HTTP 503 guard with `Retry-After`, multilingual maintenance announcements, and live preview modal.

---

## 2. In Progress

- [ ] **District-Wide Centre Scaling:** Expanding BSK directory from pilot districts (*South 24 Parganas*, *North 24 Parganas*) to cover all 23 districts of West Bengal.
- [ ] **SMS / WhatsApp Token Alerts (Pilot Design):** Designing non-intrusive alert mechanisms for citizens tracking BSK queue thresholds.
- [ ] **Observer Verification App:** Streamlined PWA interface for field observers to submit crowd assessments in low-bandwidth rural conditions.

---

## 3. Planned Features

### 3.1 AI Scheme Eligibility Finder
* **Classification:** `Planned` (Not yet implemented)
* **Goal:** A guided, conversational recommendation questionnaire that evaluates citizen profile attributes (household income, age, gender, occupation, land ownership) and matches them with eligible schemes.
* **Ethics & Anti-Hallucination:** Clear disclaimers that AI recommendations are advisory and do not guarantee government approval.

### 3.2 Granular Multi-Factor Scheme Search
* **Goal:** Filter schemes by simultaneous multiple criteria (e.g., *Women Only + Rural Landholder + Age 25–40*).
* **Architecture:** Enhanced PostgreSQL composite indexing on `scheme_eligibility_rules`.

### 3.3 Printable Citizen Preparation Dossier
* **Goal:** One-click generation of a print-ready PDF containing all required document proofs, application form links, and instructions for a specific service or scheme.

---

## 4. Future Ideas & Research

* **Voice-First Navigation in Regional Dialects:** Voice search for rural citizens in Bengali and regional dialects.
* **Crowdsourced Holiday & Strike Calendar:** Real-time crowd reports warning citizens if a specific BDO or BSK facility is closed due to local administrative holidays.
* **Offline-First PWA (Progressive Web App):** Installable web application with complete offline scheme manuals for areas with intermittent mobile internet.

