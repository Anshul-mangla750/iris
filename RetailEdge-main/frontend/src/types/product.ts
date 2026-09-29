export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: string;
  organizationId: string;
  storeId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description?: string;
  brand?: string;
  unitType?: string;
  stock: number;
  minimumThreshold?: number;
  status: ProductStatus;
  shelfId?: string;
  planogramId?: string;
  planogramLocation?: string; // e.g. "Aisle 2 - Shelf 3"
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSummary {
  totalProducts: number;
  activeSkus: number;
  lowStockItems: number;
  outOfStock: number;
  categories: number;
  trends: {
    totalProducts: number;
    activeSkus: number;
    lowStockItems: number;
    outOfStock: number;
    categories: number;
  };
}

export interface CategoryDistributionItem {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface CategoryDistribution {
  totalProducts: number;
  categories: CategoryDistributionItem[];
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  status?: string;
  stockLevel?: string;
  storeId?: string;
  page?: number;
  limit?: number;
}
