import React, { useState } from 'react';
import { Cpu, ShieldCheck, Check, Sparkles } from 'lucide-react';
import type { AISettings } from '../../types/settings';

interface AIAnalyticsSettingsPanelProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const AIAnalyticsSettingsPanel: React.FC<AIAnalyticsSettingsPanelProps> = ({
  settings: initialSettings,
  onSave,
}) => {
  const [form, setForm] = useState<AISettings>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#e8f8f0] text-[#0fa968] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">AI Vision & Analytics Pipeline</h2>
            <p className="text-xs text-slate-500">
              Configure edge neural inference, privacy masking, and computer vision thresholds
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          YOLOv8 + ByteTrack Active
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Processing Mode & Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              AI Processing Mode
            </label>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Select where live video inference and bounding box detections run.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['Edge', 'Cloud', 'Hybrid'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setForm({ ...form, processingMode: mode })}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    form.processingMode === mode
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900">Privacy & PII Masking</label>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Automatically blur shopper faces and sensitive checkout areas before streaming to dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, privacyMode: !form.privacyMode })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                form.privacyMode ? 'bg-[#0fa968]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  form.privacyMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Retention & Confidence Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Data Retention Period
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Timeframe to retain raw dwell heatmaps and bounding-box audit logs.
            </p>
            <select
              value={form.dataRetentionDays}
              onChange={(e) => setForm({ ...form, dataRetentionDays: Number(e.target.value) })}
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            >
              <option value={7}>7 days (Minimal footprint)</option>
              <option value={30}>30 days (Recommended)</option>
              <option value={90}>90 days (Quarterly analytics)</option>
              <option value={180}>180 days (Regulatory audit)</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-900">
                AI Detection Confidence Threshold
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {form.confidenceThreshold}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Minimum confidence score required to flag planogram violations or queue alerts.
            </p>
            <input
              type="range"
              min={50}
              max={95}
              value={form.confidenceThreshold}
              onChange={(e) => setForm({ ...form, confidenceThreshold: Number(e.target.value) })}
              className="w-full accent-[#0fa968] cursor-pointer"
            />
          </div>
        </div>

        {/* Enabled Features */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <p className="text-xs font-bold text-slate-900 mb-3">Active Vision Models</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'shopperAnalytics', label: 'Shopper Footfall & Dwell Tracking' },
              { key: 'queuePrediction', label: 'Queue Length & Flow Estimator' },
              { key: 'inventoryDetection', label: 'Shelf Void & Out-of-Stock Sensor' },
              { key: 'planogramDetection', label: 'Planogram Facing Compliance Model' },
              { key: 'aiInsights', label: 'Automated Operations Intelligence' },
            ].map(({ key, label }) => {
              const active = form.features[key as keyof typeof form.features];
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer text-xs text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        features: {
                          ...form.features,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {isSaved && <Check className="w-3.5 h-3.5" />}
            <span>Save AI Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAnalyticsSettingsPanel;
