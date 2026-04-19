import React, { createContext, useContext, useReducer, useRef } from 'react';

const initialState = {
  isAdminAuthenticated: false,
  venue: {
    name: "Smart Venue Orchestrator",
    event: "Welcome to the event",
    date: "April 19, 2025",
    totalCapacity: 45000,
    currentAttendance: 0,
  },
  engine: {
    running: false,
    scenario: "normal",
    intensity: "medium",
    tickCount: 0,
    speed: 1,
  },
  zones: [
    { id: "gate-1", name: "Gate 1", category: "entry", capacity: 2000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.505, lng: -0.090, description: "Main north entrance" },
    { id: "gate-2", name: "Gate 2", category: "entry", capacity: 2000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.503, lng: -0.088 },
    { id: "gate-3", name: "Gate 3", category: "entry", capacity: 2000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.501, lng: -0.090 },
    { id: "north-stand", name: "North Stand", category: "seating", capacity: 10000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.506, lng: -0.091 },
    { id: "south-stand", name: "South Stand", category: "seating", capacity: 10000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.500, lng: -0.091 },
    { id: "food-court-a", name: "Food Court A", category: "food", capacity: 1500, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.504, lng: -0.093 },
    { id: "food-court-b", name: "Food Court B", category: "food", capacity: 1500, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.502, lng: -0.093 },
    { id: "restroom-a", name: "Restroom Block A", category: "restroom", capacity: 200, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.505, lng: -0.094 },
    { id: "restroom-b", name: "Restroom Block B", category: "restroom", capacity: 200, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.503, lng: -0.094 },
    { id: "main-stage", name: "Main Stage Area", category: "stage", capacity: 8000, occupancy: 0, density: 0, waitTime: 0, trend: "stable", intent: 0, lat: 51.504, lng: -0.091 },
  ],
  alerts: [],
  attendees: [],
  intentFlow: {},
  staff: [
    { id: "s1", name: "Amir Khan", zoneId: "gate-1", status: "active" },
    { id: "s2", name: "Priya Nair", zoneId: "gate-2", status: "active" },
    { id: "s3", name: "Ravi Mehta", zoneId: "food-court-a", status: "active" },
    { id: "s4", name: "Sara Qureshi", zoneId: "north-stand", status: "active" },
    { id: "s5", name: "Dev Sharma", zoneId: "south-stand", status: "break" },
    { id: "s6", name: "Zara Ahmed", zoneId: "main-stage", status: "active" },
    { id: "s7", name: "Kabir Singh", zoneId: "restroom-a", status: "active" },
    { id: "s8", name: "Nisha Patel", zoneId: "gate-3", status: "active" },
  ],
  incidents: [],
  qrFeed: [],
  cameras: [
    { id: "cam-01", name: "Gate 1 Entrance", zoneId: "gate-1", ip: "192.168.1.101", resolution: "1080p", status: "disconnected" },
    { id: "cam-02", name: "North Concourse", zoneId: "north-stand", ip: "192.168.1.102", resolution: "1080p", status: "disconnected" },
    { id: "cam-03", name: "Food Court A", zoneId: "food-court-a", ip: "192.168.1.103", resolution: "720p", status: "disconnected" },
    { id: "cam-04", name: "Gate 3 Entry", zoneId: "gate-3", ip: "192.168.1.104", resolution: "1080p", status: "disconnected" },
    { id: "cam-05", name: "South Stand View", zoneId: "south-stand", ip: "192.168.1.105", resolution: "1080p", status: "disconnected" },
    { id: "cam-06", name: "Main Stage Wide", zoneId: "main-stage", ip: "192.168.1.106", resolution: "4K", status: "disconnected" },
  ],
  simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'info', message: 'System Initialised' }]
};

function venueReducer(state, action) {
  switch (action.type) {
    case 'ADMIN_LOGIN':
      return { ...state, isAdminAuthenticated: true };
    case 'ADMIN_LOGOUT':
      return { ...state, isAdminAuthenticated: false };
      
    case 'ENGINE_START':
      return { ...state, engine: { ...state.engine, running: true }, simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'info', message: 'Engine Started' }, ...state.simLog].slice(0, 50) };
    case 'ENGINE_STOP':
      return { ...state, engine: { ...state.engine, running: false }, simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'info', message: 'Engine Stopped' }, ...state.simLog].slice(0, 50) };
    case 'ENGINE_RESET':
      return { 
        ...state, 
        zones: state.zones.map(z => ({ ...z, density: 0, occupancy: 0, waitTime: 0, trend: 'stable' })),
        simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'info', message: 'Engine Reset to Baseline' }, ...state.simLog].slice(0, 50)
      };
    case 'ENGINE_SET_SCENARIO':
      return { 
        ...state, 
        engine: { ...state.engine, scenario: action.payload },
        simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'scenario', message: `Scenario changed to ${action.payload}` }, ...state.simLog].slice(0, 50)
      };
    case 'ENGINE_SET_INTENSITY':
      return { ...state, engine: { ...state.engine, intensity: action.payload } };
    case 'ENGINE_SET_SPEED':
      return { ...state, engine: { ...state.engine, speed: action.payload } };
    case 'ENGINE_TICK':
      // payload: array of zone updates { id, occupancy, density, waitTime, trend }
      return { 
        ...state, 
        engine: { ...state.engine, tickCount: state.engine.tickCount + 1 },
        zones: state.zones.map(z => {
          const update = action.payload.find(u => u.id === z.id);
          return update ? { ...z, ...update } : z;
        })
      };

    case 'ZONE_SET_INTENT': {
      // payload: { zoneId, delta: +1 or -1 }
      const newIntentFlow = { ...state.intentFlow };
      const current = newIntentFlow[action.payload.zoneId] || 0;
      newIntentFlow[action.payload.zoneId] = Math.max(0, current + action.payload.delta);
      return { ...state, intentFlow: newIntentFlow };
    }

    case 'ATTENDEE_REGISTER':
      return { ...state, attendees: [...state.attendees, action.payload] };
    case 'ATTENDEE_UPDATE_ZONE':
      return {
        ...state,
        attendees: state.attendees.map(a => a.id === action.payload.id ? { ...a, currentZoneId: action.payload.zoneId } : a)
      };
    case 'ATTENDEE_SET_INTENT':
      return {
        ...state,
        attendees: state.attendees.map(a => a.id === action.payload.id ? { ...a, intendedZoneId: action.payload.zoneId, intentTime: Date.now() } : a)
      };
    case 'ATTENDEE_EXIT':
      return {
        ...state,
        attendees: state.attendees.map(a => a.id === action.payload.id ? { ...a, status: 'exited' } : a)
      };

    case 'ALERT_ADD':
      return { 
        ...state, 
        alerts: [action.payload, ...state.alerts],
        simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'alert', message: `ALERT FIRED: ${action.payload.title}` }, ...state.simLog].slice(0, 50)
      };
    case 'ALERT_ACKNOWLEDGE':
      return {
        ...state,
        alerts: state.alerts.map(a => a.id === action.payload.id ? { ...a, acknowledged: true } : a)
      };
    case 'ALERT_CLEAR_ALL':
      return { ...state, alerts: state.alerts.filter(a => !a.acknowledged) };

    case 'INCIDENT_ADD':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'INCIDENT_RESOLVE':
      return {
        ...state,
        incidents: state.incidents.map(i => i.id === action.payload.id ? { ...i, status: 'resolved', resolvedAt: Date.now() } : i)
      };

    case 'STAFF_UPDATE_STATUS':
      return {
        ...state,
        staff: state.staff.map(s => s.id === action.payload.id ? { ...s, status: action.payload.status } : s)
      };
    case 'STAFF_UPDATE_ZONE':
      return {
        ...state,
        staff: state.staff.map(s => s.id === action.payload.id ? { ...s, zoneId: action.payload.zoneId } : s)
      };

    case 'QR_EVENT_ADD': {
      let updatedAttendance = state.venue.currentAttendance;
      if (action.payload.eventType === 'entry') updatedAttendance++;
      if (action.payload.eventType === 'exit') updatedAttendance = Math.max(0, updatedAttendance - 1);

      return { 
        ...state, 
        venue: { ...state.venue, currentAttendance: updatedAttendance },
        qrFeed: [action.payload, ...state.qrFeed].slice(0, 100),
        simLog: [{ id: crypto.randomUUID(), time: Date.now(), type: 'qr', message: `QR Event: ${action.payload.eventType} at ${action.payload.zoneName}` }, ...state.simLog].slice(0, 50)
      };
    }

    case 'VENUE_INCREMENT_ATTENDANCE':
      return { ...state, venue: { ...state.venue, currentAttendance: state.venue.currentAttendance + 1 }};

    default:
      return state;
  }
}

export const VenueContext = createContext(null);

export const VenueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(venueReducer, initialState);
  const stateRef = useRef(state);
  
  // Always keep ref up to date
  stateRef.current = state;

  return (
    <VenueContext.Provider value={{ state, dispatch, stateRef }}>
      {children}
    </VenueContext.Provider>
  );
};
