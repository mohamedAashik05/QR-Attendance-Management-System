# QR-Based Attendance Management System

## Project Overview

This application manages trainer authentication, time-limited attendance QR codes, student registration, and attendance check-ins. It is split into a React/Vite frontend and an Express backend backed by MongoDB (via Mongoose).

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Axios, Tailwind CSS, `qrcode.react`, `html5-qrcode`
- **Backend**: Node.js, Express, JSON Web Tokens, bcrypt, `mongoose`
- **Database**: MongoDB (MongoDB Atlas or local MongoDB instance)

---

## Setup & Installation

### Prerequisites

- Node.js 20 or newer
- MongoDB Atlas connection string (or a local MongoDB instance running on `mongodb://127.0.0.1:27017/QRAttendanceDB`)

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

1. Update `backend/.env` with your `MONGODB_URI` and a secret `JWT_SECRET`.
2. Update `frontend/.env` if the backend is hosted somewhere other than the local development server.
3. Never commit `.env` files to git.

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

The frontend uses Vite's `/api` proxy during development. The backend listens on the port configured by `PORT` (default `5000`).

---

## Environment Variable Setup

### Backend

| Variable | Purpose |
| --- | --- |
| `PORT` | Express server port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas or local MongoDB connection URI |
| `JWT_SECRET` | Secret key used to sign authentication and QR tokens |

### Frontend

Only variables prefixed with `VITE_` are exposed to browser code.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Axios API base URL (e.g., deployed backend URL on Render or `/api` for dev proxy) |
| `VITE_BACKEND_URL` | Vite development proxy target (e.g., `http://localhost:5000`) |

Do not place passwords, JWT secrets, database credentials, or private API keys in frontend environment variables.

---

## Cloud Deployment

### 1. Database (MongoDB Atlas)
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a Database User with read/write privileges.
- In Network Access, allow access from anywhere (`0.0.0.0/0`).
- Copy the connection string and include your database name (e.g. `/QRAttendanceDB`).

### 2. Backend (Render / Railway)
- Deploy `backend` as a Node Web Service.
- Set Build Command: `npm install`
- Set Start Command: `npm start`
- Add Environment Variables:
  - `MONGODB_URI`: Your MongoDB Atlas connection URI.
  - `JWT_SECRET`: A secure random production secret key.

### 3. Frontend (Vercel / Netlify)
- Deploy `frontend` as a static web application.
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Add Environment Variable:
  - `VITE_API_BASE_URL`: The deployed backend URL from Render (e.g., `https://qr-attendance-backend.onrender.com`).
- Single Page Application (SPA) routing is pre-configured via `vercel.json` and `_redirects` to avoid 404 errors on page refresh.