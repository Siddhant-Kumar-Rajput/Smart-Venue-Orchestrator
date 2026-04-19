import React from 'react';

export default function QueueItem({ name, waitTime, trend }) {
  let statusColor = "bg-green-500";
  let textColor = "text-green-400";
  if (waitTime > 15) {
    statusColor = "bg-red-600";
    textColor = "text-red-400";
  } else if (waitTime >= 8) {
    statusColor = "bg-amber-500";
    textColor = "text-amber-400";
  }

  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-sm flex justify-between items-center relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor}`}></div>
      <div className="pl-2">
        <h4 className="font-semibold text-[#F1F5F9]">{name}</h4>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xl font-bold ${textColor}`}>
          {Math.round(waitTime)} min
        </span>
        <span className={`text-xl font-bold w-4 text-center ${trend === '↑' ? 'text-red-400' : trend === '↓' ? 'text-green-400' : 'text-[#94A3B8]'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
