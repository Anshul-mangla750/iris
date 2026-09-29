import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { StoreStatus } from '../types/store';

export interface StoreStatusMeta {
  label: string;
  pillClass: string;
  dotColor: string;
  colorHex: string;
  isAlert?: boolean;
}

export function getStoreStatusMeta(status: StoreStatus): StoreStatusMeta {
  switch (status) {
    case 'ONLINE':
      return {
        label: 'Online',
        pillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
        dotColor: 'bg-emerald-500',
        colorHex: '#10B981',
      };
    case 'ALERT':
      return {
        label: 'Alert',
        pillClass: 'bg-red-50 text-red-700 border border-red-200/80',
        dotColor: 'bg-red-500',
        colorHex: '#EF4444',
        isAlert: true,
      };
    case 'OFFLINE':
      return {
        label: 'Offline',
        pillClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        dotColor: 'bg-slate-400',
        colorHex: '#64748B',
      };
    case 'MAINTENANCE':
    default:
      return {
        label: 'Maintenance',
        pillClass: 'bg-amber-50 text-amber-700 border border-amber-200/80',
        dotColor: 'bg-amber-500',
        colorHex: '#F59E0B',
      };
  }
}

export { AlertTriangle, CheckCircle, Clock };
