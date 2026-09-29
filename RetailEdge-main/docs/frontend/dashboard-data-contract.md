# RetailEdge AI — Dashboard Data Contract Specification

This document defines the strict TypeScript data models expected by the RetailEdge AI Store Operations Dashboard (`/dashboard`). Backend and AI engineering teams must align their REST responses and Socket.IO payloads with these interfaces to ensure seamless integration without modifying frontend presentation components.

---

## 1. Complete Dashboard Overview Data Model

```typescript
export interface DashboardOverviewData {
  store: StoreOption;
  greeting: GreetingData;
  kpis: KpiItem[];
  footfallTrend: FootfallPoint[];
  customerDistribution: {
    totalVisitors: number;
    items: CustomerDistributionItem[];
  };
  storeHeatmap: {
    isLive: boolean;
    floorPlanUrl: string;
    zones: HeatmapZone[];
  };
  cameras: CameraFeedItem[];
  queueCounters: QueueCounterItem[];
  inventoryStatus: InventoryStatusSummary;
  planogramCompliance: PlanogramSummary;
  recentAlerts: RecentAlertItem[];
  aiInsights: AIInsightItem[];
  topCategories: CategoryPerformanceItem[];
  dwellTimeByZone: DwellTimePoint[];
  footfallByHour: FootfallByHourPoint[];
  lowStockProducts: LowStockProductItem[];
  salesVsFootfall: SalesFootfallPoint[];
  deviceStatuses: DeviceStatusItem[];
}
```

---

## 2. Widget Specific Data Shapes

### A. Store & Greeting
```typescript
export interface StoreOption {
  id: string;               // e.g. "store-001"
  code: string;             // e.g. "Store 001"
  name: string;             // e.g. "City Mall, Delhi"
  city: string;             // e.g. "Delhi"
}

export interface GreetingData {
  userName: string;         // e.g. "Admin"
  message: string;          // e.g. "Here's what's happening in your store today."
  dateFormatted: string;    // e.g. "Tue, 24 Sep 2024"
  timeFormatted: string;    // e.g. "03:24 PM"
  temperature: string;      // e.g. "28°C"
  location: string;         // e.g. "Delhi, India"
}
```

### B. KPI Metrics (6 Cards)
```typescript
export type MetricTrend = 'up' | 'down' | 'neutral';

export interface KpiItem {
  id: string;
  title: string;            // e.g. "Total Footfall", "Out of Stock Items"
  value: string;            // e.g. "1,482", "8.4 min", "2 / 5", "Online"
  trendText?: string;       // e.g. "↑ 12% vs yesterday", "● Normal"
  trendDirection?: MetricTrend;
  subtitle?: string;        // e.g. "All systems operational"
  icon: 'users' | 'clock' | 'queue' | 'package' | 'box' | 'health';
  theme: 'blue' | 'purple' | 'indigo' | 'red' | 'emerald' | 'teal';
  isAlert?: boolean;        // true triggers warning styling for out-of-stock
}
```

### C. Footfall Trend & Customer Distribution
```typescript
export interface FootfallPoint {
  time: string;             // e.g. "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
  today: number;            // e.g. 150
  yesterday: number;        // e.g. 140
}

export interface CustomerDistributionItem {
  name: string;             // "Male" | "Female" | "Children"
  value: number;            // e.g. 770
  percentage: number;       // e.g. 52
  color: string;            // Hex code, e.g. "#0fa968"
}
```

### D. Store Heatmap
```typescript
export interface HeatmapZone {
  id: string;
  name: string;             // e.g. "Aisle 1 Center"
  density: number;          // 0 to 100
  level: 'High' | 'Medium' | 'Low';
  x: number;                // Relative coordinate percentage (0-100)
  y: number;                // Relative coordinate percentage (0-100)
}
```

### E. Operational Cameras & Queue Counters
```typescript
export interface CameraFeedItem {
  id: string;
  name: string;             // e.g. "Entrance Camera", "Aisle 1", "Checkout 1"
  category: 'all' | 'entrance' | 'aisles' | 'checkout';
  timestamp: string;        // e.g. "03:24:12 PM"
  isLive: boolean;
  imageUrl: string;         // Snapshot or edge stream preview URL
}

export interface QueueCounterItem {
  id: string;
  name: string;             // e.g. "Counter 1", "Counter 2"
  peopleCount: number;      // e.g. 5
  waitTimeMinutes: number;  // e.g. 8
  status: 'High' | 'Normal' | 'Open';
  capacityPercent: number;  // 0 to 100 for queue bar visualization
}
```

### F. Inventory & Shelf Compliance
```typescript
export interface InventoryStatusSummary {
  totalProducts: number;    // e.g. 1248
  inStock: { count: number; percent: number };     // e.g. { count: 1181, percent: 95 }
  lowStock: { count: number; percent: number };    // e.g. { count: 42, percent: 3 }
  outOfStock: { count: number; percent: number };  // e.g. { count: 25, percent: 2 }
}

export interface PlanogramSummary {
  compliancePercent: number; // e.g. 96
  correct: number;           // e.g. 48
  misplaced: number;         // e.g. 3
  missing: number;           // e.g. 5
}
```

### G. Alerts & AI Insights
```typescript
export interface RecentAlertItem {
  id: string;
  type: 'out-of-stock' | 'high-queue' | 'misplaced' | 'camera-offline';
  message: string;          // e.g. "Out of stock — Pepsi (Aisle 2 - Shelf 3)"
  subMessage?: string;
  timeAgo: string;          // e.g. "2 min ago"
  severity: 'critical' | 'warning' | 'info';
}

export interface AIInsightItem {
  id: string;
  title: string;            // e.g. "Predicted queue surge at 5 PM"
  description: string;      // e.g. "Expected 6–8 people at Checkout 1."
  type: 'footfall' | 'queue' | 'restock' | 'layout';
  icon: 'trending' | 'clock' | 'package' | 'target';
}
```

### H. Performance & Zone Analytics
```typescript
export interface CategoryPerformanceItem {
  id: string;
  name: string;             // "Beverages" | "Snacks" | "Personal Care" | "Dairy" | "Household"
  sharePercent: number;     // e.g. 28
  changePercent: number;    // e.g. 12
  trend: 'up' | 'down';
  iconName: 'beverages' | 'snacks' | 'personal-care' | 'dairy' | 'household';
}

export interface DwellTimePoint {
  zone: string;             // e.g. "Entrance", "Aisles", "Snacks"
  minutes: number;          // e.g. 6.2, 12.4
}

export interface FootfallByHourPoint {
  time: string;             // e.g. "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
  visitors: number;         // e.g. 85, 265
}
```

### I. Replenishment, Sales Correlation & Hardware Status
```typescript
export interface LowStockProductItem {
  id: string;
  name: string;             // e.g. "Pepsi 500ml", "Dove Soap"
  currentStock: number;     // e.g. 2
  threshold: number;        // e.g. 10
  status: 'Low Stock' | 'Out of Stock';
  iconName?: string;
}

export interface SalesFootfallPoint {
  date: string;             // e.g. "18 Sep", "19 Sep"
  footfall: number;         // e.g. 220
  sales: number;            // e.g. 22000 (INR)
}

export interface DeviceStatusItem {
  id: string;
  name: string;             // e.g. "Entrance Camera", "Edge Device"
  type: 'camera' | 'edge' | 'pos';
  status: 'Online' | 'Connected' | 'Offline';
  uptime: string;           // e.g. "99.8%"
}
```
