import React from 'react';

export default function KPICard({ label, value, icon, colorClass = "text-blue-400" }) {
  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-sm flex flex-col gap-1">
      <div className="flex justify-between items-center text-[#94A3B8]">
        <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
        <span className="text-lg opacity-70">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
