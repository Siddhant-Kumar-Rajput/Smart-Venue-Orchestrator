import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';

export default function EngineStatusDot({ size = 'sm' }) {
  const { state } = useContext(VenueContext);
  const isRunning = state.engine.running;

  const dotClass = size === 'lg' ? 'w-4 h-4' : 'w-2 h-2';
  const textClass = size === 'lg' ? 'text-sm font-bold' : 'text-[10px] font-semibold uppercase tracking-wider';
  const paddingClass = size === 'lg' ? 'px-4 py-2 rounded-lg' : 'px-2 py-1 rounded-full';

  if (!isRunning) {
    return (
      <div className={`flex items-center gap-2 bg-elevated border border-border text-muted ${paddingClass}`}>
        <span className={`${dotClass} rounded-full bg-border`}></span>
        <span className={textClass}>Paused</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-safe/10 border border-safe/30 text-safe ${paddingClass}`}>
      <span className="relative flex items-center justify-center">
         <span className={`absolute inline-flex h-full w-full rounded-full bg-safe opacity-75 animate-ping`}></span>
         <span className={`relative inline-flex rounded-full bg-safe ${dotClass}`}></span>
      </span>
      <span className={textClass}>Live</span>
    </div>
  );
}
