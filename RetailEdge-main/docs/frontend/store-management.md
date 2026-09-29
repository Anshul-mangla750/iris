# Store Management

## Route
`/stores`

## Purpose
Manage all enterprise retail stores, locations, devices, performance, and configurations from one place in the RetailEdge AI platform.

## Page Sections

1. **Page Header**
   - Title: `Store Management`
   - Subtitle: `Manage all your retail stores, devices, performance and configurations from one place.`
   - Date range selector: `Today, 24 Sep 2024` with quick toggles (`Today`, `7 Days`, `30 Days`).
   - Primary action: `+ Add Store` button that launches the Add Store modal with client-side validation.

2. **KPI Cards (5 Equal Columns)**
   - **Total Stores**: 12 stores, `↑ 20%` positive trend, store icon with green indicator dot and sparkline.
   - **Active Stores**: 11 stores, `↑ 10%` positive trend, store icon with sparkline.
   - **Stores with Alerts**: 3 stores, `↓ 40%` improvement trend, alert triangle icon with red sparkline.
   - **Avg. Store Footfall**: 2,854 visitors, `↑ 12%` positive trend, users icon with green sparkline.
   - **Avg. Sales per Store**: ₹ 4,28,760, `↑ 8%` positive trend, Indian Rupee icon with green sparkline.

3. **Store Locations Map**
   - Interactive Delhi-NCR map canvas displaying stores across Delhi, Rohini, Pitampura, Janakpuri, Ghaziabad, Gurgaon, Faridabad, and New Delhi.
   - Distinct pin markers for:
     - Active Store (Green pin)
     - Store with Alerts (Red pin)
     - Inactive Store (Gray pin)
   - Interactive Store 001 card overlay with photo, location, online badge, footfall, sales, and details link.
   - Controls: Zoom in (`+`), Zoom out (`−`), and Reset crosshair target.
   - Top-right map legend.

4. **Store Performance**
   - 10 horizontal performance bars for top stores ranked by revenue or operational metrics.
   - Metric dropdown selector supporting:
     - `Sales Revenue (₹)`
     - `Footfall`
     - `Orders`
     - `Average Transaction Value`
     - `Conversion Rate`
   - Realtime bar widths proportional to the maximum value in the active dataset.

5. **Store Status**
   - Donut chart with centered total stores indicator (`12 Total Stores`).
   - Status distribution breakdown:
     - Online: 11 (92%)
     - Offline: 1 (8%)
     - Maintenance: 0 (0%)

6. **Device Health (All Stores)**
   - High-level hardware telemetry aggregated across all stores:
     - Cameras: 88 / 96 (`● Online`)
     - Edge Devices: 12 / 12 (`● Online`)
     - POS Systems: 10 / 12 (`● 2 Offline`, warning)
     - Network: 11 / 12 (`● Online`)
   - `View Details >` link opening a detailed hardware telemetry breakdown modal.

7. **All Stores Table**
   - Real-time client-side and backend-ready search across Store Name, City, Region, and Store Code.
   - Region Filter (`All Regions`, `North`, `South`, `East`, `West`).
   - Status Filter (`All Status`, `Online`, `Alert`, `Offline`, `Maintenance`).
   - One-click CSV Export (`exportStoresToCsv`).
   - 10 Data Columns:
     1. `#` (Index)
     2. `Store Name` (Store photo + Name)
     3. `Location` (City)
     4. `Region` (Geographic territory)
     5. `Status` (Status badge with status dot)
     6. `Footfall (Today)` (Visitor count + trend %)
     7. `Sales (Today)` (INR formatted currency + trend %)
     8. `Devices` (Online / Total ratio + status dot)
     9. `Last Updated` (Timestamp)
     10. `Action` (`View` button + kebab dropdown)
   - Pagination: 5 stores per page with `< 1 2 3 >` navigation controls.

8. **Add Store Modal**
   - Modal form for registering a new retail location.
   - Fields: Store Name, Store Code, Address, City, State, Country, Postal Code, Phone, Email, Region, Timezone, Status, Store Manager.
   - Client-side validation for mandatory fields.

9. **Store Details Drawer**
   - Slide-over inspection drawer for deep-diving into individual store telemetry, address, manager, and operational status.
   - Quick action shortcuts: View Dashboard, Edit Store, View Alerts.

## Components

| Component | File Path | Description |
|-----------|-----------|-------------|
| `StoreManagementPage` | `src/pages/stores/StoreManagementPage.tsx` | Main orchestration page managing filters, modals, and store state |
| `StoreManagementHeader` | `src/components/stores/StoreManagementHeader.tsx` | Page title, date range picker, and "+ Add Store" trigger |
| `StoreKpiGrid` | `src/components/stores/StoreKpiGrid.tsx` | 5-column responsive container for executive summary metrics |
| `StoreKpiCard` | `src/components/stores/StoreKpiCard.tsx` | Individual metric card with icon container, trend, and SVG sparkline |
| `StoreLocationsMap` | `src/components/stores/StoreLocationsMap.tsx` | Delhi-NCR geographic map canvas with markers, controls, and popup |
| `StorePerformance` | `src/components/stores/StorePerformance.tsx` | Horizontal bar chart with interactive metric dropdown |
| `StoreStatusChart` | `src/components/stores/StoreStatusChart.tsx` | Recharts donut chart with centered count and legend |
| `DeviceHealth` | `src/components/stores/DeviceHealth.tsx` | 4-box hardware status overview with "View Details" trigger |
| `DeviceHealthModal` | `src/components/stores/DeviceHealthModal.tsx` | Modal displaying granular device breakdown tables |
| `StoreTable` | `src/components/stores/StoreTable.tsx` | Filterable, searchable, and paginated 10-column store directory |
| `AddStoreModal` | `src/components/stores/AddStoreModal.tsx` | Modal form for creating a new store record |
| `StoreDetailsDrawer` | `src/components/stores/StoreDetailsDrawer.tsx` | Slide-over drawer displaying store telemetry and action shortcuts |
| `StoreStatusBadge` | `src/components/stores/StoreStatusBadge.tsx` | Status pill with dot indicator |

## Mock Data
- File: `src/data/storeMockData.ts`
- Data sets:
  - `INITIAL_STORES`: 12 comprehensive retail locations across Delhi-NCR.
  - `INITIAL_STORE_SUMMARY`: Executive KPI values and percentage trends.
  - `INITIAL_STORE_PERFORMANCE`: Top 10 stores ranked across 5 metric dimensions.
  - `INITIAL_DEVICE_HEALTH`: Hardware status metrics for cameras, edge devices, POS, and network.
  - `INITIAL_STATUS_DISTRIBUTION`: Percentage breakdown of store operational states.

## Filters & Pagination
- **Search**: Case-insensitive search on name, code, city, and region.
- **Region**: Filter by North, South, East, West.
- **Status**: Filter by Online, Alert, Offline, Maintenance.
- **Pagination**: 5 records per page with automatic total page calculation and boundary checks.
