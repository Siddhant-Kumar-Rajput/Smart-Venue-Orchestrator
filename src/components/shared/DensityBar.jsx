import React from 'react';
import { densityColor } from '../../utils/density';

export default function DensityBar({ density, height = "h-1.5" }) {
  const d = Math.max(0, Math.min(100, density));
  const color = densityColor(d);
  
  return (
    <div className={`w-full bg-surface border border-border rounded-full overflow-hidden ${height}`}>
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-in-out" 
        style={{ width: `${d}%`, backgroundColor: color }}
      />
    </div>
  );
}
