import React from 'react';
import DensityBar from '../shared/DensityBar';

export default function SuggestionCard({ alt, onSelect }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg text-primary">{alt.name}</h4>
        {alt.savingMins > 0 && (
          <span className="text-xs font-bold text-safe bg-safe/10 px-2 py-1 rounded border border-safe/20">
            Save ~{alt.savingMins} mins
          </span>
        )}
      </div>

      <DensityBar density={alt.density} />

      <div className="flex gap-4 text-sm text-muted">
        <span>Wait: <strong className="text-primary">~{Math.round(alt.waitTime)}m</strong></span>
        <span>Walk: <strong className="text-primary">~{alt.walkTime}m</strong></span>
      </div>

      <button 
        onClick={() => onSelect(alt)}
        className="w-full bg-accent hover:bg-blue-700 text-white rounded-xl py-3 font-semibold shadow-md transition-colors"
      >
        Take me here &rarr;
      </button>
    </div>
  );
}
