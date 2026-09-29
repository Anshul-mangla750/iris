import type { LowStockProductItem } from '../types/inventory';
import type { Store } from '../types/store';

/**
 * Exports low stock & out-of-stock items to a downloadable CSV file.
 */
export function exportInventoryToCsv(
  items: LowStockProductItem[],
  filename: string = 'retailedge-inventory-report.csv'
) {
  if (!items || items.length === 0) return;

  const headers = [
    '#',
    'Product Name',
    'SKU',
    'Current Stock',
    'Expected Stock',
    'Status',
    'Aisle / Shelf',
    'Last Detected',
  ];
  const rows = items.map((item, idx) => [
    idx + 1,
    `"${item.productName.replace(/"/g, '""')}"`,
    `"${item.sku}"`,
    item.currentStock,
    item.expectedStock,
    `"${item.status}"`,
    `"${item.aisleShelf}"`,
    `"${item.lastDetected}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports stores list to a downloadable CSV file.
 */
export function exportStoresToCsv(
  stores: Store[],
  filename: string = 'retailedge-stores-export.csv'
) {
  if (!stores || stores.length === 0) return;

  const headers = [
    '#',
    'Store Name',
    'Store Code',
    'Location',
    'Region',
    'Status',
    'Footfall Today',
    'Sales Today (INR)',
    'Online Devices',
    'Total Devices',
    'Last Updated',
  ];

  const rows = stores.map((store, idx) => [
    idx + 1,
    `"${store.name.replace(/"/g, '""')}"`,
    `"${store.code}"`,
    `"${store.city}"`,
    `"${store.region}"`,
    `"${store.status}"`,
    store.footfall,
    store.sales,
    store.devicesOnline,
    store.devicesTotal,
    `"${store.lastUpdatedAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
