# POS/ERP Integration — Backend Handoff & API Contracts

This document outlines the API contracts, data flows, and security guidelines for connecting external POS/ERP systems with the RetailEdge AI backend.

---

## 1. Integration Architecture & Data Flow

External Point-of-Sale (POS) and Enterprise Resource Planning (ERP) systems communicate with the RetailEdge AI platform via an intermediate integration layer or webhook ingress gateway.

```
+--------------------+        +---------------------------+        +--------------------------+
|  POS Systems       |        |                           |        |                          |
|  (EasyPOS, Pine    |------->|   RetailEdge Ingress      |------->|   RetailEdge AI Core     |
|   Labs, Shopify)   |        |   Gateway / Middleware    |        |   Backend (Node/Python)  |
+--------------------+        |   - Webhooks Handler      |        +--------------------------+
                              |   - Rate Limiting         |                     |
+--------------------+        |   - Schema Normalization  |                     v
|  ERP Systems       |------->|   - Auth & Signature      |        +--------------------------+
|  (SAP S/4HANA,     |        |     Verification          |        | Downstream Modules:      |
|   Tally Prime)     |        +---------------------------+        | - Inventory Monitoring   |
+--------------------+                                             | - Products & Planogram   |
                                                                   | - Queue Intelligence     |
                                                                   | - Alerts & Ops Center    |
                                                                   +--------------------------+
```

> **Security Rule**: The frontend NEVER connects directly to SAP, Tally, or POS terminals. All communications pass through authenticated RetailEdge backend endpoints. Never hardcode or store API secrets in frontend storage.

---

## 2. Status of Endpoints

| Method | Endpoint | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/integrations/summary` | Retrieve KPI metrics and trends | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations` | List configured integrations | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations/:id` | Get details of a single integration | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/integrations` | Register a new integration | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/integrations/:id` | Update configuration & status | CONTRACT ONLY (Mocked in client) |
| `DELETE`| `/api/integrations/:id` | Remove an integration | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/integrations/:id/test` | Test external system connectivity | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/integrations/:id/sync` | Trigger immediate manual sync | CONTRACT ONLY (Mocked in client) |
| `POST`| `/api/integrations/:id/disable` | Toggle/disable an integration | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations/transactions` | Query recent POS transactions | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations/transactions/:id` | Get specific transaction payload | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations/sync-overview` | Get historical sync metrics | CONTRACT ONLY (Mocked in client) |
| `GET` | `/api/integrations/settings` | Query configuration categories | CONTRACT ONLY (Mocked in client) |
| `PATCH`| `/api/integrations/settings` | Update configuration category | CONTRACT ONLY (Mocked in client) |

---

## 3. Detailed Endpoint Contracts

### 3.1 `GET /api/integrations/summary`
- **Query Params**: `storeId` (optional, string)
- **Response `200 OK`**:
```json
{
  "totalTransactions": 2854,
  "totalSales": 428760,
  "itemsSynced": 1248,
  "syncSuccessRate": 99.2,
  "syncErrors": 8,
  "trends": {
    "totalTransactions": 12,
    "totalSales": 8,
    "itemsSynced": 15,
    "syncSuccessRate": 0.8,
    "syncErrors": -60
  }
}
```

### 3.2 `GET /api/integrations`
- **Query Params**: `storeId` (string), `type` (optional), `status` (optional)
- **Response `200 OK`**:
```json
[
  {
    "id": "int-001",
    "organizationId": "org-001",
    "storeId": "store-001",
    "name": "POS - EasyPOS",
    "type": "POS",
    "provider": "EasyPOS",
    "connectionType": "API",
    "status": "CONNECTED",
    "lastSyncAt": "24 Sep 2024, 03:22 PM",
    "syncFrequency": "Real-time",
    "icon": "/images/integrations/icon_easypos.png"
  }
]
```

### 3.3 `POST /api/integrations`
- **Request Body**:
```json
{
  "storeId": "store-001",
  "name": "POS - Pine Labs",
  "type": "POS",
  "provider": "Pine Labs POS",
  "connectionType": "API",
  "syncFrequency": "Real-time",
  "config": {
    "baseUrl": "https://api.pinelabs.internal/v1",
    "apiKey": "masked_or_encrypted_token"
  }
}
```

### 3.4 `GET /api/integrations/transactions`
- **Query Params**: `storeId` (string), `startDate` (ISO), `endDate` (ISO), `limit` (number)
- **Response `200 OK`**:
```json
[
  {
    "id": "tx-001",
    "transactionId": "TRX78932",
    "storeId": "store-001",
    "timestamp": "03:24 PM",
    "itemCount": 5,
    "amount": 1250,
    "currency": "INR",
    "paymentMode": "UPI",
    "syncStatus": "Synced",
    "posSource": "POS Terminal 01",
    "createdAt": "2024-09-24T15:24:00Z"
  }
]
```

---

## 4. Real-time WebSocket Ingress Events

When the backend integration worker completes or detects state changes, it broadcasts via Socket.IO:

| Event | Payload Example | Impact on Frontend |
| :--- | :--- | :--- |
| `integration.connected` | `{ "id": "int-001", "name": "POS - EasyPOS" }` | Updates status badge to Connected |
| `integration.disconnected` | `{ "id": "int-005", "reason": "Timeout" }` | Sets status to Not Connected, triggers Alert |
| `integration.sync_completed` | `{ "id": "int-001", "syncedCount": 42 }` | Updates Last Sync timestamp and KPI cards |
| `transaction.synced` | `{ "transactionId": "TRX78933", "amount": 950 }` | Prepends to Recent Transactions table |

---

## 5. Role-Based Access Control (RBAC)

- **`ADMIN`**: Full permissions — Add, edit, configure credentials, test connections, trigger sync, disable integrations.
- **`STORE_MANAGER`**: View integrations and transactions for their assigned store, trigger manual sync.
- **`STAFF`**: Read-only visibility into integration status and sync health.
