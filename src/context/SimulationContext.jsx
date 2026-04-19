import React, { createContext, useContext, useState } from 'react';
import { mockZones, mockQueues, mockStaff, mockCameras } from '../simulation/mockData';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  // Initialize zones with density, waitTime and staffCount
  const initialZones = mockZones.map(zone => {
    const staffCount = mockStaff.filter(s => s.zone === zone.name).length;
    return {
      ...zone,
      density: zone.defaultDensity,
      waitTime: Math.floor(zone.defaultDensity / 10), // arbitrary baseline
      staffCount,
      trend: '→'
    };
  });

  const [zones, setZones] = useState(initialZones);
  const [queues, setQueues] = useState(mockQueues);
  const [alerts, setAlerts] = useState([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [activeScenario, setActiveScenario] = useState('normal');
  const [intensity, setIntensity] = useState('Medium');
  const [simLog, setSimLog] = useState([{ time: new Date().toLocaleTimeString(), message: 'System initialized', type: 'info' }]);
  
  // App-level state (could be separate context, but keeping together for prototype simplicity)
  const [authEnabled, setAuthEnabled] = useState(false);
  const [staff, setStaff] = useState(mockStaff);
  const [incidents, setIncidents] = useState([]);
  
  // V2 Added State
  const [attendees, setAttendees] = useState([]);
  const [intentFlow, setIntentFlow] = useState({});
  const [qrFeed, setQrFeed] = useState([]);
  const [cctvCameras, setCctvCameras] = useState(mockCameras);

  const addLog = (message, type = 'info') => {
    setSimLog(prev => {
      const newLog = [...prev, { time: new Date().toLocaleTimeString(), message, type }];
      return newLog.slice(-50); // cap at 50
    });
  };

  const value = {
    zones, setZones,
    queues, setQueues,
    alerts, setAlerts,
    simulationRunning, setSimulationRunning,
    activeScenario, setActiveScenario,
    intensity, setIntensity,
    simLog, setSimLog, addLog,
    authEnabled, setAuthEnabled,
    staff, setStaff,
    incidents, setIncidents,
    attendees, setAttendees,
    intentFlow, setIntentFlow,
    qrFeed, setQrFeed,
    cctvCameras, setCctvCameras
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
