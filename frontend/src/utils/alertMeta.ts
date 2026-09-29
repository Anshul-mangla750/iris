import { AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import type { AlertSeverity, AlertStatus, AlertSourceModule, AlertType } from '../types/alert';

export interface SeverityMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  border: string;
  icon: typeof AlertTriangle;
}

export function getAlertSeverityMeta(severity: AlertSeverity): SeverityMeta {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'Critical',
        badgeBg: 'bg-red-500',
        badgeText: 'text-white',
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
        sparklineColor: '#EF4444',
        border: 'border-red-100',
        icon: AlertTriangle,
      };
    case 'WARNING':
      return {
        label: 'Warning',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-white',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        sparklineColor: '#F59E0B',
        border: 'border-amber-100',
        icon: AlertTriangle,
      };
    case 'INFO':
    default:
      return {
        label: 'Info',
        badgeBg: 'bg-blue-500',
        badgeText: 'text-white',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        sparklineColor: '#3B82F6',
        border: 'border-blue-100',
        icon: Info,
      };
  }
}

export interface StatusMeta {
  label: string;
  pillClass: string;
  dotColor: string;
  colorHex: string;
}

export function getAlertStatusMeta(status: AlertStatus): StatusMeta {
  switch (status) {
    case 'OPEN':
      return {
        label: 'Open',
        pillClass: 'bg-red-50 text-red-600 border border-red-200/80',
        dotColor: 'bg-red-500',
        colorHex: '#EF4444',
      };
    case 'ACKNOWLEDGED':
      return {
        label: 'In Progress',
        pillClass: 'bg-amber-50 text-amber-600 border border-amber-200/80',
        dotColor: 'bg-amber-500',
        colorHex: '#F59E0B',
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        pillClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
        dotColor: 'bg-emerald-500',
        colorHex: '#10B981',
      };
    case 'IGNORED':
    default:
      return {
        label: 'Ignored',
        pillClass: 'bg-slate-50 text-slate-600 border border-slate-200',
        dotColor: 'bg-slate-400',
        colorHex: '#64748B',
      };
  }
}

export function getAlertSourceMeta(source: AlertSourceModule): { label: string; color: string } {
  switch (source) {
    case 'INVENTORY':
      return { label: 'Inventory', color: '#10B981' };
    case 'QUEUE':
      return { label: 'Queue', color: '#F59E0B' };
    case 'PLANOGRAM':
      return { label: 'Planogram', color: '#3B82F6' };
    case 'SHOPPER':
      return { label: 'Customer', color: '#8B5CF6' };
    case 'SYSTEM':
      return { label: 'System', color: '#64748B' };
    default:
      return { label: 'General', color: '#94A3B8' };
  }
}

export function getAlertTypeMeta(type: AlertType): { label: string } {
  switch (type) {
    case 'QUEUE_CONGESTION':
      return { label: 'Queue Congestion' };
    case 'OUT_OF_STOCK':
      return { label: 'Out of Stock' };
    case 'LOW_STOCK':
      return { label: 'Low Stock' };
    case 'PLANOGRAM_VIOLATION':
      return { label: 'Planogram Violation' };
    case 'HIGH_TRAFFIC':
      return { label: 'High Traffic' };
    case 'EDGE_OFFLINE':
      return { label: 'Edge Offline' };
    case 'SYSTEM_SYNC':
      return { label: 'System Sync' };
    case 'EMPTY_SHELF':
      return { label: 'Empty Shelf' };
    default:
      return { label: type };
  }
}

export { CheckCircle, Clock };
