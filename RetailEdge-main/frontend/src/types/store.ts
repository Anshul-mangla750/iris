export type StoreStatus = 'ONLINE' | 'ALERT' | 'OFFLINE' | 'MAINTENANCE';

export type StoreRegion = 'North' | 'South' | 'East' | 'West' | 'Central';

export interface DeviceSummaryItem {
  total: number;
  online: number;
  offline: number;
  maintenance?: number;
}

export interface StoreDeviceSummary {
  cameras: DeviceSummaryItem;
  edgeDevices: DeviceSummaryItem;
  posSystems: DeviceSummaryItem;
  network: DeviceSummaryItem;
}

export interface Store {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  region: string;
  timezone: string;
  status: StoreStatus;
  latitude: number;
  longitude: number;
  manager?: string;
  footfall: number;
  footfallTrend: number;
  sales: number;
  salesTrend: number;
  devicesOnline: number;
  devicesTotal: number;
  deviceSummary?: StoreDeviceSummary;
  lastUpdatedAt: string;
  image?: string;
}

export interface StoreSummaryTrends {
  totalStores: number;
  activeStores: number;
  storesWithAlerts: number;
  averageFootfall: number;
  averageSalesPerStore: number;
}

export interface StoreSummary {
  totalStores: number;
  activeStores: number;
  storesWithAlerts: number;
  averageFootfall: number;
  averageSalesPerStore: number;
  trends: StoreSummaryTrends;
}

export interface StorePerformanceItem {
  storeId: string;
  storeName: string;
  salesRevenue: number;
  footfall: number;
  orders: number;
  averageTransactionValue: number;
  conversionRate: number;
}

export interface DeviceCategoryHealth {
  category: string;
  key: 'cameras' | 'edgeDevices' | 'posSystems' | 'network';
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  statusText: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
}

export interface StoreStatusDistributionItem {
  name: string;
  status: StoreStatus;
  count: number;
  percentage: number;
  color: string;
}

export interface StoreFilters {
  search: string;
  region: string;
  status: string;
  dateRange: 'today' | '7days' | '30days';
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStoreInput {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  region: string;
  timezone: string;
  status?: StoreStatus;
  manager?: string;
}
