import React from 'react';
import { Users, UserCheck, UserX, ShieldCheck, Key } from 'lucide-react';
import UserKpiCard from './UserKpiCard';
import type { UserSummary } from '../../types/user';

interface UserKpiGridProps {
  summary: UserSummary;
}

export const UserKpiGrid: React.FC<UserKpiGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-4">
      {/* 1. Total Users */}
      <UserKpiCard
        title="Total Users"
        value={summary?.totalUsers ?? 28}
        trendText={`↑ ${summary?.trends?.totalUsers ?? 12}%`}
        trendType="up"
        icon={Users}
        iconBg="bg-[#eaf8f0]"
        iconColor="text-[#0fa968]"
        sparklineColor="#0fa968"
        sparklinePoints={[18, 22, 19, 24, 23, 26, 28]}
      />

      {/* 2. Active Users */}
      <UserKpiCard
        title="Active Users"
        value={summary?.activeUsers ?? 24}
        trendText={`↑ ${summary?.trends?.activeUsers ?? 9}%`}
        trendType="up"
        icon={UserCheck}
        iconBg="bg-[#f5eeff]"
        iconColor="text-[#8b5cf6]"
        sparklineColor="#8b5cf6"
        sparklinePoints={[16, 18, 20, 19, 21, 23, 24]}
      />

      {/* 3. Inactive Users */}
      <UserKpiCard
        title="Inactive Users"
        value={summary?.inactiveUsers ?? 4}
        trendText={`↓ ${Math.abs(summary?.trends?.inactiveUsers ?? 33)}%`}
        trendType="down"
        icon={UserX}
        iconBg="bg-[#fef2f2]"
        iconColor="text-[#ef4444]"
        sparklineColor="#ef4444"
        sparklinePoints={[10, 8, 7, 6, 5, 4, 4]}
      />

      {/* 4. User Roles */}
      <UserKpiCard
        title="User Roles"
        value={summary?.userRoles ?? 6}
        trendText={`— ${summary?.trends?.userRoles ?? 0}%`}
        trendType="neutral"
        icon={ShieldCheck}
        iconBg="bg-[#eff6ff]"
        iconColor="text-[#2563eb]"
        sparklineColor="#2563eb"
        sparklinePoints={[6, 6, 6, 6, 6, 6, 6]}
      />

      {/* 5. Permission Groups */}
      <UserKpiCard
        title="Permission Groups"
        value={summary?.permissionGroups ?? 12}
        trendText={`↑ ${summary?.trends?.permissionGroups ?? 20}%`}
        trendType="up"
        icon={Key}
        iconBg="bg-[#fffbeb]"
        iconColor="text-[#f59e0b]"
        sparklineColor="#f59e0b"
        sparklinePoints={[8, 9, 10, 10, 11, 11, 12]}
      />
    </div>
  );
};

export default UserKpiGrid;
