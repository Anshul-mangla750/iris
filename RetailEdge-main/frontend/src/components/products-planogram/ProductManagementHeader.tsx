import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/productPlanogramMockData';

interface ProductManagementHeaderProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProduct: () => void;
  onExportCSV: () => void;
  onImportClick: () => void;
}

export const ProductManagementHeader: React.FC<ProductManagementHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddProduct,
  onExportCSV,
  onImportClick,
}) => {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const catMenuRef = useRef<HTMLDivElement>(null);
  const importMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false);
      }
      if (importMenuRef.current && !importMenuRef.current.contains(e.target as Node)) {
        setImportExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Products Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your product catalog, pricing, categories and shelf placement details.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category Dropdown */}
        <div className="relative" ref={catMenuRef}>
          <button
            type="button"
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            className="h-9 px-3.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>{selectedCategory}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {categoryMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat);
                    setCategoryMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full h-9 pl-9 pr-3.5 bg-white border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-xs"
          />
        </div>

        {/* + Add Product Button */}
        <button
          type="button"
          onClick={onAddProduct}
          className="h-9 px-4 bg-[#0FA968] hover:bg-[#0d925a] active:bg-[#0b804e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>

        {/* Import/Export Dropdown */}
        <div className="relative" ref={importMenuRef}>
          <button
            type="button"
            onClick={() => setImportExportOpen(!importExportOpen)}
            className="h-9 px-3.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Import/Export</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${importExportOpen ? 'rotate-180' : ''}`} />
          </button>

          {importExportOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  onImportClick();
                  setImportExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import Products</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExportCSV();
                  setImportExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Products (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Downloading product template CSV...');
                  setImportExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors border-t border-slate-100"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Template</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementHeader;
