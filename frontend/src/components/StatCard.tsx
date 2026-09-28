import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  accent?: 'blue' | 'pink' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}) => {
  return (
    <div className="bg-[#101010] border border-[#252525] hover:border-[#383838] rounded-2xl p-5 sm:p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] text-neutral-400 font-medium">
          {title}
        </span>
        <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-neutral-300" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-neutral-400 mt-1.5 font-normal leading-normal">{subtitle}</p>}
    </div>
  );
};
