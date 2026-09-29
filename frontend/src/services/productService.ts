import apiClient from './apiClient';
import type {
  Product,
  ProductSummary,
  CategoryDistribution,
  ProductFilterParams,
} from '../types/product';
import {
  INITIAL_PRODUCTS,
  PRODUCT_SUMMARY_MOCK,
  CATEGORY_DISTRIBUTION_MOCK,
  CATEGORIES_LIST,
} from '../data/productPlanogramMockData';

export const productService = {
  /**
   * Retrieves products list with optional filters.
   * Endpoint: GET /api/products
   */
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products', { params });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return INITIAL_PRODUCTS;
    } catch {
      let filtered = [...INITIAL_PRODUCTS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }
      if (params?.category && params.category !== 'All Categories') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.status && params.status !== 'All Status') {
        const s = params.status.toUpperCase().replace(/\s+/g, '_');
        filtered = filtered.filter((p) => p.status === s);
      }
      return filtered;
    }
  },

  /**
   * Retrieves a single product by ID.
   * Endpoint: GET /api/products/:id
   */
  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data || null;
    } catch {
      return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  /**
   * Retrieves summary KPI stats for products.
   * Endpoint: GET /api/products/summary
   */
  async getProductSummary(_storeId?: string): Promise<ProductSummary> {
    try {
      const response = await apiClient.get<ProductSummary>('/products/summary', {
        params: { storeId: _storeId },
      });
      return response.data || PRODUCT_SUMMARY_MOCK;
    } catch {
      return PRODUCT_SUMMARY_MOCK;
    }
  },

  /**
   * Retrieves categories and their distribution.
   * Endpoint: GET /api/products/categories
   */
  async getProductCategories(): Promise<CategoryDistribution> {
    try {
      const response = await apiClient.get<CategoryDistribution>('/products/categories');
      if (response.data && Array.isArray(response.data.categories) && response.data.categories.length > 0) {
        return response.data;
      }
      return CATEGORY_DISTRIBUTION_MOCK;
    } catch {
      return CATEGORY_DISTRIBUTION_MOCK;
    }
  },

  /**
   * Creates a new product.
   * Endpoint: POST /api/products
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/products', data);
      return response.data;
    } catch {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        organizationId: 'org-001',
        storeId: data.storeId || 'store-001',
        name: data.name || 'New Product',
        sku: data.sku || `SKU${Math.floor(Math.random() * 1000)}`,
        category: data.category || 'Snacks',
        price: data.price || 0,
        stock: data.stock || 0,
        minimumThreshold: data.minimumThreshold || 10,
        status: data.status || 'IN_STOCK',
        brand: data.brand || '',
        unitType: data.unitType || 'Unit',
        description: data.description || '',
        shelfId: data.shelfId || '',
        planogramId: data.planogramId || '',
        planogramLocation: data.planogramLocation || 'Aisle 1 - Shelf 1',
        image: data.image || '/images/products-planogram/prod_lays.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newProduct;
    }
  },

  /**
   * Updates an existing product.
   * Endpoint: PATCH /api/products/:id
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(`/products/${id}`, data);
      return response.data;
    } catch {
      const existing = INITIAL_PRODUCTS.find((p) => p.id === id) || INITIAL_PRODUCTS[0];
      return { ...existing, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Deletes a product.
   * Endpoint: DELETE /api/products/:id
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Imports products from file.
   * Endpoint: POST /api/products/import
   */
  async importProducts(file: File): Promise<{ success: boolean; count: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<{ success: boolean; count: number }>('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      return { success: true, count: 5 };
    }
  },

  /**
   * Exports products as CSV.
   * Endpoint: GET /api/products/export
   */
  async exportProducts(products: Product[]): Promise<string> {
    try {
      const response = await apiClient.get<string>('/products/export');
      return response.data;
    } catch {
      const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Planogram'];
      const rows = products.map((p) => [
        p.id,
        `"${p.name}"`,
        p.sku,
        p.category,
        p.price,
        p.stock,
        p.status,
        `"${p.planogramLocation || ''}"`,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }
  },

  /**
   * Gets planogram placement details for a product.
   * Endpoint: GET /api/products/:id/planogram
   */
  async getProductPlanogram(id: string) {
    try {
      const response = await apiClient.get(`/products/${id}/planogram`);
      return response.data;
    } catch {
      const product = INITIAL_PRODUCTS.find((p) => p.id === id);
      return {
        productId: id,
        planogramId: product?.planogramId || 'plano-snacks',
        location: product?.planogramLocation || 'Aisle 2 - Shelf 3',
        shelf: 'Shelf 3',
        tier: 'Core',
      };
    }
  },

  /**
   * Gets inventory monitoring details for a product.
   * Endpoint: GET /api/products/:id/inventory
   */
  async getProductInventory(id: string) {
    try {
      const response = await apiClient.get(`/products/${id}/inventory`);
      return response.data;
    } catch {
      const product = INITIAL_PRODUCTS.find((p) => p.id === id);
      return {
        productId: id,
        currentStock: product?.stock ?? 48,
        expectedStock: 50,
        detectedStock: product?.stock ?? 48,
        threshold: product?.minimumThreshold ?? 15,
        status: product?.status ?? 'IN_STOCK',
      };
    }
  },

  getCategoriesList(): string[] {
    return CATEGORIES_LIST;
  },
};

export default productService;
