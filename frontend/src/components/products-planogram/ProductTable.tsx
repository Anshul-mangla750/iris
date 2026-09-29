import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Filter,
  Pencil,
  BarChart2,
  MoreVertical,
  Eye,
  Trash2,
  Layers,
  PackageCheck,
} from 'lucide-react';
import type { Product } from '../../types/product';
import { getProductStatusMeta } from '../../utils/productStatus';
import { CATEGORIES_LIST, STATUS_LIST, STOCK_LEVEL_LIST } from '../../data/productPlanogramMockData';

interface ProductTableProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedStockLevel: string;
  onSelectStockLevel: (level: string) => void;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSelectPlanogramForProduct: (planogramId?: string) => void;
  onViewInventory: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedStockLevel,
  onSelectStockLevel,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onSelectPlanogramForProduct,
  onViewInventory,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const stockRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (stockRef.current && !stockRef.current.contains(e.target as Node)) {
        setStockDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col h-full">
      {/* Header with Title and Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          All Products
        </h2>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="h-8 px-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {categoryDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="h-8 px-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <span>{selectedStatus}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
                {STATUS_LIST.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onSelectStatus(st);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedStatus === st
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stock Level Filter */}
          <div className="relative" ref={stockRef}>
            <button
              type="button"
              onClick={() => setStockDropdownOpen(!stockDropdownOpen)}
              className="h-8 px-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <span>{selectedStockLevel}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {stockDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
                {STOCK_LEVEL_LIST.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      onSelectStockLevel(lvl);
                      setStockDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedStockLevel === lvl
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Action Button */}
          <button
            type="button"
            className="h-8 px-2.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            onClick={() => {
              onSelectCategory('All Categories');
              onSelectStatus('All Status');
              onSelectStockLevel('Stock Level');
            }}
            title="Reset Filters"
          >
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 pl-4 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedIds.length === products.length}
                  onChange={handleSelectAll}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300"
                />
              </th>
              <th className="py-2.5 px-2 w-8 text-center">#</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Price (₹)</th>
              <th className="py-2.5 px-3">Stock</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Planogram</th>
              <th className="py-2.5 pr-4 pl-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                  No products found matching filters.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => {
                const statusMeta = getProductStatusMeta(p.status);
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(p.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center font-medium text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => onViewProduct(p)}
                      >
                        <div className="w-7 h-7 rounded border border-slate-200/80 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain p-0.5"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">
                              {p.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] font-mono text-slate-500">
                      {p.sku}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {p.category}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      ₹{p.price}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {p.stock}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      <button
                        type="button"
                        onClick={() => onSelectPlanogramForProduct(p.planogramId)}
                        className="hover:text-emerald-700 hover:underline flex items-center gap-1 text-left"
                      >
                        {p.planogramLocation || 'Unassigned'}
                      </button>
                    </td>
                    <td className="py-2.5 pr-4 pl-2 text-center">
                      <div className="inline-flex items-center gap-1 justify-center relative">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditProduct(p)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Analytics Button */}
                        <button
                          type="button"
                          onClick={() => onViewInventory(p)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="Inventory & Analytics"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === p.id ? null : p.id)
                            }
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeMenuId === p.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-left"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  onViewProduct(p);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Product</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onEditProduct(p);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Product</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectPlanogramForProduct(p.planogramId);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Planogram</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onViewInventory(p);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <PackageCheck className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Inventory</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteProduct(p.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Delete Product</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
