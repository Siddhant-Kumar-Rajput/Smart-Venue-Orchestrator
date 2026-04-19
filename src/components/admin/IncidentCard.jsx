import React from 'react';

export default function IncidentCard({ incident, zoneName, onResolve }) {
  const isCritical = incident.severity === 'critical';
  const bg = isCritical ? 'bg-critical/10 border-critical/30' : 'bg-surface border-border';
  
  return (
    <div className={`p-4 rounded-xl border ${bg} flex flex-col gap-3 shadow-sm`}>
      <div className="flex justify-between items-start">
         <div>
           <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mb-2 ${isCritical ? 'bg-critical text-white' : 'bg-caution text-white'}`}>
              {incident.type}
           </div>
           <h4 className="font-bold text-primary text-sm">{zoneName}</h4>
         </div>
         {incident.status === 'open' && (
           <span className="text-xs text-red-400 font-bold animate-pulse">● OPEN</span>
         )}
      </div>
      
      <p className="text-sm text-muted line-clamp-2">{incident.notes}</p>
      
      {incident.status === 'open' && (
        <button 
          onClick={() => onResolve(incident.id)}
          className="mt-2 w-full border border-border text-primary hover:bg-elevated hover:border-primary text-xs py-2 rounded-lg font-medium transition-colors"
        >
          Resolve Incident
        </button>
      )}
    </div>
  );
}
