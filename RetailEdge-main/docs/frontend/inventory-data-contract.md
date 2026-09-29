# Inventory Monitoring Data Contracts

## Overview
Normalized TypeScript models consumed by the Inventory Monitoring frontend.

```typescript
export interface InventoryOverview {
  totalProducts: number;
  totalProductsTrend: number;
  inStock: { count: number; percentage: number; trend: number };
  lowStock: { count: number; percentage: number; trend?: number };
  outOfStock: { count: number; percentage: number; trend: number };
  planogramCompliance: { percentage: number; trend: number };
  restockRequired: { count: number };
}

export interface InventoryStatusSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StockTrendPoint {
  date: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface CategoryStockStatus {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  percentage: number;
}

export interface LowStockProductItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  expectedStock: number;
  status: 'Low Stock' | 'Out of Stock';
  aisleShelf: string;
  lastDetected: string;
  image?: string;
}

export interface InventoryEventItem {
  id: string;
  time: string;
  event: string;
  eventType: 'stock_low' | 'stock_out' | 'restocked' | 'mismatch';
  product: string;
  aisleShelf: string;
  status: 'Low Stock' | 'Out of Stock' | 'In Stock' | 'Misplaced';
}
```
