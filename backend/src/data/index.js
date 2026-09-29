/**
 * In-memory store data for multi-store management.
 * In production this would come from MongoDB.
 */
export const stores = [
  {
    id: 'store-001', organizationId: 'org-001', name: 'City Mall, Delhi', code: 'STR-001',
    address: 'Plot 12, Sector 18, Connaught Place', city: 'Delhi', state: 'Delhi',
    country: 'India', postalCode: '110001', phone: '+91-11-2341-5678',
    email: 'delhi@retailedge.ai', region: 'North', timezone: 'Asia/Kolkata',
    status: 'ONLINE', latitude: 28.6315, longitude: 77.2167,
    manager: 'Ravi Sharma', footfall: 1482, footfallTrend: 12,
    sales: 245000, salesTrend: 8, devicesOnline: 8, devicesTotal: 10,
    lastUpdatedAt: 'Just now', image: '/images/stores/store_001_tab.png',
  },
  {
    id: 'store-002', organizationId: 'org-001', name: 'Gurgaon Central', code: 'STR-002',
    address: 'DLF Phase 4, Cyber City', city: 'Gurgaon', state: 'Haryana',
    country: 'India', postalCode: '122002', phone: '+91-124-456-7890',
    email: 'gurgaon@retailedge.ai', region: 'North', timezone: 'Asia/Kolkata',
    status: 'ONLINE', latitude: 28.4950, longitude: 77.0892,
    manager: 'Priya Kapoor', footfall: 1124, footfallTrend: 6,
    sales: 198000, salesTrend: 4, devicesOnline: 10, devicesTotal: 10,
    lastUpdatedAt: '2 min ago', image: '/images/stores/store_002_tab.png',
  },
  {
    id: 'store-003', organizationId: 'org-001', name: 'Noida Mall of India', code: 'STR-003',
    address: 'Sector 18, Noida', city: 'Noida', state: 'Uttar Pradesh',
    country: 'India', postalCode: '201301', phone: '+91-120-234-5678',
    email: 'noida@retailedge.ai', region: 'North', timezone: 'Asia/Kolkata',
    status: 'ALERT', latitude: 28.5705, longitude: 77.3210,
    manager: 'Amit Patel', footfall: 890, footfallTrend: -3,
    sales: 165000, salesTrend: -2, devicesOnline: 7, devicesTotal: 10,
    lastUpdatedAt: '5 min ago', image: '/images/stores/store_003_tab.png',
  },
  {
    id: 'store-004', organizationId: 'org-001', name: 'Mumbai Phoenix', code: 'STR-004',
    address: 'Lower Parel, Phoenix Mills Compound', city: 'Mumbai', state: 'Maharashtra',
    country: 'India', postalCode: '400013', phone: '+91-22-456-7890',
    email: 'mumbai@retailedge.ai', region: 'West', timezone: 'Asia/Kolkata',
    status: 'ONLINE', latitude: 18.9947, longitude: 72.8267,
    manager: 'Sneha Desai', footfall: 2100, footfallTrend: 15,
    sales: 380000, salesTrend: 12, devicesOnline: 12, devicesTotal: 12,
    lastUpdatedAt: '1 min ago', image: '/images/stores/store_004_tab.png',
  },
  {
    id: 'store-005', organizationId: 'org-001', name: 'Bangalore Indiranagar', code: 'STR-005',
    address: '100 Feet Road, Indiranagar', city: 'Bangalore', state: 'Karnataka',
    country: 'India', postalCode: '560038', phone: '+91-80-234-5678',
    email: 'bangalore@retailedge.ai', region: 'South', timezone: 'Asia/Kolkata',
    status: 'MAINTENANCE', latitude: 12.9784, longitude: 77.6408,
    manager: 'Kiran Reddy', footfall: 0, footfallTrend: 0,
    sales: 0, salesTrend: 0, devicesOnline: 0, devicesTotal: 8,
    lastUpdatedAt: '1 hour ago', image: '/images/stores/store_005_tab.png',
  },
];

export const users = [
  {
    id: 'usr-admin-001', name: 'Admin', email: 'admin@retailedge.ai',
    role: 'ADMIN', status: 'ACTIVE', storeId: null, avatar: null,
    department: 'Management', phone: '+91-98765-43210',
    lastLoginAt: new Date().toISOString(), createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'usr-mgr-001', name: 'Ravi Sharma', email: 'ravi@retailedge.ai',
    role: 'STORE_MANAGER', status: 'ACTIVE', storeId: 'store-001', avatar: null,
    department: 'Store Operations', phone: '+91-98765-11111',
    lastLoginAt: '2024-09-24T08:30:00Z', createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'usr-mgr-002', name: 'Priya Kapoor', email: 'priya@retailedge.ai',
    role: 'REGIONAL_MANAGER', status: 'ACTIVE', storeId: null, avatar: null,
    department: 'Regional Operations', phone: '+91-98765-22222',
    lastLoginAt: '2024-09-24T09:15:00Z', createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'usr-staff-001', name: 'Amit Patel', email: 'amit@retailedge.ai',
    role: 'STAFF', status: 'ACTIVE', storeId: 'store-001', avatar: null,
    department: 'Floor Staff', phone: '+91-98765-33333',
    lastLoginAt: '2024-09-24T07:00:00Z', createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'usr-staff-002', name: 'Sneha Desai', email: 'sneha@retailedge.ai',
    role: 'STAFF', status: 'ACTIVE', storeId: 'store-004', avatar: null,
    department: 'Floor Staff', phone: '+91-98765-44444',
    lastLoginAt: '2024-09-23T18:00:00Z', createdAt: '2024-04-01T10:00:00Z',
  },
];

export const integrations = [
  {
    id: 'int-001', organizationId: 'org-001', storeId: 'store-001',
    name: 'EasyPOS Terminal', type: 'POS', provider: 'EasyPOS India',
    connectionType: 'API', status: 'CONNECTED',
    lastSyncAt: '2 min ago', syncFrequency: 'Real-time',
    icon: '/images/integrations/icon_easypos.png',
    createdAt: '2024-01-20T10:00:00Z', updatedAt: new Date().toISOString(),
  },
  {
    id: 'int-002', organizationId: 'org-001', storeId: 'store-001',
    name: 'SAP ERP', type: 'ERP', provider: 'SAP',
    connectionType: 'API', status: 'CONNECTED',
    lastSyncAt: '15 min ago', syncFrequency: 'Every 15 min',
    icon: '/images/integrations/icon_sap.png',
    createdAt: '2024-01-25T10:00:00Z', updatedAt: new Date().toISOString(),
  },
  {
    id: 'int-003', organizationId: 'org-001', storeId: 'store-001',
    name: 'Edge Gateway', type: 'EDGE', provider: 'RetailEdge',
    connectionType: 'MQTT', status: 'CONNECTED',
    lastSyncAt: 'Just now', syncFrequency: 'Real-time',
    icon: '/images/integrations/icon_edge.png',
    createdAt: '2024-02-01T10:00:00Z', updatedAt: new Date().toISOString(),
  },
  {
    id: 'int-004', organizationId: 'org-001', storeId: 'store-002',
    name: 'Tally ERP', type: 'ERP', provider: 'Tally Solutions',
    connectionType: 'API', status: 'DISCONNECTED',
    lastSyncAt: '2 hours ago', syncFrequency: 'Every 30 min',
    icon: '/images/integrations/icon_tally.png',
    createdAt: '2024-03-01T10:00:00Z', updatedAt: new Date().toISOString(),
  },
];
