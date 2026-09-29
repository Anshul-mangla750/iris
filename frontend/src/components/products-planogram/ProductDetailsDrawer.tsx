import React from 'react';
import { X, Pencil, PackageCheck, Layers } from 'lucide-react';
import type { Product } from '../../types/product';
import { getProductStatusMeta } from '../../utils/productStatus';

interface ProductDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onViewInventory: (product: Product) => void;
  onViewPlanogram: (planogramId?: string) => void;
}

export const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onViewInventory,
  onViewPlanogram,
}) => {
  if (!isOpen || !product) return null;

  const statusMeta = getProductStatusMeta(product.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-bold text-slate-400">{product.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                SKU: {product.sku}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="font-semibold text-slate-600">Stock Status</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusMeta.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
              {statusMeta.label}
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 border-t border-slate-100 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="font-semibold text-slate-800">{product.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Price</span>
              <span className="font-bold text-slate-900">₹{product.price}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Current Stock</span>
              <span className="font-bold text-slate-900">{product.stock} units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Min Threshold</span>
              <span className="font-semibold text-slate-700">{product.minimumThreshold ?? 15} units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Store</span>
              <span className="font-semibold text-slate-800">Store 001 - City Mall</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Shelf / Position</span>
              <span className="font-semibold text-slate-800">{product.planogramLocation || 'Aisle 2 - Shelf 3'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Brand</span>
              <span className="font-semibold text-slate-800">{product.brand || 'Standard'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Unit Type</span>
              <span className="font-semibold text-slate-800">{product.unitType || 'Unit'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Last Updated</span>
              <span className="font-semibold text-slate-800">24 Sep 2024, 10:30 AM</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-500 font-medium block mb-1">Description</span>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg leading-relaxed text-[11px]">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewInventory(product);
              }}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Inventory</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewPlanogram(product.planogramId);
              }}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>View Planogram</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="w-full py-2 px-4 bg-[#0FA968] hover:bg-[#0d925a] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDrawer;
