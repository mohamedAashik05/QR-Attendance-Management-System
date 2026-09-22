# QR-Based Attendance Management System

## Project Overview

This application manages trainer authentication, time-limited attendance QR codes, student registration, and attendance check-ins. It is split into a React/Vite frontend and an Express backend backed by Microsoft SQL Server.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, `qrcode.react`, `html5-qrcode`
- Backend: Node.js, Express, JSON Web Tokens, bcrypt, `mssql`, `msnodesqlv8`
- Database: Microsoft SQL Server

## Setup & Installation

### Prerequisites

- Node.js 20 or newer
- Microsoft SQL Server and the `ODBC Driver 18 for SQL Server`
- A configured `QRAttendanceDB` database with the required tables and stored procedures

### Install dependencies

From the repository root:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### Configure environment variables

Copy the templates:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Update `backend/.env` with the SQL Server settings and a long random `JWT_SECRET`. Update `frontend/.env` if the backend is hosted somewhere other than the local development server. Never commit either `.env` file.

### Run locally

Start the backend:

```powershell
cd backend
npm run start:dev
```

In another terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

The frontend uses Vite's `/api` proxy during development. The backend listens on the port configured by `PORT`.

## Environment Variable Setup

### Backend

| Variable | Purpose |
| --- | --- |
| `PORT` | Express server port |
| `DB_DRIVER` | SQL Server ODBC driver name |
| `DB_SERVER` | SQL Server host or instance |
| `DB_DATABASE` | Database name |
| `DB_PORT` | SQL Server port reference |
| `DB_TRUSTED_CONNECTION` | Windows integrated authentication setting |
| `DB_ENCRYPT` | SQL connection encryption setting |
| `DB_TRUST_SERVER_CERTIFICATE` | Whether to trust the SQL certificate |
| `JWT_SECRET` | Secret used to sign authentication and QR tokens |

### Frontend

Only variables prefixed with `VITE_` are exposed to browser code.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Axios API base path or deployed API URL |
| `VITE_BACKEND_URL` | Vite development proxy target |

Do not place passwords, JWT secrets, database credentials, or private API keys in frontend environment variables.

## Deployment

1. Provision SQL Server and apply the database schema and stored procedures.
2. Deploy the backend to a Node.js host and configure all backend variables from `backend/.env.example` through the host's secret manager.
3. Set `PORT` to the platform-provided port and set `DB_SERVER`, `DB_DATABASE`, and authentication options for the production database.
4. Set a unique production `JWT_SECRET`; never reuse the development value.
5. Configure the frontend's `VITE_API_BASE_URL` to the deployed API URL, then build it:

   ```powershell
   cd frontend
   npm run build
   ```

6. Serve `frontend/dist` from a static host and configure SPA fallback to `index.html` so React Router routes work on refresh.
7. Restrict backend CORS to the deployed frontend origin instead of allowing every origin in production.

Environment variables must be configured in the deployment platform, not committed to the repository.