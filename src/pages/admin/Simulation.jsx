import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';
import { scenarios } from '../../engine/scenarios';
import ScenarioButton from '../../components/admin/ScenarioButton';
import SimLog from '../../components/admin/SimLog';
import EngineStatusDot from '../../components/shared/EngineStatusDot';
import { startEngine, stopEngine, resetEngine } from '../../engine';

export default function Simulation() {
  const { state, dispatch, stateRef } = useContext(VenueContext);
  const { running, scenario, intensity } = state.engine;

  const handleStartStop = () => {
    if (running) {
      stopEngine(dispatch);
    } else {
      startEngine(dispatch, stateRef); 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Simulation Controls */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6 overflow-y-auto pb-10">
         
         <div className="bg-surface border border-border rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col gap-4 shrink-0">
           {running && <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>}
           <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-1">Engine Control</h2>
                <div className="flex items-center gap-3">
                  <EngineStatusDot size="lg" />
                  <span className="text-xs text-muted font-mono bg-elevated px-2 py-1 rounded">Tick: {state.engine.tickCount} • Update: 4s</span>
                </div>
              </div>
              <button 
                 onClick={handleStartStop}
                 className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 ${running ? 'bg-border text-primary hover:bg-elevated border border-border' : 'bg-accent text-white hover:bg-blue-600'}`}
              >
                 {running ? 'STOP ENGINE' : 'START SIMULATION'}
              </button>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-5">
               <h3 className="font-bold text-primary mb-4 text-xs uppercase tracking-wider">Engine Intensity (Noise / Walk-ins)</h3>
               <div className="flex rounded-lg overflow-hidden border border-border bg-base">
                  {['low', 'medium', 'high'].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => dispatch({ type: 'ENGINE_SET_INTENSITY', payload: lvl })}
                      className={`flex-1 py-2 font-medium text-sm transition-colors uppercase ${intensity === lvl ? 'bg-primary text-base shadow-sm' : 'text-muted hover:text-primary hover:bg-elevated'}`}
                    >
                      {lvl}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-center">
               <h3 className="font-bold text-primary mb-4 text-xs uppercase tracking-wider">Master Reset</h3>
               <button 
                 onClick={() => {
                   if (confirm("Reset simulation to zero occupancy?")) resetEngine(dispatch);
                 }}
                 className="w-full border border-critical text-critical hover:bg-critical hover:text-white py-2 font-bold rounded-lg transition-colors text-sm"
               >
                 Reset to 0% Baseline
               </button>
            </div>
         </div>

         <h3 className="font-bold text-primary mt-4 border-b border-border pb-2 text-lg">Load Scenario</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(scenarios).map(key => (
               <ScenarioButton 
                 key={key} 
                 scenarioKey={key} 
                 scenario={scenarios[key]} 
                 isActive={scenario === key}
                 onClick={(k) => {
                   dispatch({ type: 'ENGINE_SET_SCENARIO', payload: k });
                   if (scenarios[k].onActivate) {
                      scenarios[k].onActivate(dispatch);
                   }
                 }}
               />
            ))}
         </div>
      </div>

      {/* Log Panel */}
      <div className="w-full lg:w-1/3 h-[500px] lg:h-auto shrink-0 shadow-xl">
         <SimLog logs={state.simLog} />
      </div>

    </div>
  );
}
