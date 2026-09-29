import React from 'react';
import { Check } from 'lucide-react';

interface SnapshotToastProps {
  message: string | null;
}

export const SnapshotToast: React.FC<SnapshotToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
      <div className="text-xs font-semibold">{message}</div>
    </div>
  );
};

export default SnapshotToast;
