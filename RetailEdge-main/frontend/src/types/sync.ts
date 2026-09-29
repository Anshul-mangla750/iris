export interface DataSyncPoint {
  date: string; // "18 Sep", "19 Sep", etc.
  posSales: number;
  inventoryUpdates: number;
  productData: number;
  storeData: number;
}

export interface SyncOverviewData {
  range: string;
  points: DataSyncPoint[];
}
