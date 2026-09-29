# Products & Planogram — Backend API Contract & Handoff Guide

## Overview
This document specifies the exact REST API contracts, parameter requirements, authentication, RBAC boundaries, and real-time Socket.IO events required to integrate the **Products & Planogram** module with the RetailEdge AI backend.

All endpoints are currently wired to the frontend service layer (`src/services/productService.ts` and `src/services/planogramService.ts`) with robust mock fallbacks.

---

## 1. Product Management Endpoints

### 1.1 List Products
- **Method / Path**: `GET /api/products`
- **Status**: `CONTRACT ONLY (Mock fallback active)`
- **Query Parameters**:
  - `storeId` (string, optional): Filter by store (e.g. `store-001`)
  - `category` (string, optional): Filter by category (e.g. `Snacks`)
  - `status` (string, optional): `IN_STOCK` | `LOW_STOCK` | `OUT_OF_STOCK`
  - `search` (string, optional): Search by name, SKU, or category
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 50)
- **Response `200 OK`**:
```json
[
  {
    "id": "prod-001",
    "organizationId": "org-001",
    "storeId": "store-001",
    "name": "Lays Classic 52g",
    "sku": "LAY003",
    "category": "Snacks",
    "price": 20,
    "stock": 48,
    "minimumThreshold": 15,
    "status": "IN_STOCK",
    "shelfId": "shelf-3",
    "planogramId": "plano-snacks",
    "planogramLocation": "Aisle 2 - Shelf 3",
    "image": "/images/products-planogram/prod_lays.png",
    "brand": "Frito-Lay",
    "unitType": "Packet",
    "createdAt": "2024-09-01T10:00:00Z",
    "updatedAt": "2024-09-24T10:30:00Z"
  }
]
```

### 1.2 Get Product Details
- **Method / Path**: `GET /api/products/:id`
- **Response `200 OK`**: Single `Product` object.

### 1.3 Get Product Summary / KPI Stats
- **Method / Path**: `GET /api/products/summary`
- **Query Parameters**: `storeId` (optional)
- **Response `200 OK`**:
```json
{
  "totalProducts": 1248,
  "activeSkus": 1156,
  "lowStockItems": 32,
  "outOfStock": 18,
  "categories": 24,
  "trends": {
    "totalProducts": 8,
    "activeSkus": 5,
    "lowStockItems": -28,
    "outOfStock": -40,
    "categories": 4
  }
}
```

### 1.4 Get Product Category Distribution
- **Method / Path**: `GET /api/products/categories`
- **Response `200 OK`**:
```json
{
  "totalProducts": 1248,
  "categories": [
    { "name": "Snacks", "percentage": 28, "count": 350, "color": "#10B981" },
    { "name": "Beverages", "percentage": 18, "count": 225, "color": "#F59E0B" },
    { "name": "Dairy", "percentage": 12, "count": 150, "color": "#06B6D4" },
    { "name": "Personal Care", "percentage": 10, "count": 125, "color": "#3B82F6" },
    { "name": "Home Care", "percentage": 8, "count": 100, "color": "#8B5CF6" },
    { "name": "Bakery", "percentage": 8, "count": 100, "color": "#EC4899" },
    { "name": "Confectionery", "percentage": 6, "count": 75, "color": "#F97316" },
    { "name": "Others", "percentage": 20, "count": 248, "color": "#94A3B8" }
  ]
}
```

### 1.5 Create Product
- **Method / Path**: `POST /api/products`
- **RBAC**: `ADMIN`, `STORE_MANAGER`
- **Request Body**:
```json
{
  "name": "Lays Magic Masala 52g",
  "sku": "LAY006",
  "category": "Snacks",
  "price": 20,
  "stock": 50,
  "minimumThreshold": 15,
  "status": "IN_STOCK",
  "storeId": "store-001",
  "shelfId": "shelf-2",
  "planogramLocation": "Aisle 2 - Shelf 2"
}
```

### 1.6 Update Product
- **Method / Path**: `PATCH /api/products/:id`
- **RBAC**: `ADMIN`, `STORE_MANAGER`

### 1.7 Delete Product
- **Method / Path**: `DELETE /api/products/:id`
- **RBAC**: `ADMIN`

---

## 2. Planogram Management Endpoints

### 2.1 List Planograms
- **Method / Path**: `GET /api/planograms`
- **Query Parameters**: `storeId`, `zoneId`, `status`, `search`
- **Response `200 OK`**:
```json
[
  {
    "id": "plano-snacks",
    "organizationId": "org-001",
    "storeId": "store-001",
    "zoneId": "zone-snacks",
    "name": "Snacks - Standard",
    "location": "Aisle 2",
    "description": "Standard 4-shelf snack gondola for core and premium chips",
    "status": "Active",
    "shelfCount": 4,
    "totalSkus": 48,
    "complianceRate": 96,
    "assignedTo": "Store 001 - City Mall",
    "thumbnail": "/images/products-planogram/lib_snacks.png",
    "lastUpdated": "24 Sep 2024, 10:30 AM"
  }
]
```

### 2.2 Get Planogram Layout & Positions
- **Method / Path**: `GET /api/planograms/:id`
- **Response `200 OK`**: Returns planogram with full `shelves` array and product positions.

### 2.3 Create Planogram
- **Method / Path**: `POST /api/planograms`
- **RBAC**: `ADMIN`, `STORE_MANAGER`

### 2.4 Duplicate Planogram
- **Method / Path**: `POST /api/planograms/:id/duplicate`

### 2.5 Get Planogram Compliance Summary
- **Method / Path**: `GET /api/planograms/:id/compliance`
- **Response `200 OK`**:
```json
{
  "planogramId": "plano-snacks",
  "complianceRate": 96,
  "correct": 48,
  "misplaced": 3,
  "missing": 5,
  "extra": 2,
  "lastCheckedAt": "2024-09-24T10:30:00Z"
}
```

---

## 3. Realtime Socket.IO Events

| Event Name | Direction | Payload | Frontend Action |
|---|---|---|---|
| `product.created` | Server → Client | `{ product: Product }` | Prepends new product to list |
| `product.updated` | Server → Client | `{ product: Product }` | Updates target product row in table |
| `product.deleted` | Server → Client | `{ productId: string }` | Removes product from table |
| `planogram.updated` | Server → Client | `{ planogram: PlanogramItem }` | Refreshes selected planogram view |
| `planogram.compliance_updated` | Server → Client | `PlanogramComplianceSummary` | Updates compliance progress bar & indicators |
