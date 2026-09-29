# RetailEdge AI — Shopper Analytics Data Contract Specification

This document details the exact TypeScript data contracts expected by the Shopper Analytics module (`/shopper`). Backend and AI/ML teams should provide REST responses and Socket.IO payloads strictly adhering to these shapes.

---

## 1. Complete Shopper Overview Model

```typescript
export interface ShopperOverviewData {
  storeId: string;
  dateFormatted: string;
  timeRange: 'today' | '7d' | '30d';
  kpis: ShopperKpiItem[];
  footfallTrend: ShopperFootfallPoint[];
  heatmapFloorPlanUrl: string;
  heatmapZones: ShopperHeatmapZone[];
  cameraAnalytics: CameraAnalyticsData;
  demographics: {
    totalShoppers: number;
    segments: DemographicSegment[];
  };
  dwellTimeDistribution: DwellTimeBucket[];
  trafficByZone: ZoneTrafficItem[];
  pathMapUrl: string;
  topVisitedAreas: VisitedAreaItem[];
  customerTypes: {
    totalUnique: number;
    segments: CustomerTypeSegment[];
  };
  peakHours: PeakHourInsightItem[];
}
```

---

## 2. Granular Data Models

### A. KPI Item (5 Cards)
```typescript
export interface ShopperKpiItem {
  id: string;
  title: string;             // e.g. "Total Footfall", "Unique Shoppers"
  value: string;             // e.g. "1,482", "1,126", "8.4 min", "24%", "5 PM - 7 PM"
  trendText?: string;        // e.g. "↑ 12% vs yesterday"
  trendDirection?: 'up' | 'down' | 'neutral';
  supportingText?: string;   // e.g. "Highest footfall"
  icon: 'users' | 'user-check' | 'clock' | 'cart' | 'bar-chart';
  theme: 'blue' | 'green' | 'purple' | 'emerald' | 'teal';
}
```

### B. Footfall Trend
```typescript
export interface ShopperFootfallPoint {
  time: string;              // "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
  today: number;             // e.g. 195
  yesterday: number;         // e.g. 145
}
```

### C. Live Camera Analytics
```typescript
export interface CameraAnalyticsData {
  peopleInFrame: number;     // e.g. 12
  entering: number;          // e.g. 7
  exiting: number;           // e.g. 5
  imageUrl: string;          // Static snapshot or Edge WebRTC/HLS stream URL
  activeCamera: string;      // e.g. "Entrance"
}
```

### D. Customer Demographics & Customer Types
```typescript
export interface DemographicSegment {
  name: string;              // "Male" | "Female" | "Children"
  value: number;             // e.g. 770
  percentage: number;        // e.g. 52
  color: string;             // Hex code, e.g. "#10B981"
}

export interface CustomerTypeSegment {
  name: string;              // "New Customers" | "Returning Customers"
  value: number;             // e.g. 766
  percentage: number;        // e.g. 68
  color: string;             // Hex code, e.g. "#059669"
}
```

### E. Dwell Time & Zone Traffic
```typescript
export interface DwellTimeBucket {
  range: string;             // "0-2 min", "2-5 min", "5-10 min", "10-20 min", "> 20 min"
  percentage: number;        // e.g. 28, 32, 20, 12, 8
}

export interface ZoneTrafficItem {
  id: string;
  zoneName: string;          // e.g. "Entrance", "Fresh Produce", "Beverages"
  count: number;             // e.g. 320, 245
}
```

### F. Top Visited Areas & Peak Hours Insights
```typescript
export interface VisitedAreaItem {
  rank: number;              // 1 to 5
  zone: string;              // e.g. "Fresh Produce"
  visits: number;            // e.g. 320
  avgDwellTime: string;      // e.g. "6.2 min"
  trend: string;             // e.g. "↑ 18%"
  trendDirection: 'up' | 'down';
}

export interface PeakHourInsightItem {
  id: string;
  timeSlot: string;          // e.g. "12 PM - 3 PM"
  footfall: number;          // e.g. 420
  avgDwellTime: string;      // e.g. "9.2 min"
  conversionRate: string;    // e.g. "26%"
  insights: string;          // e.g. "Highest footfall"
  isPeak?: boolean;          // true enables emerald highlight styling
}
```
