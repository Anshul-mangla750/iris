# Store Real-Time Integration Guide

This document defines the WebSocket / Socket.IO event contract for real-time telemetry updates on the RetailEdge AI Store Management page (`/stores`).

---

## Supported Events

### 1. `store.created`
- **Direction**: Server → Client
- **Description**: Emitted when an administrator creates a new store location.
- **Payload**:
  ```json
  {
    "store": {
      "id": "store-013",
      "name": "Store 013 - DLF Promenade",
      "code": "Store 013",
      "city": "Delhi",
      "region": "North",
      "status": "ONLINE",
      "footfall": 0,
      "sales": 0,
      "devicesOnline": 0,
      "devicesTotal": 0
    }
  }
  ```
- **Frontend Behavior**:
  - Increments `totalStores` and `activeStores` in KPI summary.
  - Prepends or inserts new store into local store state and refreshes table.
  - Adds marker to Delhi-NCR map.

---

### 2. `store.updated`
- **Direction**: Server → Client
- **Description**: Emitted when a store's metadata, manager, or address changes.
- **Payload**:
  ```json
  {
    "storeId": "store-001",
    "updates": {
      "manager": "Aarav Sharma",
      "phone": "+91 98111 22334"
    }
  }
  ```
- **Frontend Behavior**:
  - Updates store in-memory in `allStores` and visible `stores` list.
  - Updates selected store drawer if currently open.

---

### 3. `store.status_updated`
- **Direction**: Server → Client
- **Description**: Emitted when a store transitions between `ONLINE`, `ALERT`, `OFFLINE`, or `MAINTENANCE`.
- **Payload**:
  ```json
  {
    "storeId": "store-003",
    "previousStatus": "ONLINE",
    "newStatus": "ALERT",
    "reason": "Queue congestion threshold exceeded at billing counters",
    "timestamp": "2024-09-24T15:28:00Z"
  }
  ```
- **Frontend Behavior**:
  - Updates status badge in store table.
  - Changes map marker pin color from green to red (alert).
  - Recalculates Store Status donut distribution chart.
  - Updates `storesWithAlerts` KPI card.

---

### 4. `store.device_status_updated`
- **Direction**: Server → Client
- **Description**: Emitted when edge devices, cameras, or POS counters go offline or come back online.
- **Payload**:
  ```json
  {
    "storeId": "store-001",
    "deviceCategory": "posSystems",
    "online": 5,
    "total": 6,
    "offlineDevices": ["POS-04"]
  }
  ```
- **Frontend Behavior**:
  - Updates store device ratio in table (`22 / 24`).
  - Refreshes aggregated Device Health 4-box card (`Cameras`, `Edge Devices`, `POS Systems`, `Network`).
  - Updates Device Health modal details table.

---

### 5. `store.alert_created`
- **Direction**: Server → Client
- **Description**: Emitted when a high-priority alert is generated for a store.
- **Payload**:
  ```json
  {
    "alertId": "alert-894",
    "storeId": "store-003",
    "severity": "CRITICAL",
    "title": "Camera Feed Interrupted: Checkout Zone 2",
    "timestamp": "2024-09-24T15:30:00Z"
  }
  ```
- **Frontend Behavior**:
  - Sets store status to `ALERT` if not already set.
  - Increments unread alert counter in navigation sidebar.
