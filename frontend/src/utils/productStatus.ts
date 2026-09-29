import type { ProductStatus } from '../types/product';

export interface ProductStatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
  bgClass: string;
  textClass: string;
}

export function getProductStatusMeta(status: ProductStatus | string): ProductStatusMeta {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'IN_STOCK':
      return {
        label: 'In Stock',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dotClass: 'bg-emerald-500',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
      };
    case 'LOW_STOCK':
      return {
        label: 'Low Stock',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotClass: 'bg-amber-500',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
      };
    case 'OUT_OF_STOCK':
      return {
        label: 'Out of Stock',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dotClass: 'bg-rose-500',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-700',
      };
  }
}
