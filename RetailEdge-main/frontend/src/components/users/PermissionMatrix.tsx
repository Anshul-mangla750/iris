import React from 'react';
import { Check, X } from 'lucide-react';
import type { PermissionMatrixRow } from '../../types/permission';

interface PermissionMatrixProps {
  matrix: PermissionMatrixRow[];
  onCellClick: (moduleName: string, roleName: string, allowed: boolean) => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  matrix,
  onCellClick,
}) => {
  const renderCell = (module: string, roleName: string, allowed: boolean) => {
    return (
      <button
        type="button"
        onClick={() => onCellClick(module, roleName, allowed)}
        className={`w-7 h-6 rounded-md flex items-center justify-center transition-all ${
          allowed
            ? 'bg-[#e8f8f0] text-[#0fa968] hover:bg-[#d5f3e4]'
            : 'bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2]'
        }`}
        title={`Click to edit ${roleName} access for ${module}`}
      >
        {allowed ? (
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Permission Matrix
        </h2>
        <p className="text-[11.5px] text-slate-500 mt-0.5">
          View and manage module access for each role.
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-600">
              <th className="py-2 px-2.5 text-slate-800">Module</th>
              <th className="py-2 px-2 text-center">Super Admin</th>
              <th className="py-2 px-2 text-center">Store Manager</th>
              <th className="py-2 px-2 text-center">Inventory Staff</th>
              <th className="py-2 px-2 text-center">Cashier</th>
              <th className="py-2 px-2 text-center">Security</th>
              <th className="py-2 px-2 text-center">Analyst</th>
              <th className="py-2 px-2 text-center">Viewer</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr
                key={row.module}
                className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-xs text-slate-700"
              >
                <td className="py-2 px-2.5 font-medium text-slate-800 whitespace-nowrap text-[11.5px]">
                  {row.module}
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Super Admin', row.superAdmin)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Store Manager', row.storeManager)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Inventory Staff', row.inventoryStaff)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Cashier', row.cashier)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Security', row.security)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Analyst', row.analyst)}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex justify-center">
                    {renderCell(row.module, 'Viewer', row.viewer)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
