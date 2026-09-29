import type { CameraStatus } from '../types/camera';

export interface CameraStatusMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  iconColor: string;
}

export function getCameraStatusMeta(status: CameraStatus): CameraStatusMeta {
  switch (status) {
    case 'ONLINE':
      return {
        label: 'Live',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-500',
        iconColor: 'text-emerald-500',
      };
    case 'OFFLINE':
      return {
        label: 'Offline',
        badgeBg: 'bg-red-50',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-200/80',
        dotColor: 'bg-red-500',
        iconColor: 'text-red-500',
      };
    case 'MAINTENANCE':
      return {
        label: 'Maintenance',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200/80',
        dotColor: 'bg-amber-500',
        iconColor: 'text-amber-500',
      };
    case 'ERROR':
      return {
        label: 'Error',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200/80',
        dotColor: 'bg-rose-500',
        iconColor: 'text-rose-500',
      };
    default:
      return {
        label: 'Unknown',
        badgeBg: 'bg-slate-50',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200/80',
        dotColor: 'bg-slate-400',
        iconColor: 'text-slate-400',
      };
  }
}
