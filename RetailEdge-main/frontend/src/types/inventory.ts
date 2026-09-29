export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryOverview {
  totalProducts: number;
  totalProductsTrend: number;
  inStock: {
    count: number;
    percentage: number;
    trend: number;
  };
  lowStock: {
    count: number;
    percentage: number;
    trend?: number;
  };
  outOfStock: {
    count: number;
    percentage: number;
    trend: number;
  };
  planogramCompliance: {
    percentage: number;
    trend: number;
  };
  restockRequired: {
    count: number;
  };
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

export interface ShelfDetection {
  id: string;
  productId?: string;
  label: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface ShelfViewData {
  aisle: string;
  camera: string;
  imageUrl: string;
  detections: ShelfDetection[];
}

export interface ShelfHealthAnalysisData {
  imageUrl: string;
  overallScore: number;
  legend: {
    name: string;
    color: string;
    count?: number;
  }[];
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
