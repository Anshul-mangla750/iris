export type PaymentMode = 'UPI' | 'Card' | 'Cash' | 'Wallet';
export type TransactionSyncStatus = 'Synced' | 'Syncing' | 'Failed';

export interface PosTransaction {
  id: string;
  organizationId: string;
  storeId: string;
  transactionId: string;
  sourceIntegrationId: string;
  timestamp: string; // e.g. "03:24 PM"
  itemCount: number;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  syncStatus: TransactionSyncStatus;
  posSource?: string;
  createdAt?: string;
}
