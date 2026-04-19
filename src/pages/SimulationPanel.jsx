import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { startSimulation, stopSimulation, applyScenario, setEngineState } from '../simulation/engine';
import SimLog from '../components/SimLog';
import { scenarios } from '../simulation/scenarios';

export default function SimulationPanel() {
  const context = useSimulation();
  const { simulationRunning, activeScenario, intensity, setIntensity, addLog } = context;
  const { zones } = context;
  
  const [selectedZones, setSelectedZones] = useState(zones.map(z => z.id));

  const handleToggleZone = (id) => {
    setSelectedZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]);
  };

  const toggleSim = () => {
    if (simulationRunning) {
      stopSimulation(context);
      addLog('Simulation stopped', 'warning');
    } else {
      startSimulation(context);
      addLog('Simulation started', 'info');
    }
  };

  const handleScenarioChange = (scenarioName) => {
    applyScenario(scenarioName, context);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Simulation Engine</h1>
        <p className="text-sm text-[#94A3B8]">Control AI data generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Scenarios */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-[#334155] pb-2">
              <h2 className="font-semibold tracking-wide text-white">Scenarios</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${simulationRunning ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'}`}>
                {simulationRunning ? 'ENGINE RUNNING' : 'ENGINE OFFLINE'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(scenarios).map(([key, config]) => (
                <button 
                  key={key}
                  onClick={() => handleScenarioChange(key)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all text-center
                    ${activeScenario === key 
                      ? 'border-blue-500 bg-blue-500/10 text-white' 
                      : 'border-[#334155] bg-[#0F172A] hover:border-gray-400 text-[#94A3B8]'
                    }`}
                >
                  <span className="capitalize font-semibold text-sm mb-1">{key}</span>
                  <span className="text-[10px] opacity-80 leading-tight">{config.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-sm">
              <h2 className="font-semibold text-sm tracking-wide text-[#94A3B8] uppercase mb-4">Master Controls</h2>
              
              <div className="flex flex-col gap-3 border-b border-[#334155] pb-5">
                <button 
                  onClick={toggleSim}
                  className={`py-3 px-4 rounded-lg font-bold text-lg transition-colors border shadow-sm ${simulationRunning ? 'bg-red-600/20 text-red-400 border-red-600/50 hover:bg-red-600 hover:text-white' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600/50'}`}
                >
                  {simulationRunning ? 'Stop Engine' : 'Start Engine'}
                </button>
                <button 
                  className="py-2.5 px-4 rounded-lg font-medium text-sm transition-colors border border-[#334155] bg-[#0F172A] text-[#F1F5F9] hover:bg-[#334155]"
                  onClick={() => window.location.reload()}
                >
                  Reset All State
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium block mb-2">Intensity</label>
                <div className="flex bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
                  {['Low', 'Medium', 'High'].map(level => (
                    <button 
                      key={level}
                      onClick={() => {
                        setIntensity(level);
                        setEngineState({ intensity: level });
                        addLog(`Intensity set to ${level}`, 'info');
                      }}
                      className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${intensity === level ? 'bg-[#334155] text-white shadow' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-sm">
              <h2 className="font-semibold text-sm tracking-wide text-[#94A3B8] uppercase mb-4">Affected Zones</h2>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                {zones.map(z => (
                  <label key={z.id} className="flex items-center gap-3 cursor-pointer p-1.5 rounded hover:bg-[#0F172A] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedZones.includes(z.id)} 
                      onChange={() => handleToggleZone(z.id)}
                      className="w-4 h-4 rounded border-[#334155] bg-[#0F172A] accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-white select-none">{z.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 h-full max-h-[600px] flex flex-col">
           <SimLog />
        </div>
      </div>
    </div>
  );
}
