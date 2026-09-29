import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, ProductSummary, CategoryDistribution } from '../types/product';
import type { PlanogramItem, PlanogramComplianceSummary } from '../types/planogram';
import { productService } from '../services/productService';
import { planogramService } from '../services/planogramService';
import {
  PRODUCT_SUMMARY_MOCK,
  CATEGORY_DISTRIBUTION_MOCK,
  PLANOGRAM_ITEMS_MOCK,
  PLANOGRAM_COMPLIANCE_MOCK,
} from '../data/productPlanogramMockData';

export function useProductsPlanogram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSummary, setProductSummary] = useState<ProductSummary>(PRODUCT_SUMMARY_MOCK);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution>(CATEGORY_DISTRIBUTION_MOCK);

  // Product Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [selectedStockLevel, setSelectedStockLevel] = useState<string>('Stock Level');

  // Planograms State
  const [planograms, setPlanograms] = useState<PlanogramItem[]>(PLANOGRAM_ITEMS_MOCK);
  const [selectedPlanogramId, setSelectedPlanogramId] = useState<string>('plano-snacks');
  const [planogramSearch, setPlanogramSearch] = useState<string>('');
  const [planogramViewMode, setPlanogramViewMode] = useState<'visual' | 'table' | 'compliance'>('visual');
  const [complianceData, setComplianceData] = useState<PlanogramComplianceSummary>(PLANOGRAM_COMPLIANCE_MOCK);

  // Planogram Header Filters
  const [selectedPlanogramStore, setSelectedPlanogramStore] = useState('Store 001 - City Mall, Delhi');
  const [selectedPlanogramAisle, setSelectedPlanogramAisle] = useState('Aisle 2 - Snacks');

  // Modals & Drawers
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isCreatePlanogramOpen, setIsCreatePlanogramOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, summary, categories, planos] = await Promise.all([
        productService.getProducts(),
        productService.getProductSummary(),
        productService.getProductCategories(),
        planogramService.getPlanograms(),
      ]);
      setProducts(prods);
      setProductSummary(summary);
      setCategoryDistribution(categories);
      setPlanograms(planos);
    } catch {
      setError('Unable to load product and planogram information. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory && selectedCategory !== 'All Categories') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedStatus && selectedStatus !== 'All Status') {
      const s = selectedStatus.toUpperCase().replace(/\s+/g, '_');
      result = result.filter((p) => p.status === s);
    }
    if (selectedStockLevel && selectedStockLevel !== 'Stock Level' && selectedStockLevel !== 'All') {
      if (selectedStockLevel === 'Healthy') {
        result = result.filter((p) => p.status === 'IN_STOCK');
      } else if (selectedStockLevel === 'Low Stock') {
        result = result.filter((p) => p.status === 'LOW_STOCK');
      } else if (selectedStockLevel === 'Out of Stock') {
        result = result.filter((p) => p.status === 'OUT_OF_STOCK');
      }
    }
    return result;
  }, [products, productSearch, selectedCategory, selectedStatus, selectedStockLevel]);

  // Filtered Planograms
  const filteredPlanograms = useMemo(() => {
    if (!planogramSearch.trim()) return planograms;
    const q = planogramSearch.toLowerCase();
    return planograms.filter(
      (p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
  }, [planograms, planogramSearch]);

  // Currently Selected Planogram
  const selectedPlanogram = useMemo(() => {
    return planograms.find((p) => p.id === selectedPlanogramId) || planograms[0] || null;
  }, [planograms, selectedPlanogramId]);

  // Actions
  const handleAddProduct = async (productData: Partial<Product>) => {
    const created = await productService.createProduct(productData);
    setProducts((prev) => [created, ...prev]);
    setIsAddProductOpen(false);
  };

  const handleEditProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await productService.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setIsEditProductOpen(false);
    if (selectedProduct?.id === id) {
      setSelectedProduct(updated);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setIsProductDetailsOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCreatePlanogram = async (data: Partial<PlanogramItem>) => {
    const created = await planogramService.createPlanogram(data);
    setPlanograms((prev) => [created, ...prev]);
    setSelectedPlanogramId(created.id);
    setIsCreatePlanogramOpen(false);
  };

  const handleDuplicatePlanogram = async (id: string) => {
    const duplicated = await planogramService.duplicatePlanogram(id);
    setPlanograms((prev) => [...prev, duplicated]);
    setSelectedPlanogramId(duplicated.id);
  };

  const handleExportCSV = async () => {
    const csv = await productService.exportProducts(filteredProducts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `retailedge_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsImportExportOpen(false);
  };

  return {
    loading,
    error,
    loadData,

    // Product state
    products: filteredProducts,
    allProductsCount: products.length,
    productSummary,
    categoryDistribution,
    selectedCategory,
    setSelectedCategory,
    productSearch,
    setProductSearch,
    selectedStatus,
    setSelectedStatus,
    selectedStockLevel,
    setSelectedStockLevel,

    // Planogram state
    planograms: filteredPlanograms,
    selectedPlanogramId,
    setSelectedPlanogramId,
    selectedPlanogram,
    planogramSearch,
    setPlanogramSearch,
    planogramViewMode,
    setPlanogramViewMode,
    complianceData,
    setComplianceData,
    selectedPlanogramStore,
    setSelectedPlanogramStore,
    selectedPlanogramAisle,
    setSelectedPlanogramAisle,

    // Modals
    isAddProductOpen,
    setIsAddProductOpen,
    isEditProductOpen,
    setIsEditProductOpen,
    selectedProduct,
    setSelectedProduct,
    isProductDetailsOpen,
    setIsProductDetailsOpen,
    isCreatePlanogramOpen,
    setIsCreatePlanogramOpen,
    isImportExportOpen,
    setIsImportExportOpen,
    isMoreActionsOpen,
    setIsMoreActionsOpen,

    // Operations
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleCreatePlanogram,
    handleDuplicatePlanogram,
    handleExportCSV,
  };
}
