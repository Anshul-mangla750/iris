# RetailEdge AI — Backend Integration & API Handoff Contract

This document provides the integration contract between the Frontend and Backend teams for RetailEdge AI.
It is categorized by integration status:
- **`IMPLEMENTED`**: Backend functionality deployed and actively integrated.
- **`CONTRACT ONLY`**: Frontend contract and types defined; awaiting backend endpoint readiness.
- **`PENDING`**: Future capability scheduled for subsequent phases.

---

## Summary of Integration Status

| Category | Endpoint / Capability | Frontend Status | Backend Status |
| :--- | :--- | :--- | :--- |
| **CONTRACT ONLY** | `POST /api/auth/login` | Complete in `authService.ts` | Ready for endpoint wiring |
| **CONTRACT ONLY** | `GET /api/auth/me` | Complete in `AuthContext.tsx` | Ready for endpoint wiring |
| **CONTRACT ONLY** | `POST /api/auth/logout` | Complete in `authService.ts` | Ready for endpoint wiring |
| **PENDING** | `GET /api/auth/google` (OAuth) | UI Complete in `SocialLoginButton.tsx` | Pending OAuth credentials & callback setup |
| **PENDING** | `GET /api/auth/microsoft` (OAuth) | UI Complete in `SocialLoginButton.tsx` | Pending Azure AD tenant setup |
| **PENDING** | `POST /api/auth/forgot-password` | Placeholder Notice in `LoginForm.tsx` | Pending email dispatcher & reset token flow |

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
- **Category**: `CONTRACT ONLY`
- **Trigger**: User enters credentials and clicks "Sign In →".
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Payload**:
  ```typescript
  interface LoginRequestBody {
    email: string;       // Normalized lowercase email, e.g. "sarah.j@store.com"
    password: string;    // Plaintext password (min 6 characters)
    rememberMe?: boolean; // Whether user requested persistent session (30 days vs session)
  }
  ```
- **Expected Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "usr_68f8a10bc",
      "name": "Sarah Jenkins",
      "email": "sarah.j@store.com",
      "role": "STORE_MANAGER",
      "organizationId": "org_supermart_01",
      "organizationName": "SuperMart West End"
    },
    "token": "optional_jwt_token_string"
  }
  ```
- **Cookie Specification (Preferred for Security)**:
  - If using HTTP-only cookies, the backend should set:
    ```http
    Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
    ```
  - The frontend Axios instance is configured with `withCredentials: true` to transmit cookies automatically.
- **Expected Error Responses**:
  - `400 Bad Request`:
    ```json
    { "message": "Email and password are required." }
    ```
  - `401 Unauthorized`:
    ```json
    { "message": "Invalid email or password." }
    ```
  - `403 Forbidden`:
    ```json
    { "message": "Your organization account is suspended or inactive." }
    ```
  - `500 Internal Server Error`:
    ```json
    { "message": "Internal server error. Please try again shortly." }
    ```

---

### `GET /api/auth/me`
- **Category**: `CONTRACT ONLY`
- **Trigger**: Executed on frontend application bootstrap in `AuthContext.tsx` to verify existing session.
- **Expected Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "usr_68f8a10bc",
      "name": "Sarah Jenkins",
      "email": "sarah.j@store.com",
      "role": "STORE_MANAGER",
      "organizationId": "org_supermart_01"
    }
  }
  ```
- **Expected Failure Response (`401 Unauthorized`)**:
  - Backend responds with `401` when no valid cookie or session exists.
  - Frontend silently marks user as unauthenticated and displays the login card.

---

### `POST /api/auth/logout`
- **Category**: `CONTRACT ONLY`
- **Trigger**: User clicks "Sign Out" from any portal header.
- **Expected Response (`200 OK`)**:
  - Backend clears the session cookie:
    ```http
    Set-Cookie: token=; HttpOnly; Max-Age=0; Path=/
    ```
  ```json
  { "message": "Logged out successfully." }
  ```

---

## 2. Role Taxonomy & Authorization Guards

The frontend expects the backend `role` field on the `User` object to match one of the following strings:

| Role String | Target Frontend Route | Description |
| :--- | :--- | :--- |
| `ADMIN` | `/admin` | Root access across all stores, camera fleets, and org settings |
| `REGIONAL_MANAGER` | `/manager` | Multi-store regional supervisory dashboard |
| `STORE_MANAGER` (or `MANAGER`) | `/manager` | Single-store operations, inventory, and queue management |
| `STAFF` | `/staff` | Store floor mobile and terminal task view |

---

## 3. Pending OAuth & Self-Service Features

### Google Single Sign-On
- **Category**: `PENDING`
- **Frontend State**: UI button with official Google SVG logo rendered.
- **Required Backend Delivery**:
  - OAuth client registration with Google Cloud Console.
  - Backend endpoint `GET /api/auth/google` initiating Google OAuth redirect.
  - Callback handler `GET /api/auth/google/callback` issuing JWT session cookie.

### Microsoft Single Sign-On
- **Category**: `PENDING`
- **Frontend State**: UI button with official Microsoft 4-square SVG logo rendered.
- **Required Backend Delivery**:
  - Azure Active Directory / Entra app registration.
  - Backend endpoint `GET /api/auth/microsoft`.
  - Callback handler setting JWT session cookie.

### Self-Service Password Reset
- **Category**: `PENDING`
- **Frontend State**: Informative fallback message directing the user to their administrator.
- **Required Backend Delivery**:
  - `POST /api/auth/forgot-password` (accepts `{ email: string }`).
  - Secure time-limited token email delivery.
  - `POST /api/auth/reset-password` (accepts `{ token: string, newPassword: string }`).

---

## 4. Frontend Configuration Reference

The frontend API client is configured via the environment variable:
```env
VITE_API_URL=http://localhost:5000/api
```
If `VITE_API_URL` is omitted, the client defaults to `/api`, which can be proxied through Vite or an Nginx reverse proxy.

---

## 5. Landing Page Integration

### Landing Page
- **Backend Dependency**: Minimal.
- **Required Authentication Destination**: `/login`
- **Actual Authentication Endpoint**: `POST /api/auth/login`
- **Important**:
  The landing page itself does not require authenticated API calls. All metrics and statistics displayed on the landing page (sales, visitor counts, store totals, uptime) are static marketing values defined in `landingData.ts`. Real analytics and telemetry endpoints (`/api/analytics/*`, `/api/inventory/*`, `/api/queue/*`, `/api/alerts/*`) are only invoked within protected authenticated dashboard portals.

