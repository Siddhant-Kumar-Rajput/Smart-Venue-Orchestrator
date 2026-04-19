import React from 'react';
import DensityBar from '../shared/DensityBar';
import ZoneBadge from '../shared/ZoneBadge';

export default function DestinationTile({ zone, walkTime, onClick }) {
  const isFull = zone.density >= 90;
  
  return (
    <div 
      onClick={onClick}
      className={`bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 transition-colors ${isFull ? 'opacity-60 grayscale-[50%]' : 'hover:border-accent cursor-pointer'}`}
    >
      <div className="flex justify-between items-start">
         <h3 className="font-bold text-lg text-primary">{zone.name}</h3>
         <ZoneBadge density={zone.density} />
      </div>

      <DensityBar density={zone.density} />

      <div className="flex justify-between items-center text-sm">
         <div className="flex gap-3 text-primary font-medium">
            <span>{Math.round(zone.density)}% full</span>
            <span className="text-muted">•</span>
            <span>~{Math.round(zone.waitTime)}m wait</span>
         </div>
         <div className="text-muted text-xs">
           ~{walkTime}m walk
         </div>
      </div>
    </div>
  );
}
