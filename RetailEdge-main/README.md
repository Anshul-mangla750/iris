# Retail Intelligence Platform

[![Technology](https://img.shields.io/badge/Stack-JavaScript%20(ES%20Modules%20%2B%20JSX)-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Phase](https://img.shields.io/badge/Phase-7%20(Alert%20%26%20Operations%20Center)-rose.svg)]()
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%20(App%20Router)-black.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20Socket.IO-000000.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248.svg)](https://www.mongodb.com/)

An AI-ready, scalable Smart Retail Intelligence Platform engineered for the Smart Retail / SIH project.

> **PROJECT RULE - 100% JAVASCRIPT**:  
> This platform strictly uses **JavaScript** across both frontend (JSX) and backend (ES Modules). Zero TypeScript files (`.ts`, `.tsx`, `tsconfig.json`) or dependencies exist in this repository.

> **PHASE 7 NOTICE**:  
> Phase 7 implements the centralized **Alert & Operations Center** aggregating operational signals across Shopper (`HIGH_TRAFFIC`), Queue (`QUEUE_CONGESTION`), Inventory (`OUT_OF_STOCK`, `LOW_STOCK`, `PLANOGRAM_VIOLATION`), and System health (`EDGE_OFFLINE`). Features urgent action cards, alert KPIs, multi-attribute filtering, staff assignment, acknowledgment, and resolution workflows.  
> Detailed documentation is provided in [docs/alert-operations-center.md](docs/alert-operations-center.md).



---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Project Objective](#2-project-objective)
3. [Current Phase 1 Scope](#3-current-phase-1-scope)
4. [Technology Stack](#4-technology-stack)
5. [Monorepo Folder Structure](#5-monorepo-folder-structure)
6. [Authentication & RBAC Architecture](#6-authentication--rbac-architecture)
7. [Database Models](#7-database-models)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [Role Seeding](#9-role-seeding)
10. [Frontend Authentication Layer](#10-frontend-authentication-layer)
11. [Future AI Integration Contract](#11-future-ai-integration-contract)
12. [Local Development Setup](#12-local-development-setup)
13. [Docker Setup](#13-docker-setup)
14. [Environment Variables](#14-environment-variables)
15. [Future Development Phases](#15-future-development-phases)

---

## 1. Project Overview
The **Retail Intelligence Platform** is a multi-store intelligence system designed to empower store managers, operations personnel, and merchandisers with actionable, real-time insights derived from physical store cameras and IoT sensors.

---

## 2. Project Objective
Eventually, the platform will deliver:
- **Shopper Analytics**: Footfall heatmaps, anonymous customer journey tracking, dwell times, and conversion funnels.
- **Queue Intelligence**: Checkout line detection, queue length metrics, and automated cashier allocation alerts.
- **Inventory Intelligence**: Real-time shelf out-of-stock and low-stock detection.
- **Store Operational Analytics**: Peak hour predictions, staff efficiency metrics, and store benchmark reporting.
- **Real-Time Alert Dispatcher**: Immediate notifications sent to store staff dashboards and mobile devices.
- **Edge AI & Privacy**: Anonymized on-premise vision inference safeguarding shopper privacy.

---

## 3. Current Phase 1 Scope
Phase 1 delivers the full **Authentication & User Management Foundation**:
- **Organization Tenant Model**: Organization representation with slug indexing and status flags.
- **Role & Permission Models**: `ADMIN`, `STORE_MANAGER`, `STAFF` with granular permissions.
- **User Model**: Bcrypt password hashing, normalized email indexing, role/org associations.
- **JWT in HTTP-Only Cookies**: Secure, SameSite, HTTP-only cookie session management (no tokens in `localStorage`).
- **RBAC Middleware**: Reusable role (`requireRole`) and permission (`requirePermission`) route guards.
- **Authentication APIs**: Signup, Login, Logout, Session check (`/api/auth/me`), Profile (`/api/users/profile`).
- **Frontend Portals & Protected Routes**: Clean Next.js JSX pages for `/login`, `/signup`, `/profile`, `/admin`, `/manager`, `/staff`.

---

## 4. Technology Stack

### Core Decision: 100% JavaScript Ecosystem
- **Frontend**: Next.js 15 (App Router), React 19, JavaScript (JSX), Tailwind CSS, Lucide React, Socket.IO Client.
- **Backend**: Node.js 22, Express.js 4 (ES Modules), Socket.IO 4, Zod, BcryptJS, JsonWebToken, Cookie-Parser, Helmet, CORS, Dotenv.
- **Database**: MongoDB 7.0 with Mongoose 8.
- **DevOps**: Docker, Docker Compose.

---

## 5. Monorepo Folder Structure

```
retail-intelligence/
├── frontend/                     # Next.js App Router Web Application
│   ├── app/                      # App Router pages & portals
│   │   ├── admin/page.jsx        # Protected ADMIN portal placeholder
│   │   ├── login/page.jsx        # Login page with role-based redirects
│   │   ├── manager/page.jsx      # Protected STORE_MANAGER portal placeholder
│   │   ├── profile/page.jsx      # User profile view & safe field editing
│   │   ├── signup/page.jsx       # Public signup creating Org + Manager
│   │   ├── staff/page.jsx        # Protected STAFF portal placeholder
│   │   ├── layout.jsx            # Root layout with AuthProvider & Navbar
│   │   ├── page.jsx              # Phase 0/1 platform landing page
│   │   └── globals.css           # Tailwind CSS directives
│   ├── components/               # Navbar.jsx, ProtectedRoute.jsx
│   ├── features/auth/            # AuthContext.jsx
│   ├── hooks/                    # useAuth.js, useSocket.js
│   ├── lib/                      # api-client.js (credentials: include)
│   ├── services/                 # authService.js, socket.js
│   ├── config/env.js             # Centralized environment config
│   ├── .env.example              # Frontend environment template
│   ├── Dockerfile                # Next.js standalone runner Dockerfile
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Node.js + Express API & WebSocket Server
│   ├── src/
│   │   ├── config/               # db.js, env.js (JWT validation)
│   │   ├── controllers/          # auth.controller.js, user.controller.js, health/event
│   │   ├── middleware/           # authMiddleware.js, roleMiddleware.js, errorHandler.js
│   │   ├── models/               # User.js, Role.js, Organization.js
│   │   ├── routes/               # auth.routes.js, user.routes.js, health, event
│   │   ├── scripts/              # seedRoles.js (idempotent role seeder)
│   │   ├── services/             # auth.service.js, user.service.js, health
│   │   ├── utils/                # logger.js
│   │   ├── websocket/            # socket.js
│   │   ├── app.js                # Express app setup with cookieParser & helmet
│   │   └── server.js             # HTTP server entrypoint & role seeding call
│   ├── .env.example              # Backend environment template
│   ├── Dockerfile                # Backend container Dockerfile
│   └── package.json              # Backend dependencies (type: module)
│
├── database/                     # Database architecture & planning
│   └── README.md                 # Schema specifications
│
├── shared/                       # Shared contracts & constants
│   ├── constants/events.js       # Event channel & type constants
│   ├── schemas/events.js         # Zod schemas for event payload validation
│   └── README.md                 # Shared module documentation
│
├── docs/                         # Technical documentation
│   ├── authentication.md         # Detailed authentication & RBAC specification
│   ├── ai-integration.md         # Event contracts for independent AI team
│   ├── architecture.md           # Architecture diagrams & rules
│   └── development.md            # Local setup guide
│
├── docker-compose.yml            # Multi-service container orchestrator
├── .gitignore                    # Global gitignore
└── README.md                     # Root project documentation
```

---

## 6. Authentication & RBAC Architecture

- **Public Signup**: Creates an `Organization` and provisions the initial account with the **`STORE_MANAGER`** role. `ADMIN` accounts cannot be created via public signup.
- **JWT in HTTP-Only Cookies**: Tokens are issued on `/signup` and `/login` into an `httpOnly`, `secure` (in production), `SameSite: 'lax'` cookie named `token`. No tokens are stored in `localStorage` or `sessionStorage`.
- **RBAC Roles**:
  - `ADMIN`: Full organization-wide management (`organization.manage`, `users.manage`, `stores.manage`, etc.)
  - `STORE_MANAGER`: Store-level operations and operational analytics.
  - `STAFF`: Floor tasks and alert monitoring.

*See [docs/authentication.md](docs/authentication.md) for full architectural flow diagrams and policy details.*

---

## 7. Database Models

- **`Organization`** (`backend/src/models/Organization.js`): Tenant model with `name`, unique `slug`, `email`, `phone`, and `status` (`ACTIVE`, `SUSPENDED`).
- **`Role`** (`backend/src/models/Role.js`): Role definitions with `name` (`ADMIN`, `STORE_MANAGER`, `STAFF`), `description`, and `permissions` array.
- **`User`** (`backend/src/models/User.js`): User model with bcrypt password hashing (10 salt rounds), password excluded from default queries, lowercase unique `email`, `role` reference, and `organization` reference.

---

## 8. API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/signup`: Registers user + organization, sets HTTP-only cookie.
- `POST /api/auth/login`: Authenticates credentials, sets HTTP-only cookie.
- `POST /api/auth/logout`: Clears authentication cookie.
- `GET /api/auth/me`: Returns current user, role, and organization.
- `GET /api/auth/protected-test`: Verifies authentication.
- `GET /api/auth/admin-test`: Verifies `ADMIN` authorization.
- `GET /api/auth/manager-test`: Verifies `STORE_MANAGER` or `ADMIN` authorization.
- `GET /api/auth/staff-test`: Verifies `STAFF`, `STORE_MANAGER`, or `ADMIN` authorization.

### User Endpoints (`/api/users`)
- `GET /api/users/profile`: Retrieves user profile and assigned permissions.
- `PATCH /api/users/profile`: Updates `firstName` and `lastName` only.

---

## 9. Role Seeding

System roles are seeded idempotently with default permissions:
```bash
cd backend
npm run seed:roles
```
*Note: Default roles are also automatically verified and seeded during backend server startup in `server.js`.*

---

## 10. Frontend Authentication Layer

- **`AuthContext.jsx` & `useAuth.js`**: React context automatically restoring session state on page refresh via `GET /api/auth/me`.
- **`ProtectedRoute.jsx`**: Protects client routes and displays an informative Access Restricted banner if the role is unauthorized.
- **Portals**:
  - `/admin`: Restricted to `ADMIN`
  - `/manager`: Accessible by `STORE_MANAGER` and `ADMIN`
  - `/staff`: Accessible by `STAFF`, `STORE_MANAGER`, and `ADMIN`
  - `/profile`: Authenticated user profile editor

---

## 11. Future AI Integration Contract
The external AI/Edge system communicates exclusively through backend ingestion contracts (`/api/events/*`). Full specifications in [docs/ai-integration.md](docs/ai-integration.md).

---

## 12. Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed:roles  # Seed roles into MongoDB
npm run dev         # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Starts Next.js on http://localhost:3000
```

---

## 13. Docker Setup
```bash
docker compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)
- MongoDB: `localhost:27017`

---

## 14. Environment Variables

### Backend (`backend/.env.example`)
```ini
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/retail_intelligence
FRONTEND_URL=http://localhost:3000
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (`frontend/.env.example`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## 15. Future Development Phases

- **Phase 1**: Authentication, User Management & RBAC (Completed).
- **Phase 2**: Store & Edge Device Provisioning, Floor Zones & Register Configuration.
- **Phase 3**: Real-Time Operational Dashboards, WebSocket Event Ingestion & Alerts.
- **Phase 4**: Historical Analytics, Footfall Heatmaps & Inventory Audits.
- **Phase 5**: Multi-Store Enterprise Rollout & Camera Vision AI Integration.
