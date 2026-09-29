# Store Backend Integration Guide

This guide details how the Store Management frontend module (`/stores`) communicates with the backend via the centralized `src/services/storeService.ts` layer.

---

## Architecture Flow

```
UI Components (StoreManagementPage, StoreTable, AddStoreModal, etc.)
  │
  ▼
useStores Hook (State management, query caching, filtering)
  │
  ▼
storeService.ts (Encapsulated API requests with graceful local fallback)
  │
  ▼
Backend REST API (/api/stores/*)
```

---

## API Endpoints Specification

### 1. List Stores with Filtering and Pagination
- **Method**: `GET`
- **Path**: `/api/stores`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Retrieve a paginated list of stores filtered by keyword search, region, status, and sorted accordingly.
- **Query Parameters**:
  - `search` (string, optional): Search keyword against store name, city, code, address.
  - `region` (string, optional): e.g. `'North'`, `'South'`, `'East'`, `'West'`.
  - `status` (string, optional): e.g. `'ONLINE'`, `'ALERT'`, `'OFFLINE'`, `'MAINTENANCE'`.
  - `page` (number, default: 1): 1-indexed page number.
  - `limit` (number, default: 5): Number of items per page.
  - `sortBy` (string, default: 'sales'): Field to sort by (`name`, `footfall`, `sales`, `lastUpdatedAt`).
  - `sortOrder` (string, default: 'desc'): `'asc'` or `'desc'`.
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "store-001",
        "name": "Store 001 - City Mall",
        "code": "Store 001",
        "city": "Delhi",
        "region": "North",
        "status": "ONLINE",
        "footfall": 2854,
        "footfallTrend": 12,
        "sales": 428760,
        "salesTrend": 8,
        "devicesOnline": 22,
        "devicesTotal": 24,
        "lastUpdatedAt": "24 Sep 2024, 03:24 PM"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 5,
      "totalPages": 3
    }
  }
  ```
- **Security / RBAC**:
  - Requires Bearer Token in `Authorization` header.
  - Scoped to user's `organizationId` from authenticated token context.
  - Role: `ADMIN` receives all organization stores; `STORE_MANAGER` receives assigned stores.

---

### 2. Get Executive Store Summary (KPIs)
- **Method**: `GET`
- **Path**: `/api/stores/summary`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Fetch top-line metrics: total stores, active stores, stores with alerts, average footfall, average sales per store, and their corresponding trends.
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "totalStores": 12,
      "activeStores": 11,
      "storesWithAlerts": 3,
      "averageFootfall": 2854,
      "averageSalesPerStore": 428760,
      "trends": {
        "totalStores": 20,
        "activeStores": 10,
        "storesWithAlerts": -40,
        "averageFootfall": 12,
        "averageSalesPerStore": 8
      }
    }
  }
  ```

---

### 3. Get Store Performance
- **Method**: `GET`
- **Path**: `/api/stores/performance`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Fetch top store rankings for horizontal bar visualization.
- **Query Parameters**:
  - `metric` (string, default: 'salesRevenue'): `salesRevenue` | `footfall` | `orders` | `averageTransactionValue` | `conversionRate`.
  - `limit` (number, default: 10): Top N stores to retrieve.
- **Response Shape**: Array of `StorePerformanceItem`.

---

### 4. Get Aggregated Device Health
- **Method**: `GET`
- **Path**: `/api/stores/device-health`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Fetch hardware device availability metrics (Cameras, Edge Devices, POS, Network).
- **Response Shape**:
  ```json
  {
    "success": true,
    "data": {
      "cameras": { "category": "Cameras", "total": 96, "online": 88, "offline": 8, "status": "ONLINE", "label": "● Online" },
      "edgeDevices": { "category": "Edge Devices", "total": 12, "online": 12, "offline": 0, "status": "ONLINE", "label": "● Online" },
      "posSystems": { "category": "POS Systems", "total": 12, "online": 10, "offline": 2, "status": "WARNING", "label": "● 2 Offline" },
      "network": { "category": "Network", "total": 12, "online": 11, "offline": 1, "status": "ONLINE", "label": "● Online" }
    }
  }
  ```

---

### 5. Get Individual Store Details
- **Method**: `GET`
- **Path**: `/api/stores/:id`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Fetch single store operational details for the inspection drawer or detail page.

---

### 6. Create Store
- **Method**: `POST`
- **Path**: `/api/stores`
- **Status**: `MOCK / READY FOR BACKEND`
- **Purpose**: Provision a new retail location.
- **Request Body**:
  ```json
  {
    "name": "Store 013 - Galleria Mall",
    "code": "Store 013",
    "address": "DLF Phase 4",
    "city": "Gurgaon",
    "state": "Haryana",
    "country": "India",
    "region": "North",
    "timezone": "Asia/Kolkata",
    "status": "ONLINE"
  }
  ```
- **RBAC**: Requires `ADMIN` role.

---

### 7. Update Store
- **Method**: `PATCH`
- **Path**: `/api/stores/:id`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Update store metadata, configuration, or operational status.

---

### 8. Delete Store
- **Method**: `DELETE`
- **Path**: `/api/stores/:id`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Decommission or archive a store.
- **RBAC**: Requires `ADMIN` role.

---

## Error Handling & Resiliency

All endpoints are wrapped in `storeService.ts`:
1. Network requests check `response.ok`.
2. On 401 Unauthorized, redirect to `/login`.
3. If the backend API endpoint is unavailable or returns 404/500, `storeService.ts` smoothly falls back to rich mock data to guarantee uninterrupted UI operation and demo readiness.
