import { scenarios } from './scenarios';
import { mockZones } from './mockData';

let intervalId = null;

let simState = {
  activeScenario: 'normal',
  intensity: 'Medium'
};

export const setEngineState = (stateObj) => {
  simState = { ...simState, ...stateObj };
};

function simulateQRActivity(dispatch) {
  const { setQrFeed, setIntentFlow } = dispatch;
  if (!setQrFeed || !setIntentFlow) return;

  const mockNames = ["Priya S.", "Arjun M.", "Neha K.", "Vikram P.", "Zara A.", "Rahul S.", "Simran K."];
  const eventTypes = ["entry", "intent", "zone_arrival", "exit"];

  // Generate 0–3 random QR events
  const count = Math.floor(Math.random() * 4);
  const newEvents = [];
  for (let i = 0; i < count; i++) {
    newEvents.push({
      id: crypto.randomUUID(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      attendeeName: mockNames[Math.floor(Math.random() * mockNames.length)],
      zone: mockZones[Math.floor(Math.random() * mockZones.length)].name,
      timestamp: Date.now()
    });
  }

  if (newEvents.length > 0) {
    setQrFeed(prev => [...newEvents, ...prev].slice(0, 100));
  }

  // Randomly shift intentFlow
  setIntentFlow(prev => {
    const next = { ...prev };
    mockZones.forEach(z => {
      // 30% chance to fluctuate intent flow
      if (Math.random() > 0.7) {
        next[z.name] = Math.max(0, (next[z.name] || Math.floor(Math.random()*10)) + (Math.floor(Math.random() * 5) - 2));
      }
    });
    return next;
  });
}

export const startSimulation = (dispatch) => {
  const { setZones, setQueues, setAlerts, setSimulationRunning } = dispatch;
  
  if (intervalId) return;
  setSimulationRunning(true);

  intervalId = setInterval(() => {
    const scenario = scenarios[simState.activeScenario] || scenarios.normal;
    const intensityNum = simState.intensity === 'High' ? 1.5 : (simState.intensity === 'Low' ? 0.5 : 1);

    setZones(prev => {
      const newZones = prev.map(z => {
        const target = scenario.zoneTarget(z);
        const diff = target - z.density;
        const change = (diff * 0.1 * intensityNum) + (Math.random() * 4 - 2);
        const newDensity = Math.min(100, Math.max(0, z.density + change));
        
        return {
          ...z,
          density: newDensity,
          waitTime: Math.max(0, Math.floor(newDensity / 10) + (Math.random() * 2 - 1)),
          trend: newDensity > z.density + 2 ? '↑' : newDensity < z.density - 2 ? '↓' : '→'
        };
      });

      // calculate alerts
      const alerts = [];
      if (simState.activeScenario === 'emergency') {
        alerts.push({ id: 'emer-general', type: 'emergency', message: 'EMERGENCY EVACUATION: Please proceed to the nearest exit immediately.' });
      }
      
      newZones.forEach(z => {
        if (z.density > 80) alerts.push({ id: `crit-${z.id}`, type: 'critical', message: `Critical overcrowding detected in ${z.name} (${Math.round(z.density)}%)` });
        else if (z.density > 60) alerts.push({ id: `warn-${z.id}`, type: 'warning', message: `High crowd density in ${z.name} (${Math.round(z.density)}%)` });
      });

      setAlerts(alerts);
      return newZones;
    });

    setQueues(prev => prev.map(q => {
      const base = q.baseWaitTime || 5;
      const target = scenario.queueTarget({ ...q, baseWaitTime: base });
      const diff = target - q.waitTime;
      const change = (diff * 0.15 * intensityNum) + (Math.random() * 2 - 1);
      const newWait = Math.max(0, q.waitTime + change);
      
      return {
        ...q,
        waitTime: newWait,
        trend: newWait > q.waitTime + 1 ? '↑' : newWait < q.waitTime - 1 ? '↓' : '→'
      };
    }));

    simulateQRActivity(dispatch);

  }, 4000);
};

export const stopSimulation = (dispatch) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (dispatch && dispatch.setSimulationRunning) {
    dispatch.setSimulationRunning(false);
  }
};

export const applyScenario = (name, dispatch) => {
  setEngineState({ activeScenario: name });
  if (dispatch && dispatch.setActiveScenario) {
    dispatch.setActiveScenario(name);
  }
  if (dispatch && dispatch.addLog) {
    dispatch.addLog(`Scenario manually changed to: ${name.toUpperCase()}`, 'info');
  }
};
