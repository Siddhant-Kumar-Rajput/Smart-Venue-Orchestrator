import React from 'react';

export default function ZoneCard({ name, density, waitTime, trend }) {
  const densityPercent = Math.min(100, Math.max(0, density));
  
  let statusColor = "bg-green-500";
  if (densityPercent > 70) {
    statusColor = "bg-red-600";
  } else if (densityPercent >= 40) {
    statusColor = "bg-amber-500";
  }

  return (
    <div className={`rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden transition-colors`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor}`}></div>
      <div className="flex justify-between items-start pl-2">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-sm ${statusColor}`}>
          Wait: {waitTime}m
        </span>
      </div>
      <div className="pl-2">
        <div className="flex justify-between text-xs text-[#94A3B8] mb-1 font-medium select-none">
          <span>Density {Math.round(densityPercent)}% {trend}</span>
        </div>
        <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden shadow-inner">
          <div className={`${statusColor} h-full rounded-full transition-all duration-500 ease-out`} style={{width: `${densityPercent}%`}}></div>
        </div>
      </div>
    </div>
  );
}
