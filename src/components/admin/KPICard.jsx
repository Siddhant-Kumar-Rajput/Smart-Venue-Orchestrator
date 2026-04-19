import React from 'react';

export default function KPICard({ label, value, subtext, icon, trend }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start text-muted">
         <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
         <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-end gap-3 mt-1">
         <span className="text-3xl font-bold text-primary">{value}</span>
         {trend && (
           <span className={`text-sm mb-1 ${trend > 0 ? 'text-caution' : 'text-safe'}`}>
             {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
           </span>
         )}
      </div>
      {subtext && <div className="text-[10px] text-muted">{subtext}</div>}
    </div>
  );
}
