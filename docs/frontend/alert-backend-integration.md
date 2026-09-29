# RetailEdge AI Alert Backend Integration Guide

This document defines the REST API endpoints and payload schemas required by the frontend Operations Center (`/alerts`).

---

## 1. List Alerts
**Endpoint:** `GET /api/alerts`

### Query Parameters
- `severity`: Comma-separated list (`CRITICAL,WARNING,INFO`)
- `category` or `sourceModule`: Comma-separated list (`INVENTORY,QUEUE,PLANOGRAM,SHOPPER,SYSTEM`)
- `status`: Comma-separated list (`OPEN,ACKNOWLEDGED,RESOLVED,IGNORED`)
- `storeId`: Target store identifier or `all`
- `timeRange`: e.g. `24h`, `7d`, `30d`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Case-insensitive text filter across message, product, and location

### Response (200 OK)
```json
{
  "alerts": [
    {
      "id": "alt-001",
      "organizationId": "org-001",
      "storeId": "str-001",
      "storeName": "Store 001 - City Mall, Delhi",
      "type": "OUT_OF_STOCK",
      "severity": "CRITICAL",
      "message": "Coca Cola 500ml out of stock",
      "status": "OPEN",
      "createdAt": "03:24 PM, 24 Sep 2024",
      "sourceModule": "INVENTORY",
      "location": "Aisle 2 - Beverages",
      "product": "Coca Cola 500ml (SKU: COC002)",
      "currentStock": "0 units",
      "expectedStock": "8 units",
      "camera": "Camera 1",
      "confidence": "96%",
      "recommendations": [
        "Restock Coca Cola 500ml immediately",
        "Check backroom inventory",
        "Notify store staff"
      ],
      "history": [
        {
          "timestamp": "03:24 PM",
          "action": "Alert created",
          "description": "Out of stock detected",
          "dotColor": "red"
        }
      ]
    }
  ],
  "total": 28,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

## 2. Alert Details
**Endpoint:** `GET /api/alerts/:id`

### Response (200 OK)
Returns a single `Alert` entity including full history, image snapshots, and recommendation breakdown.

---

## 3. Summary Statistics
**Endpoint:** `GET /api/alerts/summary`

### Query Parameters
- `storeId`: Optional store scope

### Response (200 OK)
```json
{
  "total": 28,
  "critical": 5,
  "warning": 12,
  "info": 11,
  "resolved": 42,
  "trends": {
    "total": 12,
    "critical": 25,
    "warning": 8,
    "info": -15,
    "resolved": 30
  }
}
```

---

## 4. Status Transition Actions

### Acknowledge Alert (In Progress)
- **Method:** `PATCH /api/alerts/:id/acknowledge`
- **Payload:** `{}`
- **Behavior:** Transitions status from `OPEN` to `ACKNOWLEDGED`. Appends entry to `history`.

### Resolve Alert
- **Method:** `PATCH /api/alerts/:id/resolve`
- **Payload:** `{ "resolutionNote": "Restocked 8 units" }`
- **Behavior:** Transitions status to `RESOLVED`. Increments resolved KPI counter.

### Assign Alert
- **Method:** `PATCH /api/alerts/:id/assign`
- **Payload:** `{ "assignedTo": "Rahul Sharma" }`
- **Behavior:** Updates `assignedTo` field. Records staff assignment in history.

### Mark All Read
- **Method:** `POST /api/alerts/mark-all-read`
- **Payload:** `{ "storeId": "str-001" }`
- **Behavior:** Sets `isRead: true` across alerts for the specified store. Does NOT alter lifecycle status.

---

## 5. Security & Organization Scoping
- The frontend passes `Bearer <token>` via Axios interceptor.
- The backend must enforce tenant isolation and verify that the user's role has permission to access the requested `storeId`.
