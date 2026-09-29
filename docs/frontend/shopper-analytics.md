# RetailEdge AI — Shopper Analytics Module

## 1. Route & Overview
- **Route**: `/shopper`
- **Purpose**: Authenticated Shopper Behavior & Traffic Intelligence center for RetailEdge AI. Provides store operations managers with deep visibility into visitor volume, unique shoppers, conversion efficiency, dwell distributions, zone-level traffic, path traversals, and AI-predicted peak periods.
- **Authentication**: Protected route under `ProtectedRoute`. Accessible through the main sidebar by clicking **Shopper Analytics** or navigating directly to `/shopper`.

---

## 2. Page Structure & Composition

The page matches the official reference layout:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (Active: Shopper Analytics) │ TOP HEADER (Search, Store, Live, Bell, Avatar)   │
│                                     ├──────────────────────────────────────────────────┤
│                                     │ PAGE HEADER: Shopper Analytics                   │
│                                     │ Date: Today, 24 Sep 2024 | Today/7d/30d | Live   │
│                                     ├──────────────────────────────────────────────────┤
│                                     │ KPI ROW: Footfall | Unique | Dwell | Conv | Peak │
│                                     ├──────────────────────────────────────────────────┤
│                                     │ FOOTFALL TREND (Area) │ HEATMAP │ CAMERA AI      │
│                                     ├──────────────────────────────────────────────────┤
│                                     │ DEMOGRAPHICS │ DWELL BARS │ ZONE BARS │ PATH MAP │
│                                     ├──────────────────────────────────────────────────┤
│                                     │ TOP VISITED AREAS │ REPEAT/NEW │ PEAK INSIGHTS   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

All components reside in `frontend/src/components/shopper/`:

1. **`ShopperHeader.tsx`**: Page headline, descriptive subtitle, interactive date selector dropdown, period filter toggles (`Today`, `7 Days`, `30 Days`), and `Live View` launch button.
2. **`LiveViewModal.tsx`**: Interactive modal launched by the `Live View` button, providing a simulated low-latency edge camera feed with people detection telemetry and YOLOv8 inference status.
3. **`ShopperKpiGrid.tsx` & `ShopperKpiCard.tsx`**: 5-column metric row:
   - *Total Footfall*: `1,482` (`↑ 12% vs yesterday`) with decorative green sparkline wave.
   - *Unique Shoppers*: `1,126` (`↑ 8% vs yesterday`) with green sparkline.
   - *Avg Dwell Time*: `8.4 min` (`↑ 6% vs yesterday`) with green sparkline.
   - *Conversion Rate*: `24%` (`↑ 3% vs yesterday`) with green sparkline.
   - *Peak Hour*: `5 PM - 7 PM` (`Highest footfall`).
4. **`ShopperFootfallTrend.tsx`**: Recharts Area/Line chart comparing Today's footfall with yesterday's baseline (6AM to 9PM, 0–250 range) with interval dropdown (`Hourly / Daily`).
5. **`ShopperStoreHeatmap.tsx`**: Floor plan heatmap with live traffic zones, `● Live` status badge, store area filter dropdown, and vertical High-to-Low traffic gradient legend.
6. **`LiveCameraAnalytics.tsx`**: Camera stream preview with AI people detection bounding boxes, camera selector dropdown (`Entrance`), and real-time counter overlay (*People in Frame: 12*, *Entering: 7*, *Exiting: 5*).
7. **`CustomerDemographics.tsx`**: Recharts Donut chart displaying customer distribution: Male 52%, Female 43%, Children 5% with centered `1,482 Shoppers` callout.
8. **`DwellTimeDistribution.tsx`**: Recharts BarChart visualizing customer stay duration across 5 time buckets (0-2 min: 28%, 2-5 min: 32%, 5-10 min: 20%, 10-20 min: 12%, >20 min: 8%) with percentage labels above bars.
9. **`TrafficByZone.tsx`**: Normalized horizontal progress bars tracking visitor counts across 8 physical zones (Entrance, Fresh Produce, Beverages, Snacks, Personal Care, Checkout, Home Care, Others).
10. **`PathAnalysis.tsx`**: Floor plan customer journey map illustrating Entry (A), Main Path (blue), Popular Path (orange), and Exit (B) with right-aligned legend.
11. **`TopVisitedAreas.tsx`**: Ranked table card tracking highest-traffic zones, visit volume, average dwell time, and period trend arrows.
12. **`RepeatVsNewCustomers.tsx`**: Recharts Donut chart comparing customer loyalty: New Customers (68%) vs Returning Customers (32%) with centered `1,126 Unique` metric.
13. **`PeakHoursInsights.tsx`**: Detailed operational table card detailing footfall, dwell time, and conversion rate across 3-hour operating intervals with subtle green highlight on peak lunch period (`12 PM - 3 PM`).

---

## 4. API Service & Endpoints

All data fetching is abstracted inside `src/services/shopperService.ts` and managed via `src/hooks/useShopperAnalytics.ts`.

| Method | Endpoint | Purpose | Status |
|---|---|---|---|
| `GET` | `/api/shopper/overview` | Aggregated shopper metrics for selected store and time range | **CONTRACT READY / MOCK FALLBACK** |
| `GET` | `/api/shopper/footfall` | Hourly and daily footfall comparison curves | **CONTRACT ONLY** |
| `GET` | `/api/shopper/zones` | Zone-by-zone customer volume and dwell averages | **CONTRACT ONLY** |
| `GET` | `/api/shopper/dwell-time` | Duration bucket distribution data | **CONTRACT ONLY** |
| `GET` | `/api/shopper/events` | Raw entrance / exit edge detection events | **PENDING BACKEND** |

---

## 5. Responsive Behavior

- **Desktop (>= 1280px)**: 5 KPI cards in 1 row; 3-column Row 1; 4-column Row 2; 3-column Row 3. Full viewport content width inside `DashboardLayout`.
- **Tablet (768px – 1024px)**: 3-column KPI wrap; 2-column analytics and behavior cards; horizontal scroll for dense tables.
- **Mobile (< 768px)**: 2-column KPI cards; full-width stacked chart panels; slide-out drawer sidebar with touch controls; horizontally scrollable tables.
