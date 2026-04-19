import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function AlertStrip() {
  const { alerts } = useSimulation();
  const [dismissed, setDismissed] = useState(new Set()); // Not fully working cross-component in prototype, but fine

  const handleDismiss = (id) => {
    setDismissed(new Set([...dismissed, id]));
  };

  const activeAlerts = alerts.filter(a => !dismissed.has(a.id));

  if (activeAlerts.length === 0) return null;

  // We show only the highest severity alert or just stack them. Stacking one by one is fine for prototype.
  return (
    <div className="w-full flex flex-col z-40 relative">
      {activeAlerts.map(alert => {
        let bgClass = "bg-blue-500 text-white";
        if (alert.type === 'critical' || alert.type === 'emergency') bgClass = "bg-red-600 text-white font-bold";
        if (alert.type === 'warning') bgClass = "bg-amber-500 text-black";

        return (
          <div key={alert.id} className={`${bgClass} px-4 py-3 flex justify-between items-center shadow-md animate-in slide-in-from-top-2`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {alert.type === 'emergency' ? '🚨' : alert.type === 'critical' ? '⚠️' : alert.type === 'warning' ? '⚡' : 'ℹ️'}
              </span>
              <span>{alert.message}</span>
            </div>
            <button onClick={() => handleDismiss(alert.id)} className="text-current opacity-70 hover:opacity-100 p-1 font-bold">
               ✕
            </button>
          </div>
        )
      })}
    </div>
  );
}
