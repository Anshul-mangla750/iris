# Users & Access — Backend Handoff & API Contracts

This document specifies the backend contracts, data structures, and security requirements for the Users & Access module of RetailEdge AI.

---

## 1. System Architecture & Entity Relationships

```
Organization
├── Users (User accounts assigned to organization)
│   ├── User Presence (ONLINE / OFFLINE)
│   └── User Store Access (Assigned store IDs)
├── Roles (Super Admin, Store Manager, Staff, etc.)
│   └── Role Permissions (module.action grants)
└── Activity Logs (Security and access audit trails)
```

> **Security Rule**: Frontend never sends or evaluates authorization boundaries. The backend must enforce organization isolation, store scoping, and role-based permissions on every authenticated API request. Never return password hashes, reset tokens, or private secrets to the client.

---

## 2. API Endpoints Contract Status

| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/summary` | Query total, active, inactive users, roles | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/users` | List users with search, role, store, status | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/users/:id` | Get single user profile | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/users` | Create new user and send invitation | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/users/:id` | Update user details and access scopes | CONTRACT ONLY (Mocked in client) |
| `DELETE`| `/api/users/:id` | Delete user record | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/users/:id/activate` | Activate user account | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/users/:id/deactivate` | Deactivate user account | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/users/:id/role` | Reassign user role | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/users/:id/stores` | Update assigned store IDs | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/roles` | List all defined roles | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/roles/:id` | Get details of a single role | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/roles` | Create new custom role | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/roles/:id` | Update role metadata | CONTRACT ONLY (Mocked in client) |
| `DELETE`| `/api/roles/:id` | Delete non-system role | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/roles/:id/duplicate` | Duplicate an existing role | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/permissions` | Get all system permission definitions | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/permissions/matrix` | Retrieve the Role x Module permission matrix | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/permissions` | Update permission matrix cell | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/access-control` | Get security policies and store scopes | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/access-logs` | Retrieve security and access audit logs | CONTRACT ONLY (Mocked in client) |

---

## 3. Sample Payloads

### 3.1 Sample User API Response
```json
{
  "id": "user_001",
  "organizationId": "org-001",
  "name": "Anshul Verma",
  "email": "anshul@retailedge.ai",
  "phone": "+91 98765 43210",
  "roleId": "role_super_admin",
  "roleName": "Super Admin",
  "storeIds": ["store-001", "store-002", "store-003"],
  "storeAccessText": "All Stores",
  "status": "ACTIVE",
  "presenceStatus": "ONLINE",
  "lastLoginAt": "2024-09-24T10:32:00Z",
  "createdAt": "2024-01-15T08:00:00Z"
}
```

### 3.2 Sample Role API Response
```json
{
  "id": "role_manager",
  "organizationId": "org-001",
  "name": "Store Manager",
  "description": "Manage store operations",
  "userCount": 6,
  "permissions": [
    "dashboard.view",
    "shopper.view",
    "inventory.view",
    "inventory.manage",
    "queues.manage"
  ],
  "storeScope": "ASSIGNED",
  "isSystemRole": true,
  "status": "ACTIVE"
}
```

### 3.3 Sample Activity Log Response
```json
{
  "id": "act-001",
  "userId": "user_001",
  "userName": "Anshul Verma",
  "action": "Logged in",
  "module": "Dashboard",
  "timestamp": "24 Sep 2024, 10:32 AM",
  "status": "SUCCESS"
}
```

---

## 4. Real-time Events (Socket.IO Ready)

The client subscribes to:
- `user.created`: Prepend user to table
- `user.updated`: Update user in place
- `user.activated` / `user.deactivated`: Update status badge without reload
- `role.updated`: Refresh role counts and permission matrix
- `access.activity`: Prepend to Recent Access Activity card
