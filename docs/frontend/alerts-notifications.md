# Alerts & Notifications — Operations Center

## Route
`/alerts`

## Purpose
The centralized Operations Center for the RetailEdge AI platform. It aggregates, monitors, categorizes, and coordinates the operational resolution of real-time alerts dispatched from edge devices, computer vision models, and store intelligence modules.

---

## Alert Sources
- **Inventory Monitoring**: Out of stock, low stock, shelf inventory mismatch.
- **Queue Intelligence**: Checkout congestion, wait time thresholds exceeded, queue normalization.
- **Planogram Compliance**: Misplaced items, missing items, empty shelf voids, facing compliance violations.
- **Shopper Analytics / Customer Behavior**: Abnormally high footfall, dwell hotspots, zone crowding.
- **System / Edge Devices**: Camera offline/reconnects, edge AI device heartbeats, POS/ERP sync status.

---

## Page Structure & Sections
1. **Top Application Header**: Search input, store switcher dropdown, live edge status indicator, notification bell with unread badge, and administrator profile.
2. **Page Header**: Title, operational subtitle, calendar picker ("Today, 24 Sep 2024"), time range toggle pills (Today, 7 Days, 30 Days), and "Mark All Read" action button.
3. **KPI Cards (5 Total)**:
   - **Total Alerts**: 28 (↑ 12% vs yesterday) with alert triangle icon and sparkline.
   - **Critical**: 5 (↑ 25% vs yesterday) with alert triangle icon and sparkline.
   - **Warning**: 12 (↑ 8% vs yesterday) with alert triangle icon and sparkline.
   - **Info**: 11 (↓ 15% vs yesterday) with info icon and sparkline.
   - **Resolved**: 42 (↑ 30% vs yesterday) with check circle icon and sparkline.
4. **Alert Trend**: Multi-series line chart tracking Critical, Warning, and Info alerts across operational store hours (6AM–9PM) with a 24-hour range selector.
5. **Alerts by Category**: Donut chart displaying the proportion of alerts across Inventory (39%), Queue (21%), Planogram (18%), Customer Behavior (11%), and System (11%) with center count ("28 Total Alerts").
6. **Alert Status**: Horizontal progress bars visualizing status counts for Open (28), In Progress (6), Resolved (42), and Ignored (3).
7. **Filters Panel (Right Side)**:
   - Alert Type checkboxes (Critical, Warning, Info)
   - Category checkboxes (Inventory, Queue, Planogram, Customer Behavior, System)
   - Status checkboxes (Open, In Progress, Resolved, Ignored)
   - Time Range dropdown (Last 24 Hours, Last 7 Days, Last 30 Days)
   - Store selector dropdown (All Stores, Store 001, etc.)
   - "Apply Filters" button and "Reset" action.
8. **Recent Alerts Table**: Tabular view of recent alerts with Time, Type icon, Category, Message, Store, Status pill badge, and "View" selection button.
9. **Alert Details Panel**:
   - Header with dynamic severity badge.
   - Title, detection timestamp, and 2-column operational attributes (Category, Store, Location, Product/SKU, Current Stock, Expected Stock, Camera, AI Confidence).
   - Camera/shelf preview image with bounding overlay.
   - Recommended Actions with numbered procedural steps.
   - Action buttons: "Mark as In Progress", "Mark as Resolved", "Assign to Staff".
10. **Alert History**: Vertical timeline with status transition dots, timestamps, and audit log notes.

---

## Components Architecture
- `src/pages/alerts/AlertsPage.tsx`: Main page controller orchestrating layout, store scoping, and modal states.
- `src/components/alerts/AlertsHeader.tsx`: Title, date selector, range toggle, and Mark All Read.
- `src/components/alerts/AlertKpiCard.tsx`: Individual KPI card with SVG sparkline.
- `src/components/alerts/AlertKpiGrid.tsx`: 5-card responsive KPI summary grid.
- `src/components/alerts/AlertTrend.tsx`: Recharts multi-line chart for severity trends.
- `src/components/alerts/AlertsByCategory.tsx`: Donut chart with centered total and legend.
- `src/components/alerts/AlertStatusChart.tsx`: Horizontal progress bars for lifecycle states.
- `src/components/alerts/AlertFilters.tsx`: Multi-facet filtering card with Apply & Reset handlers.
- `src/components/alerts/RecentAlertsTable.tsx`: Compact alert table with selection trigger.
- `src/components/alerts/AlertDetails.tsx`: Comprehensive alert inspection, image preview, recommendations, and timeline.
- `src/components/alerts/AssignStaffModal.tsx`: Staff assignment selection modal.
- `src/services/alertService.ts`: Centralized service consuming endpoints with mock fallback.
- `src/hooks/useAlerts.ts`: Custom hook managing local and remote alert states.
- `src/utils/alertMeta.ts`: Centralized color, icon, and label resolvers.
- `src/data/alertMockData.ts`: Realistic mock data matching the reference specifications.

---

## API Status & Endpoint Contracts
- `GET /api/alerts`: CONTRACT ONLY (Handled via `alertService.getAlerts` with mock fallback).
- `GET /api/alerts/:id`: CONTRACT ONLY (Handled via `alertService.getAlert`).
- `GET /api/alerts/summary`: CONTRACT ONLY (Handled via `alertService.getAlertSummary`).
- `PATCH /api/alerts/:id/acknowledge`: CONTRACT ONLY (Handled via `alertService.acknowledgeAlert`).
- `PATCH /api/alerts/:id/resolve`: CONTRACT ONLY (Handled via `alertService.resolveAlert`).
- `PATCH /api/alerts/:id/assign`: CONTRACT ONLY (Handled via `alertService.assignAlert`).
- `POST /api/alerts/mark-all-read`: CONTRACT ONLY (Handled via `alertService.markAllAlertsRead`).
