import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product, ProductStatus } from '../../types/product';
import { CATEGORIES_LIST } from '../../data/productPlanogramMockData';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (id: string, updates: Partial<Product>) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Snacks');
  const [price, setPrice] = useState<number>(20);
  const [stock, setStock] = useState<number>(50);
  const [minimumThreshold, setMinimumThreshold] = useState<number>(15);
  const [shelf, setShelf] = useState('');
  const [status, setStatus] = useState<ProductStatus>('IN_STOCK');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock);
      setMinimumThreshold(product.minimumThreshold ?? 15);
      setShelf(product.planogramLocation || '');
      setStatus(product.status);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product.id, {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      minimumThreshold: Number(minimumThreshold),
      planogramLocation: shelf,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Edit Product: {product.sku}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES_LIST.filter((c) => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Min Threshold
              </label>
              <input
                type="number"
                min="1"
                value={minimumThreshold}
                onChange={(e) => setMinimumThreshold(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Shelf Location
              </label>
              <input
                type="text"
                value={shelf}
                onChange={(e) => setShelf(e.target.value)}
                placeholder="Aisle 2 - Shelf 1"
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0FA968] hover:bg-[#0d925a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
