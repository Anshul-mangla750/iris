import React from 'react';
import { X, Mail, Phone, Shield, Store, Clock, Calendar, Pencil, Power } from 'lucide-react';
import type { User } from '../../types/user';

interface UserProfileDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">User Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xs shrink-0 overflow-hidden ${
                user.avatarBg || 'bg-emerald-600'
              }`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span>{user.initials}</span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">{user.name}</h4>
              <p className="text-slate-500 text-xs">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.roleName}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    user.presenceStatus === 'ONLINE' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.presenceStatus === 'ONLINE' ? 'bg-[#0fa968]' : 'bg-slate-400'
                    }`}
                  />
                  {user.presenceStatus === 'ONLINE' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-slate-600">
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email:</span>
              </span>
              <span className="font-semibold text-slate-800">{user.email}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone:</span>
              </span>
              <span className="font-semibold text-slate-800">{user.phone || '+91 98765 43210'}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Role:</span>
              </span>
              <span className="font-semibold text-slate-800">{user.roleName}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Store Access:</span>
              </span>
              <span className="font-semibold text-slate-800">{user.storeAccessText}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Login:</span>
              </span>
              <span className="font-semibold text-slate-800">{user.lastLoginAt || 'Never'}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Member Since:</span>
              </span>
              <span className="font-semibold text-slate-800">
                {user.createdAt ? user.createdAt.split('T')[0] : '2024-01-15'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              user.status === 'ACTIVE'
                ? 'border-red-200 text-red-600 bg-white hover:bg-red-50'
                : 'border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#0fa968] hover:bg-[#0d8f58] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDrawer;
