import React from 'react';
import ZoneBadge from '../shared/ZoneBadge';

export default function QueueItem({ zone, icon }) {
  const trendArrow = zone.trend === 'rising' ? '↑' : zone.trend === 'falling' ? '↓' : '−';
  const trendColor = zone.trend === 'rising' ? 'text-caution' : zone.trend === 'falling' ? 'text-safe' : 'text-muted';

  return (
    <div className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3">
      <div className="bg-elevated w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
         {icon}
      </div>
      <div className="flex-1 min-w-0">
         <h4 className="font-semibold text-sm text-primary truncate">{zone.name}</h4>
         <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
           <span>~{Math.round(zone.waitTime)}m wait</span>
           <span className={`font-bold ${trendColor}`}>{trendArrow}</span>
         </div>
      </div>
      <div className="shrink-0">
         <ZoneBadge density={zone.density} />
      </div>
    </div>
  );
}
