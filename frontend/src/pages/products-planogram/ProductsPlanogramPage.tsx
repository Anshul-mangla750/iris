import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { ProductManagementHeader } from '../../components/products-planogram/ProductManagementHeader';
import { ProductKpiGrid } from '../../components/products-planogram/ProductKpiGrid';
import { ProductTable } from '../../components/products-planogram/ProductTable';
import { ProductCategoryChart } from '../../components/products-planogram/ProductCategoryChart';
import { PlanogramManagementHeader } from '../../components/products-planogram/PlanogramManagementHeader';
import { PlanogramLibrary } from '../../components/products-planogram/PlanogramLibrary';
import { PlanogramEditor } from '../../components/products-planogram/PlanogramEditor';
import { PlanogramDetails } from '../../components/products-planogram/PlanogramDetails';
import { AddProductModal } from '../../components/products-planogram/AddProductModal';
import { EditProductModal } from '../../components/products-planogram/EditProductModal';
import { ProductDetailsDrawer } from '../../components/products-planogram/ProductDetailsDrawer';
import { CreatePlanogramModal } from '../../components/products-planogram/CreatePlanogramModal';
import { useProductsPlanogram } from '../../hooks/useProductsPlanogram';
import { STORE_OPTIONS } from '../../data/dashboardMockData';
import type { StoreOption } from '../../types/dashboard';
import type { Product } from '../../types/product';
import { useToast } from '../../context/ToastContext';

export const ProductsPlanogramPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStore, setCurrentStore] = useState<StoreOption>(STORE_OPTIONS[0]);

  const {
    products,
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

    planograms,
    selectedPlanogramId,
    setSelectedPlanogramId,
    selectedPlanogram,
    planogramSearch,
    setPlanogramSearch,
    planogramViewMode,
    setPlanogramViewMode,
    complianceData,
    selectedPlanogramStore,
    setSelectedPlanogramStore,
    selectedPlanogramAisle,
    setSelectedPlanogramAisle,

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

    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleCreatePlanogram,
    handleDuplicatePlanogram,
    handleExportCSV,
  } = useProductsPlanogram();

  // Handlers for product interactions
  const handleViewProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setIsProductDetailsOpen(true);
  };

  const handleEditProductClick = (prod: Product) => {
    setSelectedProduct(prod);
    setIsEditProductOpen(true);
  };

  const handleSelectPlanogramForProduct = (planogramId?: string) => {
    if (planogramId) {
      setSelectedPlanogramId(planogramId);
    }
    // Scroll smoothly to the planogram section
    const elem = document.getElementById('planogram-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewInventory = (prod: Product) => {
    navigate(`/inventory?product=${encodeURIComponent(prod.name)}`);
  };

  return (
    <DashboardLayout currentStore={currentStore} onSelectStore={setCurrentStore}>
      {/* 1. PRODUCT MANAGEMENT SECTION */}
      <section className="mb-4">
        {/* Product Management Header */}
        <ProductManagementHeader
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={productSearch}
          onSearchChange={setProductSearch}
          onAddProduct={() => setIsAddProductOpen(true)}
          onExportCSV={() => {
            handleExportCSV();
            showToast('Catalog exported to CSV', 'success');
          }}
          onImportClick={() => showToast('Opening product CSV/Excel file importer...', 'info')}
        />

        {/* 5 KPI Cards Grid */}
        <ProductKpiGrid summary={productSummary} />

        {/* Product Table + Category Distribution Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left Table: 8 cols (approx 67%) */}
          <div className="lg:col-span-8 flex flex-col">
            <ProductTable
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              selectedStockLevel={selectedStockLevel}
              onSelectStockLevel={setSelectedStockLevel}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProductClick}
              onDeleteProduct={handleDeleteProduct}
              onSelectPlanogramForProduct={handleSelectPlanogramForProduct}
              onViewInventory={handleViewInventory}
            />
          </div>

          {/* Right Chart: 4 cols (approx 33%) */}
          <div className="lg:col-span-4 flex flex-col">
            <ProductCategoryChart distribution={categoryDistribution} />
          </div>
        </div>
      </section>

      {/* 2. PLANOGRAM MANAGEMENT SECTION */}
      <section id="planogram-section" className="pt-2 border-t border-slate-200/60">
        {/* Planogram Management Header */}
        <PlanogramManagementHeader
          selectedStore={selectedPlanogramStore}
          onSelectStore={setSelectedPlanogramStore}
          selectedAisle={selectedPlanogramAisle}
          onSelectAisle={setSelectedPlanogramAisle}
          onCreatePlanogram={() => setIsCreatePlanogramOpen(true)}
        />

        {/* 3-Column Planogram Layout: Library + Editor + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left: Planogram Library (3 cols ~25%) */}
          <div className="lg:col-span-3 flex flex-col">
            <PlanogramLibrary
              planograms={planograms}
              selectedPlanogramId={selectedPlanogramId}
              onSelectPlanogram={setSelectedPlanogramId}
              searchQuery={planogramSearch}
              onSearchChange={setPlanogramSearch}
              onDuplicate={handleDuplicatePlanogram}
            />
          </div>

          {/* Center: Planogram Editor (6 cols ~50%) */}
          <div className="lg:col-span-6 flex flex-col">
            <PlanogramEditor
              planogram={selectedPlanogram}
              viewMode={planogramViewMode}
              onViewModeChange={setPlanogramViewMode}
              complianceData={complianceData}
            />
          </div>

          {/* Right: Planogram Details (3 cols ~25%) */}
          <div className="lg:col-span-3 flex flex-col">
            <PlanogramDetails planogram={selectedPlanogram} />
          </div>
        </div>
      </section>

      {/* MODALS & DRAWERS */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
      />

      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => setIsEditProductOpen(false)}
        product={selectedProduct}
        onSubmit={handleEditProduct}
      />

      <ProductDetailsDrawer
        isOpen={isProductDetailsOpen}
        onClose={() => setIsProductDetailsOpen(false)}
        product={selectedProduct}
        onEdit={(prod) => {
          setIsProductDetailsOpen(false);
          setIsEditProductOpen(true);
          setSelectedProduct(prod);
        }}
        onViewInventory={handleViewInventory}
        onViewPlanogram={handleSelectPlanogramForProduct}
      />

      <CreatePlanogramModal
        isOpen={isCreatePlanogramOpen}
        onClose={() => setIsCreatePlanogramOpen(false)}
        onSubmit={handleCreatePlanogram}
      />
    </DashboardLayout>
  );
};

export default ProductsPlanogramPage;
