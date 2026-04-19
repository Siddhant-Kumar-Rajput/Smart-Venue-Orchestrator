import { scenarios } from './scenarios';
import { checkAlertRules } from './alertRules';
import { simulateQRTick } from './qrSimulator';

let engineInterval = null;

export function startEngine(dispatch, stateRef) {
  if (engineInterval) return;

  dispatch({ type: 'ENGINE_START' });

  const tick = () => {
    const state = stateRef?.current;
    if (!state) return;
    
    const { zones, engine, alerts } = state;
    if (!engine.running) return;

    const currentScenario = scenarios[engine.scenario] || scenarios.normal;
    let noiseLevel = currentScenario.noise;
    if (engine.intensity === 'low') noiseLevel *= 0.5;
    if (engine.intensity === 'high') noiseLevel *= 1.5;

    const updates = zones.map(zone => {
      const targetDensity = currentScenario.zoneTargets[zone.id] || 50;
      
      const drift = (targetDensity - zone.density) * 0.1;
      const noise = (Math.random() * noiseLevel * 2) - noiseLevel;
      
      let newDensity = zone.density + drift + noise;
      newDensity = Math.max(0, Math.min(100, newDensity));

      const oldDensity = zone.density;
      const pctChange = newDensity - oldDensity;
      let trend = "stable";
      if (pctChange > 3) trend = "rising";
      else if (pctChange < -3) trend = "falling";

      let waitTime = 0;
      if (newDensity <= 40) waitTime = newDensity * 0.1;
      else if (newDensity <= 70) waitTime = 4 + (newDensity - 40) * 0.3;
      else if (newDensity <= 90) waitTime = 13 + (newDensity - 70) * 0.6;
      else waitTime = 25 + (newDensity - 90) * 1.5;
      
      return {
        id: zone.id,
        density: newDensity,
        occupancy: Math.round((newDensity / 100) * zone.capacity),
        waitTime: waitTime,
        trend
      };
    });

    dispatch({ type: 'ENGINE_TICK', payload: updates });
    
    checkAlertRules(zones, alerts, dispatch);
    simulateQRTick(zones, dispatch);
  };

  engineInterval = setInterval(tick, 4000);
}

export function stopEngine(dispatch) {
  if (engineInterval) {
    clearInterval(engineInterval);
    engineInterval = null;
  }
  dispatch({ type: 'ENGINE_STOP' });
}

export function resetEngine(dispatch) {
  stopEngine(dispatch);
  dispatch({ type: 'ENGINE_RESET' });
}
