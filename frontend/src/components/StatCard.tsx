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
  accent = 'blue'
}) => {
  const accentClasses = {
    blue: {
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      glow: 'group-hover:border-sky-500/40'
    },
    pink: {
      bg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      glow: 'group-hover:border-pink-500/40'
    },
    emerald: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      glow: 'group-hover:border-emerald-500/40'
    }
  }[accent];

  return (
    <div className={`group bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:bg-slate-900/90 transition-all ${accentClasses.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2 rounded-xl border ${accentClasses.bg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {badge && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
