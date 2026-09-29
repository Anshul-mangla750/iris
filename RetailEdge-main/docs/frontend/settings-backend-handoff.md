# Settings Module — Backend Integration & Handoff Guide

## 1. Domain Overview
The Settings module manages tenant-level organization preferences, store operating constraints, alert notification routing, external service connectors, AI edge inference rules, security guardrails, and platform maintenance routines.

---

## 2. Entity Relationship Hierarchy
```
Organization (Tenant Scope)
│
├── General Settings (Timezone, Currency, Localization)
│
├── Store Settings (Default Store, Hours, Thresholds) [Scoped by storeId]
│
├── Notification Preferences (Inventory, Queue, Planogram, System, Daily Reports)
│
├── Security Configuration (2FA, Sessions, Password Policy, IP Allowlist)
│
├── Integration Connectors (POS, ERP, SMS, WhatsApp, Mail, Weather, Maps)
│
├── AI Vision Settings (Inference Mode, PII Masking, Retention, Confidence)
│
└── System Maintenance (Software Version, Cloud Backups, DB Optimization, Cache)
```

---

## 3. Endpoints & API Contracts

### 3.1 Platform Settings Bundle
- **Endpoint**: `GET /api/settings`
- **Method**: `GET`
- **Description**: Returns all settings categories for the current tenant.
- **RBAC**: `SUPER_ADMIN`, `ADMIN`, `STORE_MANAGER` (Read-only for Store Manager).
- **Response**:
```json
{
  "general": {
    "organizationName": "RetailEdge AI",
    "timezone": "Asia/Kolkata (GMT+5:30)",
    "dateFormat": "DD MMM YYYY (24 Sep 2024)",
    "currency": "INR (₹) - Indian Rupee",
    "language": "English"
  },
  "store": {
    "defaultStoreId": "Store 001 - City Mall, Delhi",
    "operatingHours": {
      "open": "09:00 AM",
      "close": "10:00 PM"
    },
    "defaultPlanogramId": "Snacks - Standard",
    "autoStockAlertThreshold": 10,
    "queueAlertThreshold": 10
  },
  "notifications": {
    "inventory": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
    "queue": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
    "planogram": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
    "system": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
    "dailyReports": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } }
  },
  "security": {
    "twoFactorEnabled": true,
    "sessionTimeoutMinutes": 30,
    "auditLoggingEnabled": true,
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "expirationDays": 90
    },
    "allowedIps": ["192.168.1.100", "10.0.0.1/24"]
  },
  "systemStatus": {
    "systemHealth": "HEALTHY",
    "dataSync": "UP_TO_DATE",
    "lastSyncTimestamp": "24 Sep 2024, 03:20 PM",
    "security": "PROTECTED",
    "twoFactorEnabled": true,
    "storageUsedPercent": 62,
    "storageUsedGB": 12.4,
    "storageTotalGB": 20.0
  },
  "maintenance": {
    "softwareVersion": "v2.4.1",
    "versionStatus": "UP_TO_DATE",
    "lastBackupAt": "24 Sep 2024, 02:00 AM",
    "databaseSizeGB": 12.4,
    "cacheSizeMB": 480
  },
  "ai": {
    "processingMode": "Edge",
    "privacyMode": true,
    "dataRetentionDays": 30,
    "confidenceThreshold": 80,
    "features": {
      "shopperAnalytics": true,
      "queuePrediction": true,
      "inventoryDetection": true,
      "planogramDetection": true,
      "aiInsights": true
    }
  }
}
```

---

### 3.2 Update General Settings
- **Endpoint**: `PATCH /api/settings/general`
- **RBAC**: `SUPER_ADMIN`, `ADMIN`
- **Request Body**:
```json
{
  "organizationName": "RetailEdge AI",
  "timezone": "Asia/Kolkata (GMT+5:30)",
  "dateFormat": "DD MMM YYYY (24 Sep 2024)",
  "currency": "INR (₹) - Indian Rupee",
  "language": "English"
}
```

---

### 3.3 Update Store Settings
- **Endpoint**: `PATCH /api/settings/store?storeId={storeId}`
- **RBAC**: `SUPER_ADMIN`, `ADMIN`, `STORE_MANAGER`
- **Request Body**:
```json
{
  "defaultStoreId": "Store 001 - City Mall, Delhi",
  "operatingHours": {
    "open": "09:00 AM",
    "close": "10:00 PM"
  },
  "defaultPlanogramId": "Snacks - Standard",
  "autoStockAlertThreshold": 10,
  "queueAlertThreshold": 10
}
```

---

### 3.4 Notification Routing
- **Endpoint**: `PATCH /api/settings/notifications`
- **RBAC**: `SUPER_ADMIN`, `ADMIN`, `STORE_MANAGER`
- **Request Body**:
```json
{
  "inventory": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
  "queue": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
  "planogram": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
  "system": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } },
  "dailyReports": { "enabled": true, "channels": { "email": true, "sms": true, "inApp": true } }
}
```

---

### 3.5 Integration Management
- **Endpoints**:
  - `GET /api/settings/integrations`: Returns list of configured and unconfigured integrations.
  - `PATCH /api/settings/integrations/:id`: Updates connection credentials, base URLs, or authentication keys.
  - `POST /api/settings/integrations/:id/test`: Executes live ping test against third-party provider endpoint.
- **Security Rule**: API keys, access tokens, and passwords MUST be encrypted at rest in the database (e.g., AES-256-GCM) and masked when sent to frontend (`pos_live_****************9a2f`).

---

### 3.6 Maintenance & System Diagnostics
- **`POST /api/settings/system/backup`**:
  - Triggers asynchronous database and configuration snapshot.
  - Returns timestamp and archive location.
- **`POST /api/settings/system/clear-cache`**:
  - Issues Redis `FLUSHDB` or selective key purge for stale query results.
  - Returns freed memory in MB.
- **`POST /api/settings/reset`**:
  - Reverts configuration records to initial seed values.

---

## 4. Real-Time Socket Events
The backend can broadcast configuration updates to active connected clients:
- `settings.updated`: Triggers refresh of general/store settings across browser windows.
- `notification.preferences.updated`: Syncs alert dispatch routes.
- `integration.status.updated`: Emits live connection state transitions (`CONNECTED` / `NOT_CONNECTED`).
- `system.backup.completed`: Notifies administrators when scheduled or on-demand backups finish.
