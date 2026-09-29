# Store Data Contract

This document defines the TypeScript models and JSON payload contracts used by the RetailEdge AI Store Management frontend module (`/stores`).

---

## 1. Store Entity Contract

```typescript
export type StoreStatus = 'ONLINE' | 'ALERT' | 'OFFLINE' | 'MAINTENANCE';
export type StoreRegion = 'North' | 'South' | 'East' | 'West';

export interface DeviceCategorySummary {
  total: number;
  online: number;
  offline: number;
  maintenance?: number;
}

export interface StoreDeviceSummary {
  cameras: DeviceCategorySummary;
  edgeDevices: DeviceCategorySummary;
  posSystems: DeviceCategorySummary;
  network: DeviceCategorySummary;
}

export interface Store {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  region: StoreRegion;
  timezone: string;
  status: StoreStatus;
  latitude: number;
  longitude: number;
  manager: string;
  managerEmail?: string;
  managerPhone?: string;
  footfall: number;
  footfallTrend: number; // Percentage (+/-)
  sales: number;
  salesTrend: number; // Percentage (+/-)
  devicesOnline: number;
  devicesTotal: number;
  deviceSummary?: StoreDeviceSummary;
  lastUpdatedAt: string; // e.g. "24 Sep 2024, 03:24 PM"
  image?: string;
}
```

### JSON Representation Example

```json
{
  "id": "store-001",
  "organizationId": "org-default",
  "name": "Store 001 - City Mall",
  "code": "Store 001",
  "address": "City Mall, Sector 12, Rohini",
  "city": "Delhi",
  "state": "Delhi",
  "country": "India",
  "postalCode": "110085",
  "phone": "+91 11 4589 1201",
  "email": "delhi.citymall@retailedge.ai",
  "region": "North",
  "timezone": "Asia/Kolkata",
  "status": "ONLINE",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "manager": "Vikram Malhotra",
  "managerEmail": "vikram.m@retailedge.ai",
  "managerPhone": "+91 98101 23456",
  "footfall": 2854,
  "footfallTrend": 12,
  "sales": 428760,
  "salesTrend": 8,
  "devicesOnline": 22,
  "devicesTotal": 24,
  "deviceSummary": {
    "cameras": { "total": 12, "online": 11, "offline": 1 },
    "edgeDevices": { "total": 2, "online": 2, "offline": 0 },
    "posSystems": { "total": 6, "online": 5, "offline": 1 },
    "network": { "total": 4, "online": 4, "offline": 0 }
  },
  "lastUpdatedAt": "24 Sep 2024, 03:24 PM",
  "image": "/images/stores/store_001_tab.png"
}
```

---

## 2. Store Summary Contract (Executive KPIs)

```typescript
export interface StoreSummary {
  totalStores: number;
  activeStores: number;
  storesWithAlerts: number;
  averageFootfall: number;
  averageSalesPerStore: number;
  trends: {
    totalStores: number;
    activeStores: number;
    storesWithAlerts: number;
    averageFootfall: number;
    averageSalesPerStore: number;
  };
}
```

### JSON Example

```json
{
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
```

---

## 3. Store Performance Contract

```typescript
export interface StorePerformanceItem {
  storeId: string;
  storeName: string;
  salesRevenue: number;
  footfall: number;
  orders: number;
  averageTransactionValue: number;
  conversionRate: number;
}
```

### JSON Example

```json
[
  {
    "storeId": "store-001",
    "storeName": "Store 001 - City Mall",
    "salesRevenue": 428760,
    "footfall": 2854,
    "orders": 342,
    "averageTransactionValue": 1253,
    "conversionRate": 12.0
  },
  {
    "storeId": "store-002",
    "storeName": "Store 002 - Pacific Mall",
    "salesRevenue": 389240,
    "footfall": 2120,
    "orders": 298,
    "averageTransactionValue": 1306,
    "conversionRate": 14.1
  }
]
```

---

## 4. Device Health Contract

```typescript
export interface DeviceCategoryHealth {
  category: string;
  total: number;
  online: number;
  offline: number;
  maintenance?: number;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  label: string; // e.g. "● Online" or "● 2 Offline"
}

export interface DeviceHealth {
  cameras: DeviceCategoryHealth;
  edgeDevices: DeviceCategoryHealth;
  posSystems: DeviceCategoryHealth;
  network: DeviceCategoryHealth;
}
```

---

## 5. Store Filters Contract

```typescript
export interface StoreFilters {
  search?: string;
  region?: 'ALL' | StoreRegion;
  status?: 'ALL' | StoreStatus;
  dateRange?: 'today' | '7days' | '30days';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'footfall' | 'sales' | 'lastUpdatedAt';
  sortOrder?: 'asc' | 'desc';
}
```

---

## 6. Create Store Input Contract

```typescript
export interface CreateStoreInput {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  region: StoreRegion;
  timezone: string;
  status: StoreStatus;
  manager?: string;
}
```
