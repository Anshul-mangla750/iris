import React from 'react';
import { Package, ScanBarcode, AlertTriangle, Gift, Tag } from 'lucide-react';
import { ProductKpiCard } from './ProductKpiCard';
import type { ProductSummary } from '../../types/product';

interface ProductKpiGridProps {
  summary: ProductSummary;
}

export const ProductKpiGrid: React.FC<ProductKpiGridProps> = ({ summary }) => {
  const totalProducts = summary?.totalProducts ?? 1248;
  const activeSkus = summary?.activeSkus ?? 1156;
  const lowStockItems = summary?.lowStockItems ?? 32;
  const outOfStock = summary?.outOfStock ?? 18;
  const categories = summary?.categories ?? 24;

  const trends = summary?.trends ?? {
    totalProducts: 8,
    activeSkus: 5,
    lowStockItems: -28,
    outOfStock: -40,
    categories: 4,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-4">
      {/* KPI 1: Total Products */}
      <ProductKpiCard
        title="Total Products"
        value={totalProducts.toLocaleString()}
        trend={trends.totalProducts}
        icon={Package}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10B981"
      />

      {/* KPI 2: Active SKUs */}
      <ProductKpiCard
        title="Active SKUs"
        value={activeSkus.toLocaleString()}
        trend={trends.activeSkus}
        icon={ScanBarcode}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        sparklineColor="#10B981"
      />

      {/* KPI 3: Low Stock Items */}
      <ProductKpiCard
        title="Low Stock Items"
        value={lowStockItems}
        trend={trends.lowStockItems}
        icon={AlertTriangle}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
        sparklineColor="#EF4444"
      />

      {/* KPI 4: Out of Stock */}
      <ProductKpiCard
        title="Out of Stock"
        value={outOfStock}
        trend={trends.outOfStock}
        icon={Gift}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
        sparklineColor="#EF4444"
      />

      {/* KPI 5: Categories */}
      <ProductKpiCard
        title="Categories"
        value={categories}
        trend={trends.categories}
        icon={Tag}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-500"
        sparklineColor="#10B981"
      />
    </div>
  );
};

export default ProductKpiGrid;
