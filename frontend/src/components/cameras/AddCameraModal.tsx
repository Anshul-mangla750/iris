import React, { useState } from 'react';
import { X, Video, AlertCircle } from 'lucide-react';
import type { CreateCameraInput, CameraType, CameraStatus } from '../../types/camera';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCameraInput) => Promise<unknown>;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [storeId] = useState('store-001');
  const [zoneName, setZoneName] = useState('Entrance');
  const [type, setType] = useState<CameraType>('GENERAL');
  const [resolution, setResolution] = useState('HD 1080p');
  const [fps, setFps] = useState<number>(30);
  const [status, setStatus] = useState<CameraStatus>('ONLINE');
  const [streamIdentifier, setStreamIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Camera name is required';
    if (!code.trim()) errs.code = 'Camera code is required';
    if (!zoneName.trim()) errs.zoneName = 'Store zone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        code: code.trim(),
        storeId,
        zoneId: `zone-${zoneName.toLowerCase().replace(/\s+/g, '-')}`,
        zoneName: zoneName.trim(),
        type,
        resolution,
        fps,
        status,
        streamIdentifier: streamIdentifier.trim() || `rtsp://edge-01.local/live/${code.toLowerCase().trim()}`,
        description: description.trim(),
      });
      onClose();
    } catch {
      setErrors({ form: 'Failed to create camera. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Add New Store Camera
              </h3>
              <p className="text-xs text-slate-500">
                Register edge CCTV device with RetailEdge AI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errors.form && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg border border-red-200/80 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Camera Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Camera 7 - Electronics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 transition-colors ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                    : 'border-slate-200 focus:ring-emerald-500'
                }`}
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name}</span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Camera Code *
              </label>
              <input
                type="text"
                placeholder="e.g. CAM007"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 transition-colors ${
                  errors.code
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                    : 'border-slate-200 focus:ring-emerald-500'
                }`}
              />
              {errors.code && (
                <span className="text-[10px] text-red-500 mt-0.5 block">{errors.code}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Zone / Section *
              </label>
              <input
                type="text"
                placeholder="e.g. Aisle 3 (Cosmetics)"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Camera Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CameraType)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="GENERAL">GENERAL</option>
                <option value="SHELF">SHELF</option>
                <option value="CHECKOUT">CHECKOUT</option>
                <option value="ENTRANCE">ENTRANCE</option>
                <option value="EXIT">EXIT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="HD 1080p">HD 1080p</option>
                <option value="4K UHD">4K UHD</option>
                <option value="720p">720p</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                FPS
              </label>
              <input
                type="number"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CameraStatus)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              RTSP Stream URL (Optional)
            </label>
            <input
              type="text"
              placeholder="rtsp://edge-01.local/live/cam07"
              value={streamIdentifier}
              onChange={(e) => setStreamIdentifier(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Notes on camera coverage or mount location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0c8f58] text-white font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Camera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCameraModal;
