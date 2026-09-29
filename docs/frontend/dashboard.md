# RetailEdge AI — Main Authenticated Dashboard

## 1. Route & Overview
- **Route**: `/dashboard`
- **Purpose**: Main authenticated Store Operations Dashboard for RetailEdge AI. Provides store managers and regional executives with high-density, real-time intelligence across shopper traffic, queue latency, shelf compliance, edge camera streams, inventory health, and AI predictions.
- **Authentication**: Protected route via `ProtectedRoute`. Accessible following login at `/login` or direct session restore.

---

## 2. Information Architecture & Layout Composition

The dashboard implements a dense enterprise operations structure matching the official reference specification:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (218px) │ TOP HEADER (Search, Store Selector, Live, Bell, User) │
│                 ├───────────────────────────────────────────────────────┤
│                 │ GREETING (Good Afternoon, Date/Time, Weather)         │
│                 ├───────────────────────────────────────────────────────┤
│                 │ KPI ROW (6 Compact Cards)                             │
│                 ├───────────────────────────────────────────────────────┤
│                 │ FOOTFALL TREND │ CUSTOMER DISTRIB │ STORE HEATMAP     │
│                 ├───────────────────────────────────────────────────────┤
│                 │ LIVE CAMERA FEEDS (4 Cards)   │ QUEUE STATUS (5 Rows) │
│                 ├───────────────────────────────────────────────────────┤
│                 │ INVENTORY │ PLANOGRAM │ RECENT ALERTS │ AI INSIGHTS   │
│                 ├───────────────────────────────────────────────────────┤
│                 │ TOP CATEGORIES │ DWELL TIME BY ZONE │ FOOTFALL BY HR  │
│                 ├───────────────────────────────────────────────────────┤
│                 │ LOW STOCK TABLE │ SALES VS FOOTFALL │ DEVICE STATUS   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Reusable Dashboard Components

All modules are isolated into decoupled, production-grade components located under `frontend/src/components/dashboard/`:

1. **`DashboardLayout.tsx`**: Host layout coordinating the fixed desktop sidebar, mobile drawer backdrop, sticky top header, and fluid content area.
2. **`DashboardSidebar.tsx`**: Fixed 218px navigation sidebar with RetailEdge branding, 13 navigation destinations, active green indicator on `Dashboard`, unread notification pill (`12`), store selector switcher, and user profile with sign-out.
3. **`DashboardHeader.tsx`**: Top header featuring search input (`Search products, stores, alerts...`), store selector dropdown, pulsing `● Live` status badge, alerts bell, messages icon, and user profile thumbnail.
4. **`GreetingHeader.tsx`**: Personalized greeting banner (`Good Afternoon, Admin!`), formatted date/time widget (`Tue, 24 Sep 2024 03:24 PM`), and store weather widget (`28°C Delhi, India`).
5. **`KpiGrid.tsx` & `KpiCard.tsx`**: 6-column KPI metric row with pastel icon backgrounds:
   - *Total Footfall*: `1,482` (`↑ 12% vs yesterday`)
   - *Avg Dwell Time*: `8.4 min` (`↑ 6%`)
   - *Active Queues*: `2 / 5` (`● Normal`)
   - *Out of Stock Items*: `4` (`↑ 2 new` — Alert Styling)
   - *Planogram Compliance*: `96%` (`↑ 3%`)
   - *System Health*: `Online` (`All systems operational`)
6. **`FootfallTrend.tsx`**: Recharts AreaChart comparing Today's footfall with yesterday's baseline across hourly intervals (6AM to 9PM) with subtle emerald fill.
7. **`CustomerDistribution.tsx`**: Recharts Donut chart showing customer demographics (Male 52%, Female 43%, Children 5%) with 1,482 visitors centered.
8. **`StoreHeatmap.tsx`**: Real-time store floor plan heatmap visualization showing customer traffic zones and high-to-low traffic color gradient.
9. **`LiveCameraFeed.tsx` & `CameraFeedCard.tsx`**: Operational video grid with category tabs (*All Cameras*, *Entrance*, *Aisles*, *Checkout*) and 4 live stream cards with timestamp and expand actions.
10. **`QueueStatus.tsx`**: Checkout counters monitor (Counters 1–5) displaying real-time customer counts, estimated wait minutes, progress bars, and status indicators (`High`, `Normal`, `Open`).
11. **`InventoryStatus.tsx`**: Circular product distribution gauge (1,248 total products) categorizing stock levels: In Stock (95%), Low Stock (3%), Out of Stock (2%).
12. **`PlanogramCompliance.tsx`**: Circular compliance gauge displaying 96% adherence across shelf segments (48 correct, 3 misplaced, 5 missing).
13. **`RecentAlerts.tsx`**: Operational alert feed showing severity badges, contextual product/aisle descriptions, and relative timestamps.
14. **`AIInsights.tsx`**: Automated machine-learning insight cards highlighting footfall spikes, queue surge predictions, restocking prompts, and layout performance.
15. **`TopCategories.tsx`**: Category sales performance breakdown with normalized horizontal progress bars and percentage growth trends.
16. **`DwellTimeByZone.tsx`**: Recharts BarChart visualizing customer dwell duration across Entrance, Aisles, Snacks, Beverages, Checkout, and Personal Care zones.
17. **`FootfallByHour.tsx`**: Clean Recharts line chart illustrating visitor traffic distribution over operating hours.
18. **`LowStockProducts.tsx`**: Tabular replenishment roster detailing critical SKU inventory, threshold levels, out-of-stock badges, and one-click restock actions.
19. **`SalesFootfallCorrelation.tsx`**: Recharts ComposedChart overlaying footfall volume bars against monetary sales revenue curves over 7 days.
20. **`DeviceStatus.tsx`**: Hardware and integration status monitor tracking camera uptimes, edge nodes, and POS terminal connectivity.

---

## 4. Data Architecture & Data Sources

The dashboard follows a strict three-tier decoupled architecture:

```
┌────────────────────────────────────────────────────────┐
│ DATA SOURCES: Centralized Mock Data / REST / Socket.IO │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ SERVICE LAYER: dashboardService / analyticsService etc. │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ HOOK LAYER: useDashboardData / useRealtimeDashboard    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ PRESENTATION COMPONENTS: Strict TypeScript Interfaces  │
└────────────────────────────────────────────────────────┘
```

1. **Centralized Mock Fallback** (`src/data/dashboardMockData.ts`):
   - Fully independent and self-contained; provides instant prototype evaluation matching the visual reference when backend microservices are offline.
2. **REST API Client** (`src/services/apiClient.ts`):
   - Configured with centralized Axios instance, cookie handling, and standard error interceptors.
3. **Socket.IO Event Stream** (`src/hooks/useRealtimeDashboard.ts`):
   - Subscribes to live edge events when `VITE_SOCKET_URL` is configured.

---

## 5. API Endpoints Specification

### A. Analytics Endpoints

#### 1. `GET /api/analytics/overview`
- **Status**: `CONTRACT READY / FALLBACK ACTIVE`
- **Purpose**: Fetch complete aggregated dashboard overview state for a store.
- **Parameters**: `store_id: string` (query)
- **Response**: `DashboardOverviewData`
- **Auth**: Required (`Bearer` or HTTP-only session cookie)
- **Store Scope**: Scoped to selected store (`store-001`, `store-002`, etc.)

#### 2. `GET /api/analytics/footfall`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Retrieve historical and real-time footfall trend points.
- **Query Params**: `store_id: string`, `range: 'today' | 'yesterday' | 'week'`
- **Response Shape**: `Array<{ time: string, today: number, yesterday: number }>`

#### 3. `GET /api/analytics/queues`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Fetch live queue lengths and estimated wait times for all counters.
- **Response Shape**: `Array<QueueCounterItem>`

#### 4. `GET /api/analytics/zones`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Retrieve average dwell duration by store zone.
- **Response Shape**: `Array<{ zone: string, minutes: number }>`

#### 5. `GET /api/analytics/alerts`
- **Status**: `CONTRACT ONLY`
- **Purpose**: Fetch list of operational alerts.
- **Response Shape**: `Array<RecentAlertItem>`

---

### B. Operations & Inventory Endpoints

#### 6. `GET /api/inventory/status`
- **Status**: `CONTRACT READY`
- **Purpose**: Summary of in-stock, low-stock, and out-of-stock items.
- **Response Shape**: `InventoryStatusSummary`

#### 7. `GET /api/inventory/products`
- **Status**: `CONTRACT READY`
- **Query Params**: `status: 'LOW_STOCK' | 'OUT_OF_STOCK'`, `limit: number`
- **Response Shape**: `Array<LowStockProductItem>`

#### 8. `GET /api/stores`
- **Status**: `IMPLEMENTED / FALLBACK ACTIVE`
- **Purpose**: List stores available to current authenticated user.
- **Response Shape**: `Array<StoreOption>`

#### 9. `GET /api/stores/:id/cameras`
- **Status**: `CONTRACT READY`
- **Purpose**: Fetch active camera feeds and streaming URLs for store.
- **Response Shape**: `Array<CameraFeedItem>`

---

## 6. Realtime Socket.IO Events Contract

The frontend includes listener architecture in `src/hooks/useRealtimeDashboard.ts` prepared for incoming Edge/AI server broadcasts:

| Event Name | Purpose | Expected Payload | Target Component | Status |
|---|---|---|---|---|
| `analytics.updated` | Live footfall/dwell time updates | `Partial<DashboardOverviewData>` | `FootfallTrend`, `KpiGrid` | FRONTEND READY / PENDING BACKEND |
| `footfall.updated` | Incremental visitor count | `{ count: number, timestamp: string }` | `Total Footfall` KPI | FRONTEND READY / PENDING BACKEND |
| `queue.updated` | Checkout queue surge or clearance | `Array<QueueCounterItem>` | `QueueStatus`, `Active Queues` KPI | FRONTEND READY / PENDING BACKEND |
| `inventory.updated` | Shelf stock status changed | `{ productId: string, currentStock: number }` | `LowStockProducts`, `InventoryStatus` | FRONTEND READY / PENDING BACKEND |
| `alert.created` | New urgent operational anomaly | `RecentAlertItem` | `RecentAlerts`, Sidebar Badge | FRONTEND READY / PENDING BACKEND |

---

## 7. Responsive Behavior Implementation
- **Desktop (>= 1280px)**: Multi-column enterprise grid layout; fixed 218px left sidebar; 6-card KPI row; dual-axis correlation charts.
- **Tablet (768px – 1024px)**: 3-column KPI wrap; 2-column analytics cards; horizontal scroll for dense camera cards and tables.
- **Mobile (< 768px)**: Left sidebar converts to off-canvas slide-out drawer accessible via header hamburger menu; 2-column KPI cards; full-width stacked chart panels; touch-friendly scrollable tables.
