import React from 'react';

export default function ScenarioButton({ scenarioKey, scenario, isActive, onClick }) {
  return (
    <button 
      onClick={() => onClick(scenarioKey)}
      className={`text-left p-4 rounded-xl border flex flex-col gap-2 transition-all ${isActive ? 'bg-accent/20 border-accent shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.02]' : 'bg-surface border-border hover:border-muted hover:bg-elevated'}`}
    >
      <div className="flex items-center gap-3">
         <span className="text-2xl">{scenario.icon}</span>
         <h4 className={`font-bold ${isActive ? 'text-white' : 'text-primary'}`}>{scenario.label}</h4>
      </div>
      <p className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-muted'}`}>
         {scenario.description}
      </p>
    </button>
  );
}
