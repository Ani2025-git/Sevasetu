# Seva Setu — Local Development Guide (Windows & Cross-Platform)

> **Platform:** Seva Setu  
> **Target OS:** Windows 10/11, macOS, Linux  
> **Target Audience:** Developers, Contributors, AI Coding Agents

---

## 1. Prerequisites & Required Software

Before you begin, ensure you have installed:

| Tool | Minimum Version | Windows Verification Command |
| :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` (v20+ recommended) | `node -v` |
| **npm** | `v9.0.0+` | `npm -v` |
| **Python** | `3.10+` (3.11 recommended) | `python --version` |
| **Git** | `2.30+` | `git --version` |

---

## 2. Clone the Repository

Open Windows PowerShell or Command Prompt and clone the repository:

```powershell
git clone https://github.com/Ani2025-git/internship.git Sevasetu
cd Sevasetu
```

---

## 3. Backend Setup (Python & Flask)

The backend is housed inside the `backend/` directory.

### 3.1 Create and Activate Virtual Environment

```powershell
cd backend
python -m venv venv
```

Activate the virtual environment:
* **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(If you get a script execution policy error, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once).*
* **Windows (CMD):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```
* **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3.2 Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

Create a `.env` file in `backend/` (or use the root `.env`):

```ini
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000
SECRET_KEY=sevaqueue-dev-secret-key-2026
JWT_SECRET_KEY=sevaqueue-jwt-dev-secret-2026
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=*
STALE_THRESHOLD_MINUTES=30

# Optional: If omitted, the backend automatically uses local SQLite (sevaqueue.db)
DATABASE_URL=postgresql://neondb_owner:your_neon_password@ep-sample.aws.neon.tech/neondb?sslmode=require
```

### 3.4 Seed the Database

Run the automated seeder to generate schema tables, verified certificates, demo accounts, and government schemes:

```powershell
python seed.py
```

*Default Demo Credentials:*
* **Administrator:** `admin@sevasetu.org` / `Admin@123`
* **Field Observer:** `observer@sevasetu.org` / `Observer@123`
* **Citizen:** `citizen@sevasetu.org` / `Citizen@123`

### 3.5 Start the Backend API

```powershell
python run.py
```

*The backend REST API is now running at:* `http://127.0.0.1:5000`  
*Verify Health Check:* Open `http://127.0.0.1:5000/api/health` in your browser.

---

## 4. Frontend Setup (React & Vite)

Open a **second terminal window** and navigate to the `frontend/` directory:

```powershell
cd Sevasetu/frontend
npm install
```

### 4.1 Configure Frontend Environment (Optional)

In `frontend/.env` (or leave default for automatic proxy):

```ini
# By default, local dev routes through Vite proxy at /api -> http://127.0.0.1:5000/api
VITE_API_BASE_URL=/api
```

### 4.2 Start Frontend Development Server

```powershell
npm run dev
```

*The Vite React application will start at:* `http://localhost:5173`

---

## 5. Verification Checklist

1. Open `http://localhost:5173` in your browser.
2. Navigate to **Schemes** (`/schemes`) $\rightarrow$ Verify that all 7 verified state schemes appear.
3. Click on a scheme (e.g. *Kanyashree Prakalpa*) $\rightarrow$ Test the **Interactive Document Checklist** checkboxes.
4. Click **Login** $\rightarrow$ Sign in with `admin@sevasetu.org` / `Admin@123`.
5. Open the **Website Control** tab in Admin Dashboard $\rightarrow$ Verify status indicators and preview modal.

---

## 6. Building for Production

To test production compilation locally:

```powershell
cd frontend
npm run build
node sync-dist.js
```

This verifies that:
- Vite transforms all JSX, icons, and contexts without errors.
- Assets are compiled to `frontend/dist/`.
- `sync-dist.js` synchronizes the build artifacts with root `dist/` for zero-downtime deployment.

---

## 7. Common Development Errors & Troubleshooting

### 1. `Activate.ps1 cannot be loaded because running scripts is disabled`
* **Cause:** Windows PowerShell Execution Policy restriction.
* **Fix:** Run this command in PowerShell:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### 2. `Network Error` or `Failed to fetch` on frontend
* **Cause:** Backend server is not running or port 5000 is occupied.
* **Fix:** Ensure `python run.py` is running in your backend terminal window and returns healthy at `http://127.0.0.1:5000/api/health`.

### 3. `psycopg2` / `psycopg` install error on Windows
* **Cause:** Missing C++ build tools when compiling from source.
* **Fix:** The project specifies pre-compiled wheels in `requirements.txt`:
  ```powershell
  pip install psycopg2-binary psycopg[binary]
  ```

### 4. Port 5000 already in use
* **Cause:** A background Python process is still holding port 5000.
* **Fix (PowerShell):**
  ```powershell
  Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force
  ```

