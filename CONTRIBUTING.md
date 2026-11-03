# Contributing to Seva Setu

Thank you for your interest in contributing to **Seva Setu**! We welcome contributions from developers, designers, translators, and civic-tech advocates.

---

## 1. Guiding Principles & Public Trust

Seva Setu is an **independent digital citizen assistance platform** designed to help the people of West Bengal understand and access public welfare schemes and government certificate services.

When contributing, remember:
* **Citizen Transparency:** Never publish speculative or synthetic queue data.
* **Security & Privacy:** Never ask for or store sensitive PII (Aadhaar, PAN, bank passbooks, OTPs).
* **Authenticity:** Only link to official government portals (`*.gov.in`).
* **Non-Affiliation Notice:** Do not describe Seva Setu as an official state entity.

---

## 2. Getting Started

1. **Fork the Repository:**
   Fork `https://github.com/Ani2025-git/internship` to your GitHub account.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/internship.git Sevasetu
   cd Sevasetu
   ```
3. **Follow the Setup Guide:**
   Read and follow [`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md) to set up your backend virtual environment, database, and frontend dev server.
4. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 3. Coding Standards

### 3.1 Frontend (React & Tailwind CSS)
* Write clean, functional React components with hooks.
* Use Tailwind CSS utility classes; adhere to the existing brand palette (`#173B72` Navy, `#2878C8` Digital Blue, `#F39A32` Saffron).
* Use Lucide React icons.
* Test all components across mobile (320px–430px) and desktop (1024px–1440px) screen widths.
* Always test production compilation before committing:
  ```bash
  cd frontend
  npm run build
  node sync-dist.js
  ```

### 3.2 Backend (Python & Flask)
* Follow PEP 8 style conventions.
* Validate all request inputs and use `sanitize_text()` for free-text inputs.
* Protect administrative routes with `@admin_required`.
* Never hardcode secrets or database connection strings.

---

## 4. Submitting a Pull Request

1. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add filter for elderly welfare schemes in schemes directory"
   ```
2. Push your feature branch:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request against the `main` branch.
4. Describe your changes, the rationale, and the verification steps performed.

---

## 5. Security & Bug Disclosures

If you discover a security vulnerability or sensitive data leakage, please do **NOT** open a public issue. Email our maintainers directly at `support@sevasetu.org` with reproduction details.

