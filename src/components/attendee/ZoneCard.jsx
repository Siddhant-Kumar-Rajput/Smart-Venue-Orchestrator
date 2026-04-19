import React from 'react';
import DensityBar from '../shared/DensityBar';

export default function ZoneCard({ zone }) {
  const isRising = zone.trend === 'rising';
  const isFalling = zone.trend === 'falling';
  
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center">
         <h4 className="font-bold text-primary">{zone.name}</h4>
         <div className="flex items-center gap-1 text-sm text-muted">
           {isRising && <span className="text-caution font-bold">↑</span>}
           {isFalling && <span className="text-safe font-bold">↓</span>}
           {!isRising && !isFalling && <span>−</span>}
         </div>
      </div>
      
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
         <div>
           <DensityBar density={zone.density} />
           <div className="text-[10px] text-muted mt-1 uppercase tracking-wide">Capacity Load</div>
         </div>
         <div className="text-right">
           <div className="font-bold text-xl text-primary">{Math.round(zone.density)}%</div>
         </div>
      </div>
      
      <div className="bg-elevated/50 p-2 rounded flex justify-between items-center text-xs">
         <span className="text-muted">Wait time:</span>
         <span className="font-semibold text-primary">~{Math.round(zone.waitTime)} mins</span>
      </div>
    </div>
  );
}
