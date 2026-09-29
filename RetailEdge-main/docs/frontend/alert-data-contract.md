# RetailEdge AI Alert Data Contract

This document outlines the TypeScript contracts and normalized frontend schemas for the Operations Center.

---

## 1. Alert Core Entity (`Alert`)

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Yes | Unique alert identifier (e.g. `alt-001`) |
| `organizationId` | `string` | Yes | Organization context identifier |
| `storeId` | `string` | Yes | Store context identifier |
| `storeName` | `string` | Yes | Display name of the store |
| `zoneId` | `string` | No | Store zone identifier |
| `type` | `AlertType` | Yes | Operational classification of the event |
| `severity` | `AlertSeverity` | Yes | Severity level (`CRITICAL`, `WARNING`, `INFO`) |
| `message` | `string` | Yes | Primary human-readable alert message |
| `recommendation`| `string` | No | Short single-line recommendation |
| `recommendations`| `string[]` | Yes | Ordered action steps |
| `status` | `AlertStatus` | Yes | Alert lifecycle status (`OPEN`, `ACKNOWLEDGED`, `RESOLVED`, `IGNORED`) |
| `isRead` | `boolean` | No | Whether the notification has been viewed |
| `createdAt` | `string` | Yes | Timestamp formatted for display |
| `updatedAt` | `string` | Yes | Timestamp of last status change |
| `assignedTo` | `string` | No | Name of assigned staff member |
| `sourceModule` | `AlertSourceModule` | Yes | Originating subsystem (`INVENTORY`, `QUEUE`, `PLANOGRAM`, `SHOPPER`, `SYSTEM`) |
| `sourceId` | `string` | No | Identifier within the source module |
| `location` | `string` | No | Specific aisle or shelf position |
| `product` | `string` | No | Product name / SKU description |
| `sku` | `string` | No | Product SKU code |
| `currentStock` | `string \| number` | No | Current observed inventory / queue count |
| `expectedStock`| `string \| number` | No | Target baseline or maximum capacity |
| `camera` | `string` | No | Camera name capturing the alert |
| `confidence` | `string \| number` | No | Model detection confidence percentage |
| `image` | `string` | No | Image URL or path to snapshot with visual overlay |
| `history` | `AlertHistoryEntry[]` | Yes | Audit log of actions taken on this alert |

---

## 2. Enums and Type Unions

### Severity (`AlertSeverity`)
- `CRITICAL`: Urgent disruption requiring immediate action (Red).
- `WARNING`: Emerging issue approaching threshold (Amber/Yellow).
- `INFO`: Operational notification or normalized status (Blue).

### Status (`AlertStatus`)
- `OPEN`: Newly created, unhandled alert. (Display: "Open", Red tint)
- `ACKNOWLEDGED`: Assigned or under active investigation. (Display: "In Progress", Amber tint)
- `RESOLVED`: Corrective action completed and verified. (Display: "Resolved", Green tint)
- `IGNORED`: Operator dismissed without action. (Display: "Ignored", Gray tint)

### Source Modules (`AlertSourceModule`)
- `INVENTORY` -> Mapped to "Inventory"
- `QUEUE` -> Mapped to "Queue"
- `PLANOGRAM` -> Mapped to "Planogram"
- `SHOPPER` -> Mapped to "Customer Behavior" / "Customer"
- `SYSTEM` -> Mapped to "System"

### Alert Types (`AlertType`)
- `QUEUE_CONGESTION` -> "Queue Congestion"
- `OUT_OF_STOCK` -> "Out of Stock"
- `LOW_STOCK` -> "Low Stock"
- `PLANOGRAM_VIOLATION` -> "Planogram Violation"
- `HIGH_TRAFFIC` -> "High Traffic"
- `EDGE_OFFLINE` -> "Edge Offline"
- `SYSTEM_SYNC` -> "System Sync"
- `EMPTY_SHELF` -> "Empty Shelf"

---

## 3. Supporting Contracts

### `AlertSummary`
```typescript
interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  resolved: number;
  trends: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    resolved: number;
  };
}
```

### `AlertHistoryEntry`
```typescript
interface AlertHistoryEntry {
  id?: string;
  timestamp: string;
  action: string;
  description: string;
  actor?: string;
  dotColor?: 'red' | 'blue' | 'green' | 'amber';
}
```

### `AlertFilters`
```typescript
interface AlertFilters {
  severity: AlertSeverity[];
  category: AlertSourceModule[];
  status: AlertStatus[];
  timeRange: string;
  storeId: string;
  search?: string;
}
```
