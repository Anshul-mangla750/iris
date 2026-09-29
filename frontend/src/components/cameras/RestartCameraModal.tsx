import React, { useState } from 'react';
import { RotateCw, CheckCircle2 } from 'lucide-react';
import type { Camera } from '../../types/camera';

interface RestartCameraModalProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestart: (cameraId: string) => Promise<unknown>;
}

export const RestartCameraModal: React.FC<RestartCameraModalProps> = ({
  camera,
  isOpen,
  onClose,
  onConfirmRestart,
}) => {
  const [phase, setPhase] = useState<'idle' | 'restarting' | 'reconnecting' | 'done'>('idle');

  if (!isOpen || !camera) return null;

  const handleRestart = async () => {
    try {
      setPhase('restarting');
      await new Promise((r) => setTimeout(r, 700));
      setPhase('reconnecting');
      await new Promise((r) => setTimeout(r, 700));
      await onConfirmRestart(camera.id);
      setPhase('done');
      await new Promise((r) => setTimeout(r, 600));
      setPhase('idle');
      onClose();
    } catch {
      setPhase('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-5 text-center">
        {phase === 'idle' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <RotateCw className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Restart Camera?
            </h3>

            <p className="text-xs text-slate-600 mt-1.5">
              <span className="font-semibold text-slate-800">{camera.name}</span>{' '}
              {camera.status === 'OFFLINE'
                ? 'is currently offline. Initiating a device restart will ping PoE Switch 2 and re-establish the RTSP handshake.'
                : 'will be temporarily disconnected during the power cycle.'}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg bg-[#0fa968] hover:bg-[#0c8f58] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                Restart Device
              </button>
            </div>
          </>
        ) : phase === 'done' ? (
          <div className="py-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-slate-900">Device Online!</h4>
            <p className="text-xs text-slate-500 mt-0.5">Stream handshake restored</p>
          </div>
        ) : (
          <div className="py-4">
            <RotateCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">
              {phase === 'restarting' ? 'Restarting device...' : 'Reconnecting RTSP feed...'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Please wait a moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestartCameraModal;
