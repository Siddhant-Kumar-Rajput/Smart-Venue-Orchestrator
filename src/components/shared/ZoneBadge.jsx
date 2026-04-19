import React from 'react';
import { densityBgClass, densityLabel } from '../../utils/density';

export default function ZoneBadge({ density }) {
  const bg = densityBgClass(density);
  const label = densityLabel(density);
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${bg}`}>
      {label}
    </span>
  );
}
