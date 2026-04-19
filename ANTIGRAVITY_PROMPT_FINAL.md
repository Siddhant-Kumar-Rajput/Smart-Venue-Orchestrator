# SMART VENUE ORCHESTRATOR
## Final Build Prompt — Complete Unified System
### For Google Antigravity Agent

---

> Read this entire file before writing a single line of code.
> This is not an update to previous prompts. This is the definitive
> specification. Previous prompts (V1, V2) are superseded entirely.
> Build everything from scratch according to this file alone.

---

# PART 1 — THE PRODUCT STORY

## What This System Actually Is

Smart Venue Orchestrator is a **single living system** with two windows
into it — one for the person attending the event, one for the team
running it. Both windows look at the same data. Both update in real time.
When an attendee scans a QR code and taps "I want food", that action
immediately appears as a data point on the admin's heatmap. When the
admin triggers a crowd surge in the simulation, the attendee's app
immediately warns them and suggests a safer route. They are not two apps.
They are two perspectives on one system.

The simulation engine is not a developer tool. It is the venue's heartbeat.
It runs continuously in the background, generating the kind of data a real
venue would produce from sensors, cameras, and foot traffic. In a real
deployment, this engine would be replaced by live inputs. For this
prototype, it IS the live input. It should feel that way — not like a
toggle in a settings panel, but like a pulse the entire system breathes to.

## The One Sentence This System Must Communicate

**"We know where the crowd is, where it is going, and we are already
routing people away from problems before those problems happen."**

Every screen — whether an attendee is reading it on their phone or an
admin is reading it on a monitor — must serve this sentence.

## The Three Roles, Clearly Defined

**Role 1 — The Attendee**
A person at a large venue. They are on their phone. They want to know
where to go, how long they will wait, and whether there is a better
option. They scanned a QR code at the entrance. The system now knows
who they are, where they entered, and where they want to go. It guides
them. It suggests. It warns them before they walk into a crowd.

**Role 2 — The Admin / Operations Staff**
A venue manager or safety officer. They are on a tablet or laptop at
their station. They need to see the whole venue at once. They need to
know which zones are filling up, which staff are where, and what
incidents are open. They also need to be able to trigger scenario
simulations to test the system or run drills.

**Role 3 — The System Itself**
The simulation engine. It runs continuously. It is neither attendee-facing
nor admin-facing — it feeds both. It generates crowd density, queue wait
times, attendee movements, and intent flows. It can be instructed to
simulate specific scenarios (surge, emergency, half-time rush, VIP
movement). Its output is indistinguishable from real sensor data in
terms of how the UI responds to it.

---

# PART 2 — TECHNICAL FOUNDATION

## Stack (Non-Negotiable)

```
Framework:      React 18 + Vite
Language:       JavaScript only (no TypeScript)
Styling:        Tailwind CSS (utility classes only, no custom CSS files)
Routing:        React Router v6
State:          React Context + useReducer (no external state library)
Charts:         Recharts
Maps:           Leaflet + react-leaflet
Notifications:  react-hot-toast
```

No Redux. No Zustand. No TanStack Query. No backend. No database.
No API calls. All data lives in React Context and resets on page refresh.
This is correct and intentional for a prototype.

## The One Context That Rules Everything

There is one context: `VenueContext`. It holds all system state.
Every component in the app — attendee-facing or admin-facing — reads
from and writes to this single context. This is what makes the two
sides of the app feel like one system: they literally share the same
data store.

```javascript
// src/context/VenueContext.jsx
// This is the complete state shape. Build it exactly like this.

const initialState = {

  // ── VENUE IDENTITY ────────────────────────────────────────────────
  venue: {
    name: "Metro Arena",
    event: "Championship Finals 2025",
    date: "April 19, 2025",
    totalCapacity: 45000,
    currentAttendance: 0,   // increments as attendees register
  },

  // ── SIMULATION ENGINE ─────────────────────────────────────────────
  engine: {
    running: false,
    scenario: "normal",      // normal | surge | emergency | halftime | vip
    intensity: "medium",     // low | medium | high
    tickCount: 0,
    speed: 1,                // 1x | 2x | 5x
  },

  // ── ZONES ─────────────────────────────────────────────────────────
  // 10 zones. Each zone has occupancy (current people),
  // capacity (max people), and intent (people heading there).
  zones: [
    { id: "gate-1",    name: "Gate 1",              category: "entry",
      capacity: 2000,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.505,     lng: -0.090,   // Leaflet coordinates
      description: "Main north entrance" },

    { id: "gate-2",    name: "Gate 2",              category: "entry",
      capacity: 2000,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.503,     lng: -0.088 },

    { id: "gate-3",    name: "Gate 3",              category: "entry",
      capacity: 2000,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.501,     lng: -0.090 },

    { id: "north-stand",  name: "North Stand",      category: "seating",
      capacity: 10000, occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.506,     lng: -0.091 },

    { id: "south-stand",  name: "South Stand",      category: "seating",
      capacity: 10000, occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.500,     lng: -0.091 },

    { id: "food-court-a", name: "Food Court A",     category: "food",
      capacity: 1500,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.504,     lng: -0.093 },

    { id: "food-court-b", name: "Food Court B",     category: "food",
      capacity: 1500,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.502,     lng: -0.093 },

    { id: "restroom-a",   name: "Restroom Block A", category: "restroom",
      capacity: 200,   occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.505,     lng: -0.094 },

    { id: "restroom-b",   name: "Restroom Block B", category: "restroom",
      capacity: 200,   occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.503,     lng: -0.094 },

    { id: "main-stage",   name: "Main Stage Area",  category: "stage",
      capacity: 8000,  occupancy: 0, density: 0,
      waitTime: 0,     trend: "stable", intent: 0,
      lat: 51.504,     lng: -0.091 },
  ],

  // ── ALERTS ────────────────────────────────────────────────────────
  alerts: [
    // { id, type: "emergency|critical|warning|info",
    //   title, message, zoneId, timestamp, acknowledged: false }
  ],

  // ── ATTENDEES (QR registered) ─────────────────────────────────────
  attendees: [
    // { id, name, phone, entryGateId, entryTime,
    //   currentZoneId, intendedZoneId, intentTime, status: "active|exited" }
  ],

  // ── INTENT FLOW ───────────────────────────────────────────────────
  // Count of attendees who have tapped intent for each zone
  // Keys are zone IDs. Updated every time an attendee sets a destination.
  intentFlow: {},

  // ── STAFF ─────────────────────────────────────────────────────────
  staff: [
    { id: "s1", name: "Amir Khan",   zoneId: "gate-1",    status: "active" },
    { id: "s2", name: "Priya Nair",  zoneId: "gate-2",    status: "active" },
    { id: "s3", name: "Ravi Mehta",  zoneId: "food-court-a", status: "active" },
    { id: "s4", name: "Sara Qureshi",zoneId: "north-stand",  status: "active" },
    { id: "s5", name: "Dev Sharma",  zoneId: "south-stand",  status: "break" },
    { id: "s6", name: "Zara Ahmed",  zoneId: "main-stage",   status: "active" },
    { id: "s7", name: "Kabir Singh", zoneId: "restroom-a",   status: "active" },
    { id: "s8", name: "Nisha Patel", zoneId: "gate-3",       status: "active" },
  ],

  // ── INCIDENTS ─────────────────────────────────────────────────────
  incidents: [
    // { id, type, zoneId, severity, notes, status: "open|resolved",
    //   createdAt, resolvedAt }
  ],

  // ── QR ACTIVITY FEED (last 100 events) ───────────────────────────
  qrFeed: [],

  // ── CCTV CAMERAS (concept data — non-functional) ──────────────────
  cameras: [
    { id: "cam-01", name: "Gate 1 Entrance",   zoneId: "gate-1",
      ip: "192.168.1.101", resolution: "1080p", status: "disconnected" },
    { id: "cam-02", name: "North Concourse",   zoneId: "north-stand",
      ip: "192.168.1.102", resolution: "1080p", status: "disconnected" },
    { id: "cam-03", name: "Food Court A",      zoneId: "food-court-a",
      ip: "192.168.1.103", resolution: "720p",  status: "disconnected" },
    { id: "cam-04", name: "Gate 3 Entry",      zoneId: "gate-3",
      ip: "192.168.1.104", resolution: "1080p", status: "disconnected" },
    { id: "cam-05", name: "South Stand View",  zoneId: "south-stand",
      ip: "192.168.1.105", resolution: "1080p", status: "disconnected" },
    { id: "cam-06", name: "Main Stage Wide",   zoneId: "main-stage",
      ip: "192.168.1.106", resolution: "4K",    status: "disconnected" },
  ],
};
```

## Reducer Actions

```javascript
// All state changes go through dispatch(). No direct state mutation.
// Action types:

"ENGINE_START"            // set engine.running = true
"ENGINE_STOP"             // set engine.running = false
"ENGINE_RESET"            // reset all zone densities to baseline
"ENGINE_SET_SCENARIO"     // set engine.scenario
"ENGINE_SET_INTENSITY"    // set engine.intensity
"ENGINE_TICK"             // payload: array of zone updates
                          // each: { id, occupancy, density, waitTime, trend }

"ZONE_SET_INTENT"         // payload: { zoneId, delta: +1 or -1 }
                          // updates intentFlow[zoneId]

"ATTENDEE_REGISTER"       // payload: attendee object — push to attendees[]
"ATTENDEE_UPDATE_ZONE"    // payload: { id, zoneId } — update currentZoneId
"ATTENDEE_SET_INTENT"     // payload: { id, zoneId } — update intendedZoneId
"ATTENDEE_EXIT"           // payload: { id } — set status to "exited"

"ALERT_ADD"               // payload: alert object — unshift to alerts[]
"ALERT_ACKNOWLEDGE"       // payload: { id } — set acknowledged = true
"ALERT_CLEAR_ALL"         // clear all acknowledged alerts

"INCIDENT_ADD"            // payload: incident object
"INCIDENT_RESOLVE"        // payload: { id }

"STAFF_UPDATE_STATUS"     // payload: { id, status }
"STAFF_UPDATE_ZONE"       // payload: { id, zoneId }

"QR_EVENT_ADD"            // payload: qr event — unshift, cap array at 100

"VENUE_INCREMENT_ATTENDANCE"  // increment venue.currentAttendance by 1
```

---

# PART 3 — THE SIMULATION ENGINE

## Location: `src/engine/`

```
src/engine/
├── index.js          Main engine — tick loop, exports start/stop/reset
├── scenarios.js      Scenario configs
├── alertRules.js     Rules that generate alerts from zone state
└── qrSimulator.js    Generates mock QR events every tick
```

## How the Engine Works

The engine runs a `setInterval` tick every 4 seconds (adjustable by
`engine.speed`). On each tick it:

1. Reads current zone states from a local reference copy
2. Applies the active scenario's influence on each zone's density
3. Adds random realistic noise (±2–8% per zone per tick)
4. Clamps density between 0 and 100
5. Derives waitTime from density using a curve:
   - density 0–40: waitTime = density * 0.1 mins (0–4 mins)
   - density 41–70: waitTime = 4 + (density-40) * 0.3 mins (4–13 mins)
   - density 71–90: waitTime = 13 + (density-70) * 0.6 mins (13–25 mins)
   - density 91–100: waitTime = 25 + (density-90) * 1.5 mins (25–40 mins)
6. Sets trend based on change from last tick:
   - increased >3%: "rising"
   - decreased >3%: "falling"
   - else: "stable"
7. Dispatches ENGINE_TICK with the full array of zone updates
8. Runs alertRules.js to check if any alerts should fire
9. Runs qrSimulator.js to generate mock QR activity

## Scenarios

```javascript
// src/engine/scenarios.js

export const scenarios = {
  normal: {
    label: "Normal Operations",
    icon: "✅",
    description: "Steady crowd, manageable queues. Baseline state.",
    zoneTargets: {
      // density targets each zone drifts toward
      "gate-1": 45,   "gate-2": 35,   "gate-3": 40,
      "north-stand": 60, "south-stand": 55, "main-stage": 65,
      "food-court-a": 50, "food-court-b": 40,
      "restroom-a": 45, "restroom-b": 40,
    },
    noise: 5,  // ±5% random variation per tick
  },

  surge: {
    label: "Crowd Surge",
    icon: "🌊",
    description: "Sudden influx at entry gates. North Stand filling fast.",
    zoneTargets: {
      "gate-1": 92,   "gate-2": 78,   "gate-3": 88,
      "north-stand": 85, "south-stand": 60, "main-stage": 70,
      "food-court-a": 65, "food-court-b": 50,
      "restroom-a": 70, "restroom-b": 55,
    },
    noise: 8,
  },

  emergency: {
    label: "Emergency",
    icon: "🚨",
    description: "Critical incident at Main Stage. Evacuation in progress.",
    zoneTargets: {
      "gate-1": 98,   "gate-2": 95,   "gate-3": 97,
      "north-stand": 40, "south-stand": 35, "main-stage": 100,
      "food-court-a": 30, "food-court-b": 25,
      "restroom-a": 20, "restroom-b": 18,
    },
    noise: 3,
    // Emergency also auto-fires a critical alert on activation
    onActivate: (dispatch) => {
      dispatch({ type: "ALERT_ADD", payload: {
        id: crypto.randomUUID(),
        type: "emergency",
        title: "EMERGENCY — Main Stage",
        message: "Critical incident reported. All staff respond immediately. Attendees are being rerouted.",
        zoneId: "main-stage",
        timestamp: Date.now(),
        acknowledged: false,
      }});
    }
  },

  halftime: {
    label: "Half-Time Rush",
    icon: "🍔",
    description: "Break period. Food courts and restrooms at peak demand.",
    zoneTargets: {
      "gate-1": 30,   "gate-2": 25,   "gate-3": 28,
      "north-stand": 20, "south-stand": 18, "main-stage": 10,
      "food-court-a": 95, "food-court-b": 88,
      "restroom-a": 92, "restroom-b": 89,
    },
    noise: 6,
  },

  vip: {
    label: "VIP Movement",
    icon: "⭐",
    description: "VIP convoy routing. Gate 2 and South Stand restricted.",
    zoneTargets: {
      "gate-1": 55,   "gate-2": 98,   "gate-3": 50,
      "north-stand": 60, "south-stand": 95, "main-stage": 65,
      "food-court-a": 55, "food-court-b": 50,
      "restroom-a": 48, "restroom-b": 42,
    },
    noise: 4,
  },
};
```

## Alert Rules

```javascript
// src/engine/alertRules.js
// Runs after every tick. Fires alerts based on zone state.
// Does NOT fire the same alert repeatedly — track fired alerts by zone.

export function checkAlertRules(zones, existingAlerts, dispatch) {
  zones.forEach(zone => {
    const alreadyAlerted = existingAlerts.some(
      a => a.zoneId === zone.id && !a.acknowledged &&
           Date.now() - a.timestamp < 60000  // within last 60 seconds
    );
    if (alreadyAlerted) return;

    if (zone.density >= 90) {
      dispatch({ type: "ALERT_ADD", payload: {
        id: crypto.randomUUID(), type: "critical",
        title: `Critical — ${zone.name}`,
        message: `${zone.name} is at ${zone.density}% capacity. Immediate action required.`,
        zoneId: zone.id, timestamp: Date.now(), acknowledged: false,
      }});
    } else if (zone.density >= 75 && zone.trend === "rising") {
      dispatch({ type: "ALERT_ADD", payload: {
        id: crypto.randomUUID(), type: "warning",
        title: `Warning — ${zone.name}`,
        message: `${zone.name} is at ${zone.density}% and rising. Consider rerouting attendees.`,
        zoneId: zone.id, timestamp: Date.now(), acknowledged: false,
      }});
    }
  });
}
```

## QR Simulator

```javascript
// src/engine/qrSimulator.js
// Generates realistic mock QR events each tick so the admin feed
// always has activity, even without real attendees scanning.

const mockNames = [
  "Arjun M.", "Priya S.", "Rahul K.", "Zara A.", "Dev P.",
  "Neha R.", "Vikram S.", "Ananya T.", "Kabir N.", "Meera V."
];

export function simulateQRTick(zones, dispatch) {
  const count = Math.floor(Math.random() * 4); // 0–3 events per tick
  const types = ["entry", "intent", "zone_arrival", "exit"];

  for (let i = 0; i < count; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    dispatch({
      type: "QR_EVENT_ADD",
      payload: {
        id: crypto.randomUUID(),
        eventType: type,
        attendeeName: mockNames[Math.floor(Math.random() * mockNames.length)],
        zoneId: zone.id,
        zoneName: zone.name,
        timestamp: Date.now(),
      }
    });
  }
}
```

---

# PART 4 — VISUAL DESIGN SYSTEM

## One Design Language for Both Sides

The attendee app and the admin dashboard look different in layout
(mobile vs desktop) but use identical colours, typography, and component
patterns. When someone uses the attendee app and then looks at the admin
screen, they should recognise the same system.

## Colours

Configure these in `tailwind.config.js` as custom colours so they can
be used as `bg-base`, `bg-surface`, `text-primary`, etc.

```javascript
// tailwind.config.js
colors: {
  base:     "#0F172A",   // App background
  surface:  "#1E293B",   // Cards, panels, sidebars
  elevated: "#334155",   // Dropdowns, modals, hover states
  border:   "#475569",   // All borders and dividers
  primary:  "#F1F5F9",   // Main readable text
  muted:    "#94A3B8",   // Secondary text, timestamps, labels
  accent:   "#3B82F6",   // Primary interactive elements, links, buttons
  safe:     "#22C55E",   // Low density, OK status, open zones
  caution:  "#F59E0B",   // Moderate density, growing queues
  critical: "#EF4444",   // High density, emergency, full zones
  info:     "#38BDF8",   // Informational alerts, advisory notices
}
```

## Density → Colour Function

Use this everywhere a zone's density needs a colour. Make it a shared
utility function in `src/utils/density.js`.

```javascript
export function densityColor(density) {
  if (density < 40)  return "#22C55E";  // safe
  if (density < 70)  return "#F59E0B";  // caution
  return "#EF4444";                      // critical
}

export function densityLabel(density) {
  if (density < 40)  return "Open";
  if (density < 70)  return "Busy";
  return "Full";
}

export function densityBgClass(density) {
  if (density < 40)  return "bg-safe/10 border-safe/30 text-safe";
  if (density < 70)  return "bg-caution/10 border-caution/30 text-caution";
  return "bg-critical/10 border-critical/30 text-critical";
}
```

## Typography

Add Inter from Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```
Set `font-family: 'Inter', sans-serif` on the body.

## Standard Components (Used Everywhere)

**Card:**
`className="bg-surface border border-border rounded-xl p-4 shadow-sm"`

**Badge (status):**
`className="rounded-full px-2.5 py-0.5 text-xs font-semibold border"`
+ densityBgClass(density) for zone status badges

**Button — Primary:**
`className="bg-accent hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors"`

**Button — Ghost:**
`className="border border-border text-muted hover:text-primary hover:border-primary rounded-lg px-4 py-2.5 font-medium transition-colors"`

**Button — Danger:**
`className="bg-critical hover:bg-red-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors"`

---

# PART 5 — APPLICATION STRUCTURE

## Folder Structure

```
src/
├── engine/
│   ├── index.js          Simulation engine (tick loop)
│   ├── scenarios.js      Scenario configs
│   ├── alertRules.js     Alert generation rules
│   └── qrSimulator.js    Mock QR event generator
│
├── context/
│   └── VenueContext.jsx  Single context + useReducer + provider
│
├── utils/
│   ├── density.js        Density → colour/label utilities
│   ├── suggestions.js    Suggestion engine logic
│   └── directions.js     Walking directions lookup table
│
├── components/
│   ├── shared/           Used by BOTH attendee and admin
│   │   ├── AlertBanner.jsx
│   │   ├── ZoneBadge.jsx
│   │   ├── DensityBar.jsx
│   │   └── EngineStatusDot.jsx   Pulsing dot showing engine is running
│   │
│   ├── attendee/         Attendee-specific components
│   │   ├── ZoneCard.jsx
│   │   ├── QueueItem.jsx
│   │   ├── DestinationTile.jsx
│   │   ├── SuggestionCard.jsx
│   │   └── WalkingStep.jsx
│   │
│   └── admin/            Admin-specific components
│       ├── KPICard.jsx
│       ├── StaffRow.jsx
│       ├── IncidentCard.jsx
│       ├── QRFeedRow.jsx
│       ├── CameraCard.jsx
│       ├── IntentArrow.jsx
│       ├── SimLog.jsx
│       └── ScenarioButton.jsx
│
├── layouts/
│   ├── AttendeeLayout.jsx   Header + bottom nav for mobile attendee
│   ├── AdminLayout.jsx      Sidebar + topbar for desktop admin
│   └── FullscreenLayout.jsx Used for /scan, /register, /welcome (QR flow)
│
├── pages/
│   ├── Landing.jsx
│   │
│   ├── attendee/
│   │   ├── Dashboard.jsx
│   │   ├── VenueMap.jsx
│   │   └── Queues.jsx
│   │
│   ├── qr/                 The QR attendee journey
│   │   ├── Scan.jsx
│   │   ├── Register.jsx
│   │   ├── Welcome.jsx
│   │   ├── Go.jsx
│   │   ├── Suggest.jsx
│   │   └── Navigate.jsx
│   │
│   └── admin/
│       ├── Dashboard.jsx
│       ├── HeatMap.jsx
│       ├── IntentMap.jsx
│       ├── Staff.jsx
│       ├── Incidents.jsx
│       ├── QRFeed.jsx
│       ├── CCTV.jsx
│       └── Simulation.jsx
│
└── App.jsx               Router setup
```

---

# PART 6 — ROUTES AND NAVIGATION

## Complete Route Map

```jsx
// App.jsx — route structure

<Routes>
  {/* LANDING */}
  <Route path="/" element={<Landing />} />

  {/* QR ATTENDEE JOURNEY — fullscreen mobile layouts */}
  <Route element={<FullscreenLayout />}>
    <Route path="/scan"     element={<Scan />} />
    <Route path="/register" element={<Register />} />
    <Route path="/welcome"  element={<Welcome />} />
    <Route path="/go"       element={<Go />} />
    <Route path="/suggest"  element={<Suggest />} />
    <Route path="/navigate" element={<Navigate />} />
  </Route>

  {/* ATTENDEE DASHBOARD — mobile with bottom nav */}
  <Route element={<AttendeeLayout />}>
    <Route path="/attendee"        element={<AttendeeDashboard />} />
    <Route path="/attendee/map"    element={<VenueMap />} />
    <Route path="/attendee/queues" element={<Queues />} />
  </Route>

  {/* ADMIN — protected, desktop with sidebar */}
  <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
    <Route path="/admin"             element={<AdminDashboard />} />
    <Route path="/admin/heatmap"     element={<HeatMap />} />
    <Route path="/admin/intent"      element={<IntentMap />} />
    <Route path="/admin/staff"       element={<Staff />} />
    <Route path="/admin/incidents"   element={<Incidents />} />
    <Route path="/admin/qr-feed"     element={<QRFeed />} />
    <Route path="/admin/cctv"        element={<CCTV />} />
    <Route path="/admin/simulation"  element={<Simulation />} />
  </Route>
</Routes>
```

## AdminGuard Component

```jsx
// AdminGuard checks VenueContext for isAdminAuthenticated
// If false, redirects to "/" with a toast: "Admin access required"
// Password to authenticate: "venue2025"
// Store isAdminAuthenticated in VenueContext (add to state)
```

---

# PART 7 — PAGE SPECIFICATIONS

## 7.1 LANDING PAGE (`/`)

The landing page is the front door. It must immediately communicate
what this system is and give two clear paths into it.

**Layout:**
- Full screen, dark background (bg-base)
- Centred content, vertically and horizontally
- Venue name at top: "Metro Arena" in large accent-blue text
- Event name below: "Championship Finals 2025" in white
- Status row: live dot + "System Active" | engine status dot + label
- Then two prominent call-to-action cards side by side (or stacked mobile):

  **Card 1 — Attendee Entry:**
  - Icon: person silhouette
  - Heading: "Attending the event?"
  - Sub: "Scan your entry QR code or tap below to begin"
  - Primary button: "Simulate QR Entry →" → navigates to `/scan?gate=gate-1`
  - Ghost button: "View Venue Info" → navigates to `/attendee`

  **Card 2 — Admin Entry:**
  - Icon: shield / dashboard icon
  - Heading: "Operations Team"
  - Sub: "Access the control centre and monitoring dashboard"
  - Primary button: "Admin Login →" → opens password modal
  - Password modal: single input "venue2025" → on success navigate to `/admin`

- At the very bottom: small text showing the engine status
  "Simulation Engine: Running / Stopped" with a toggle button
  This is the ONLY place the engine on/off lives on the public side.
  Everything else that is engine-related is in `/admin/simulation`.

## 7.2 QR FLOW — THE ATTENDEE JOURNEY

This is a sequential flow. Each page leads to the next.
All pages use FullscreenLayout: white/light surface, max-w-sm, mx-auto,
100vh, mobile-first. NO admin sidebar. NO bottom nav. NO venue map header.
This is a focused, app-like experience on a phone screen.

**The shared visual motif for all QR flow pages:**
- Top: small "Metro Arena" wordmark in accent blue (not a full header)
- Progress indicator: subtle dots or steps showing where in the journey
- Large, clear heading
- Supportive subtext in muted colour
- Single primary action at bottom (large, full-width button)
- Optional secondary action as a text link above the button

---

### `/scan` — QR Entry Point

This simulates what the attendee sees when they point their phone
at a QR code posted at a venue entrance.

Content:
- Venue wordmark at top
- Large QR scan icon (SVG icon of a QR code with scan lines animating)
- Heading: "Welcome to Metro Arena"
- Sub: "You've arrived at [Gate Name]" ← from URL param `?gate=gate-1`
  (look up gate name from zones data)
- Description: "Let's personalise your experience. It takes 10 seconds."
- Button: "Get Started" → `/register?gate=gate-1`
- Smaller link: "Already registered? Enter your number"
  → shows an inline input field for phone number
  → on submit: checks attendees array in context for matching phone
  → if found: navigate to `/welcome?id=[attendeeId]`
  → if not found: toast "Number not found. Please register." + redirect to /register

---

### `/register` — Registration

Content:
- Step indicator: Step 1 of 2 (register) / Step 2 (welcome)
- Heading: "Quick Setup"
- Sub: "Your information helps us guide you better."
- Full Name input — required
- Mobile Number input (tel) — 10 digit validation
- Button: "Continue →"
- On submit:
  - Validate: name trimmed non-empty, phone exactly 10 digits
  - If invalid: show inline error messages (red text below input)
  - If valid:
    - dispatch ATTENDEE_REGISTER with new attendee object
    - dispatch VENUE_INCREMENT_ATTENDANCE
    - dispatch QR_EVENT_ADD (type: "entry")
    - navigate to `/welcome?id=[newId]`
- Privacy note: "Used only for venue guidance. Not shared."

**Input styling:**
```
className="w-full bg-elevated border border-border rounded-lg
           px-4 py-3 text-primary placeholder-muted
           focus:outline-none focus:border-accent transition-colors"
```

---

### `/welcome` — Personalised Welcome

This is the attendee's home screen for the rest of their visit.

Content:
- Large greeting: "Hey, [Name]! 👋"
- Subtext: "You're at [Gate Name] — [Zone Description]"
- Three quick-stat chips in a row:
  - Venue Capacity: [X]% full (colour-coded)
  - Your nearest food: [Y] min wait
  - Active alerts: [N] (red if N > 0)
- Prominent section: "Where would you like to go?"
- Four large destination category tiles in a 2×2 grid:

  | Tile | Icon | Label | Shows |
  |---|---|---|---|
  | Food | 🍔 | Food & Drinks | best wait time available |
  | Restrooms | 🚻 | Restrooms | nearest open block |
  | Seating | 💺 | Your Seat Area | occupancy of their zone |
  | Stage | 🎭 | Main Stage | current density |

- Each tile also shows a small density badge (colour-coded)
- Tapping any tile → `/go?category=[food|restroom|seating|stage]`
- Below the grid: "View Full Venue Map" text link → `/attendee/map`
- Active alert banner at top if any critical/emergency alerts exist
  (same AlertBanner component used everywhere)

---

### `/go` — Destination Intent

Content:
- Back arrow (navigates to /welcome)
- Heading: category name (e.g., "Food & Drinks")
- Subheading: "Tap where you want to go"
- Scrollable list of all zones in that category
- Each list item (DestinationTile component):
  - Zone name (large, clear)
  - Density bar (full width, colour shows safe/caution/critical)
  - Two stats side by side: "[X]% full" and "~[Y] min wait"
  - Walking time: "~[Z] min walk from [current zone]"
    ← look up from directions.js walking time table
  - Status badge: OPEN | BUSY | FULL
  - Right arrow indicating it is tappable
- On tap:
  - Run getSuggestion() from suggestions.js
  - dispatch ATTENDEE_SET_INTENT
  - dispatch ZONE_SET_INTENT (delta: +1 for intended zone)
  - dispatch QR_EVENT_ADD (type: "intent")
  - if suggestion exists → navigate to `/suggest?intended=[zoneId]&alt=[altZoneId]`
  - if no suggestion → navigate to `/navigate?destination=[zoneId]`
- Sort zones: OPEN first, then BUSY, then FULL
- FULL zones show greyed out, still tappable but no suggestion (just navigate)

---

### `/suggest` — Smart Suggestion

Shown only when the attendee chose a zone above 65% density AND
a meaningfully better alternative exists.

Content:
- Back arrow (goes back to /go)
- Top warning card (amber border):
  - Warning icon ⚠️
  - "[Intended Zone] is currently [X]% full"
  - "Expected wait: ~[Y] minutes"
- Heading: "There's a better option nearby"
- Suggestion cards (1 or 2 alternatives):
  Each SuggestionCard:
  - Zone name
  - Density bar (should be visibly shorter/greener than intended zone)
  - "[X]% full — [Y] min wait"
  - Walking time vs intended zone: "~[Z] min walk"
  - Savings badge (green): "Save ~[N] min wait"
  - Full-width button: "Take me here →"
    → dispatch ATTENDEE_SET_INTENT to this zone instead
    → dispatch ZONE_SET_INTENT for new zone (+1) and original (-1)
    → navigate to `/navigate?destination=[newZoneId]`
- Below the cards, text link: "Go to [Intended Zone] anyway →"
  → navigate to `/navigate?destination=[originalZoneId]`
- This choice is always respected. The system suggests, never forces.

---

### `/navigate` — In-Venue Walking Guide

The final step. Shows them exactly how to get there.

Content (two sections, stacked vertically):

**Section 1 — Mini Map (top 45% of screen):**
- Leaflet map, non-interactive (zoomControl: false, dragging: false)
- Shows the venue floor plan
- Current zone: blue pulsing marker
- Destination zone: accent-coloured flag marker
- A polyline drawn between them (straight line via pre-defined waypoints)
- Map is for orientation only — does not need real routing

**Section 2 — Directions (bottom 55% of screen):**
- Destination name, large and bold
- Density badge (live, from context, updates every 4s)
- Live wait time with a small clock icon
- Numbered walking steps (WalkingStep components):
  - Step 1 text
  - Step 2 text
  - Step 3 text (typically 3 steps per path)
  ← look up from directions.js based on currentZone → destinationZone
- Estimated walk: "~[X] minute walk"
- At the bottom: large green button "I've Arrived ✓"
  → dispatch ATTENDEE_UPDATE_ZONE (set currentZoneId to destination)
  → dispatch ZONE_SET_INTENT (delta: -1 for this zone, resolving the intent)
  → dispatch QR_EVENT_ADD (type: "zone_arrival")
  → navigate to `/welcome` (they are now at their destination)
- Small text link below button: "Change destination" → `/go?category=[same]`

**directions.js — Walking Directions Table:**
```javascript
// src/utils/directions.js
// Pre-written directions for all common zone-to-zone paths
// Key format: "fromZoneId→toZoneId"

export const directions = {
  "gate-1→food-court-a": {
    steps: [
      "Head straight through the Main Concourse",
      "Follow the blue Food signs on your left",
      "Food Court A is 50 metres ahead",
    ],
    walkingMins: 3,
  },
  "gate-1→restroom-a": {
    steps: [
      "Turn left after the entrance turnstiles",
      "Restroom Block A is at the end of the corridor",
    ],
    walkingMins: 1,
  },
  // ... add paths for all meaningful zone pairs
  // For any path not in the table, use a fallback:
  // ["Follow venue signage to [destination name]",
  //  "Ask any staff member in a blue vest for assistance"]
};

export function getDirections(fromZoneId, toZoneId) {
  const key = `${fromZoneId}→${toZoneId}`;
  return directions[key] || {
    steps: [
      `Follow the signs toward ${toZoneId.replace(/-/g, " ")}`,
      "Ask any staff member in a blue vest for help",
    ],
    walkingMins: 5,
  };
}
```

---

## 7.3 ATTENDEE DASHBOARD (`/attendee`)

For attendees who did not use QR registration, or who want to browse
venue info without a personalised session.

Content:
- AlertBanner at top (if any active alerts)
- Greeting: "Metro Arena — Championship Finals 2025"
- Engine status dot: small, subtle, top right — "Live Simulation"
- Zone overview: top 4 zones sorted by density, shown as ZoneCards
- ZoneCard: zone name | density bar | density % | wait time | trend arrow
- Section: "Queue Status"
- Top 4 queues by wait time, shown as QueueItems
- QueueItem: icon | name | wait time | trend arrow | status badge
- Button row: "View Full Map" | "See All Queues"

**Engine Status Dot (`EngineStatusDot` component — used everywhere):**
```jsx
// A small indicator showing the engine is running
// Used in every page's header/top bar, very subtle
// When running: green pulsing dot + "Live"
// When stopped: grey dot + "Paused"
// This communicates to EVERYONE — attendee and admin — that the data is live
```

---

## 7.4 ADMIN DASHBOARD (`/admin`)

The single most important admin screen. Answers: "What is happening
right now across the whole venue?"

Layout: AdminLayout (sidebar + topbar + main content)

Topbar content:
- Venue name + event name
- Engine status: "Simulation Running" green badge or "Paused" grey badge
  with a quick Start/Stop toggle button (links to full controls in /admin/simulation)
- Logged-in user label: "Admin"

Main content:
- KPI row (4 cards): Current Attendance | Avg Wait Time | Open Incidents | Active Alerts
- Two-column layout below:
  - Left (65%): Mini venue heatmap (same Leaflet map, smaller)
    Clickable zones → highlights zone in right panel
  - Right (35%): Scrollable alert feed
    Each alert: type badge | title | zone | time | Acknowledge button
    Critical/Emergency alerts have a red left border
- Below the two-column: Staff Status table
  Name | Zone | Status | Action (Change Zone dropdown)

---

## 7.5 LIVE HEATMAP (`/admin/heatmap`)

Full-screen map view. This is for deep monitoring.

- Leaflet map takes 70% of screen height
- Each zone polygon filled with colour from densityColor(density)
- Opacity scales with density: 0.3 at 0%, 0.9 at 100%
- Zone label overlay: name + density % text centred in polygon
- Clicking a zone opens ZoneDetailPanel (slide-in from right):
  - Zone name, density, wait time, trend
  - Number of staff assigned
  - Active incidents in this zone
  - Intent count: "[N] people are heading here"
  - Recharts sparkline: density over last 10 ticks
  - Action button: "Dispatch Staff Here"
    → shows staff dropdown, dispatches STAFF_UPDATE_ZONE
- Density legend at bottom-left: Green | Amber | Red with % ranges
- Auto-refresh from context every tick (no manual refresh needed)

---

## 7.6 INTENT FLOW MAP (`/admin/intent`)

The dual-layer map. This is the innovation that makes the system predictive.

**This page must make one thing immediately obvious:**
"We can see problems forming before they happen."

Layout:
- Toggle bar at top: [ Occupancy Only ] [ Intent Flow ] [ Both ✓ ]
- Map takes 60% of screen height
- Right panel (35%): Intent breakdown table

**Map Layer 1 — Occupancy (always visible, same as heatmap):**
- Zone polygons filled with green/amber/red based on density

**Map Layer 2 — Intent Flow (toggleable):**
- For each zone where intentFlow[zoneId] > 0:
  - Draw an animated SVG arrow from the map centre toward that zone
  - Arrow thickness by intent count:
    - 1–5: thin dashed, opacity 0.4
    - 6–15: medium solid, opacity 0.7
    - 16+: thick solid with pulse animation, opacity 1.0
  - Arrow colour matches destination zone's current density colour
    (so a red zone with 20 people heading to it = thick red arrow)
  - CSS animation for arrows: stroke-dashoffset keyframe
    gives the effect of dots flowing along the arrow

**Map click interaction:**
Clicking any zone → right panel updates:
- Zone name
- Currently here: [N] people (from occupancy)
- Heading here (intent): [N] people
- Combined pressure: [N+N = total] vs capacity [M]
- Pressure percentage bar
- Recommendation chip:
  - If (occupancy + intent) / capacity > 0.85: "⚠️ Rerouting recommended"
  - Else: "✅ Within safe range"

**Right panel — Intent Breakdown Table:**
- Columns: Zone | Here Now | Heading Here | Pressure | Status
- "Pressure" = (occupancy + intent) / capacity × 100
- Sorted by Pressure descending
- Row colours by pressure: green < 50%, amber 50–80%, red > 80%
- Live updates every tick

---

## 7.7 QR ACTIVITY FEED (`/admin/qr-feed`)

Shows every QR interaction happening across the venue.

- Counter row: Total Scans | Registrations | Intents | Arrivals | Exits
- Filter tabs: All | Entries | Intents | Arrivals | Exits
- Scrollable feed, auto-updating, newest at top, capped at 100
- Each QRFeedRow:
  - Timestamp (HH:MM:SS)
  - Type badge colour-coded:
    - Entry: blue
    - Intent: amber
    - Zone Arrival: green
    - Exit: muted grey
  - Name (partially masked: "Rahul K.")
  - Zone name
  - For intent events: "→ [Destination Zone]" appended
- Engine generates mock events via qrSimulator.js every tick
  so feed is always live

---

## 7.8 CCTV INTEGRATION PANEL (`/admin/cctv`)

Non-functional concept showcase. Must look credible and complete.

**Page header:**
- Heading: "CCTV Integration"
- Subheading: "Connect live camera feeds for AI-powered crowd analysis"
- Status pill: "Prototype Mode — Simulation Engine Active"
- Info text: "In production, this panel connects to cameras on your
  local network and uses a TensorFlow.js AI model to count people in
  each zone automatically. All processing is local — no video leaves
  the venue network."

**Data Source Switcher (prominent, at top):**
Three tabs styled as toggle buttons:
```
[ 🔵 Simulation Engine ✓ ACTIVE ]  [ 📱 QR Tracking ]  [ 📷 CCTV Analysis ]
```
- Simulation Engine tab is always shown as ACTIVE
- QR Tracking tab shows "(partial — see QR Feed)"
- CCTV Analysis tab shows "(requires camera connection)"
- Clicking CCTV tab stays on this page but shows a tooltip:
  "Connect a camera below to activate CCTV analysis"

**Camera Grid (2×3):**
Each CameraCard:
- Camera icon at top
- Camera name
- Zone assignment
- IP address
- Resolution badge
- Large status badge: "NOT CONNECTED" (grey)
- Placeholder video area: dark grey, camera icon, "Feed Unavailable"
- Two buttons:
  - "Connect Camera" → opens ConnectionModal
  - "Learn More" → opens ArchitectureModal

**ConnectionModal:**
```
┌──────────────────────────────────────────────┐
│  Connect Camera — [Camera Name]              │
├──────────────────────────────────────────────┤
│  Camera IP      [pre-filled from mockData]   │
│  Port           [554             ]           │
│  Protocol       [RTSP      ▾    ]           │
│  Username       [admin          ]           │
│  Password       [••••••         ]           │
│                                              │
│  ℹ️  Camera must be on the same WiFi/LAN     │
│                                              │
│  AI Analysis Options:                        │
│  ☑ Person Counting                          │
│  ☑ Zone Density Estimation                  │
│  ☐ Anomaly Detection (Beta)                 │
│                                              │
│  [ Test Connection ]  [ Save & Connect ]     │
│                                              │
│  ⓘ CCTV integration requires the Venue      │
│    Intelligence Server on a local device.   │
└──────────────────────────────────────────────┘
```
Both buttons → toast: "Camera connection is disabled in prototype mode.
Use the Simulation Engine for live data."

**Architecture Diagram (below camera grid):**

Heading: "How CCTV Integration Works in Production"

Render this as an HTML/CSS diagram (NOT an image):
```
[CCTV Camera]
     │  RTSP Stream
     ▼
[Venue Intelligence Server]
  TensorFlow.js (COCO-SSD)
  Person Detection + Counting
     │  Zone Density Data (every 5s)
     ▼
[Smart Venue Orchestrator API]
     │
     ├──► [Admin Intent Map]  (real-time zone updates)
     └──► [Attendee App]      (crowd warnings + suggestions)
```
Styled with the design system: dark boxes, accent-coloured arrows,
muted labels. Clean, professional, readable at a glance.

Below the diagram, four explanation cards in a 2×2 grid:

Card 1 — "Local Processing":
"Video is analysed on a local server running TensorFlow.js. No footage
is transmitted outside the venue network. Only occupancy counts are
shared with the system."

Card 2 — "Auto-Discovery":
"The system scans the local WiFi for RTSP-capable cameras using mDNS.
Cameras are auto-detected and listed here for one-click connection."

Card 3 — "What the AI Sees":
"The COCO-SSD model identifies people in each frame and counts them per
zone. It updates zone density every 5 seconds — the same rhythm as the
simulation engine in this prototype."

Card 4 — "In This Prototype":
"The Simulation Engine generates the exact same zone density data that
CCTV AI would produce in production. Switch to Simulation Engine mode
above to see the full system working."

---

## 7.9 SIMULATION PANEL (`/admin/simulation`)

This is the engine control room. It must feel powerful and intentional —
not like a developer debug panel.

Heading: "Simulation Engine"
Subheading: "Control the data powering both the attendee experience
and the admin dashboard. Trigger scenarios to test system responses."

**Engine Status block:**
- Large status display: "ENGINE RUNNING" (green) or "ENGINE STOPPED" (grey)
- EngineStatusDot component (large version)
- Tick counter: "Tick #[N]"
- Active scenario label: "Scenario: [Name]"
- Speed selector: [ 1× ] [ 2× ] [ 5× ]
- Three buttons: [ ▶ Start ] [ ⏸ Pause ] [ ↺ Reset ]
  Only relevant buttons are enabled at any time.

**Scenario Selector:**
5 ScenarioButton cards in a row (or wrapped):
Each ScenarioButton:
- Large icon (emoji)
- Scenario name
- One-line description
- Active scenario: highlighted with accent border and background
- Clicking sets engine.scenario and shows a brief toast:
  "[Scenario Name] activated — engine will shift to new parameters"

**Intensity Selector:**
Segmented control: [ Low ] [ Medium ] [ High ]
- Affects the magnitude of density changes per tick
- Show a brief description next to it:
  Low: "Gentle changes, slow build"
  Medium: "Realistic event conditions"
  High: "Rapid, dramatic shifts"

**Live Simulation Log (SimLog component):**
- Auto-scrolling, newest at top
- Shows the last 50 engine events
- Monospace font, timestamps
- Colour-coded by event type:
  - Zone update: muted text
  - Alert fired: red text
  - QR event generated: blue text
  - Scenario change: amber text

---

# PART 8 — SUGGESTION ENGINE

Location: `src/utils/suggestions.js`

```javascript
// Called from /go page when an attendee taps a destination

export function getSuggestion(intendedZoneId, currentZoneId, category, zones, intentFlow) {
  const intended = zones.find(z => z.id === intendedZoneId);

  // Only intervene if intended zone is above 65% density
  if (intended.density < 65) return null;

  // Find all zones in the same category (except the intended one)
  const alternatives = zones
    .filter(z => z.category === category && z.id !== intendedZoneId)
    .map(z => {
      const currentIntent = intentFlow[z.id] || 0;
      const projectedDensity = Math.min(100, z.density + (currentIntent * 0.5));
      const walkTime = getWalkTime(currentZoneId, z.id); // from directions.js
      // Score: lower is better. Weighted 60% projected density, 40% walk time
      const score = (projectedDensity * 0.6) + (walkTime * 0.4);
      return { ...z, projectedDensity, walkTime, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  if (alternatives.length === 0) return null;
  if (alternatives[0].density >= intended.density - 10) return null; // not worth suggesting

  // Calculate time saved
  const intendedWait = intended.waitTime;
  return alternatives.map(alt => ({
    ...alt,
    savingMins: Math.max(0, Math.round(intendedWait - alt.waitTime)),
  }));
}
```

---

# PART 9 — SHARED COMPONENT: `AlertBanner`

This component appears on EVERY page — attendee and admin.
It is the thread that connects both sides of the system visually.

```jsx
// src/components/shared/AlertBanner.jsx
// Reads from VenueContext.alerts
// Shows the highest-priority unacknowledged alert
// Priority: emergency > critical > warning > info

// Emergency: sticky, full-width red bar, cannot be dismissed by attendee
//            (only admin can acknowledge it)
// Critical: full-width red bar, dismissible
// Warning: amber bar, dismissible
// Info: blue bar, dismissible

// On every page, this is always the FIRST thing rendered after the layout shell
// It should feel like an ambient system-wide notification, not a page element
```

---

# PART 10 — ENGINE STATUS DOT

```jsx
// src/components/shared/EngineStatusDot.jsx
// Small indicator used in every page header showing engine is running
// Size prop: "sm" (default) for headers, "lg" for simulation panel

// Running: green filled circle with CSS pulse animation
//          label: "Live"
// Stopped: grey filled circle, no animation
//          label: "Paused"

// This component is what makes both the attendee app and the admin dashboard
// feel like they're part of the same living system.
// The attendee sees it in their header and knows the data is live.
// The admin sees it and knows the engine is running.
```

---

# PART 11 — BUILD ORDER

Follow exactly. Do not skip. Do not combine steps.

```
Step 1:  Project scaffold
         → npm create vite@latest smart-venue-orchestrator -- --template react
         → install all dependencies
         → configure Tailwind with custom colours from Part 4
         → add Inter font to index.html
         → configure React Router in App.jsx

Step 2:  VenueContext
         → build the full context with initialState from Part 2
         → build the full reducer with all action types from Part 2
         → wrap App.jsx with VenueProvider

Step 3:  Simulation Engine
         → src/engine/scenarios.js
         → src/engine/alertRules.js
         → src/engine/qrSimulator.js
         → src/engine/index.js (tick loop, start/stop/reset, cleanup)
         → wire engine to dispatch VenueContext actions

Step 4:  Utility functions
         → src/utils/density.js (densityColor, densityLabel, densityBgClass)
         → src/utils/directions.js (directions table + getDirections)
         → src/utils/suggestions.js (getSuggestion)

Step 5:  Layouts
         → src/layouts/FullscreenLayout.jsx
         → src/layouts/AttendeeLayout.jsx (header + bottom nav)
         → src/layouts/AdminLayout.jsx (sidebar + topbar + Outlet)
         → AdminGuard component (password check, password: "venue2025")

Step 6:  Shared components
         → AlertBanner.jsx
         → ZoneBadge.jsx
         → DensityBar.jsx
         → EngineStatusDot.jsx

Step 7:  Attendee components
         → ZoneCard.jsx
         → QueueItem.jsx
         → DestinationTile.jsx
         → SuggestionCard.jsx
         → WalkingStep.jsx

Step 8:  Admin components
         → KPICard.jsx
         → StaffRow.jsx
         → IncidentCard.jsx
         → QRFeedRow.jsx
         → CameraCard.jsx
         → IntentArrow.jsx
         → SimLog.jsx
         → ScenarioButton.jsx

Step 9:  Landing page
         → Two CTA cards, password modal, engine toggle

Step 10: QR flow pages (in order)
         → /scan → /register → /welcome → /go → /suggest → /navigate
         → Test the full journey end-to-end before moving on

Step 11: Attendee dashboard pages
         → /attendee → /attendee/map → /attendee/queues

Step 12: Admin dashboard
         → /admin (KPIs + mini heatmap + alert feed + staff table)

Step 13: Heatmap page
         → /admin/heatmap (full Leaflet map + ZoneDetailPanel)

Step 14: Intent Flow Map
         → /admin/intent (dual layer + animated arrows + breakdown table)

Step 15: QR Activity Feed
         → /admin/qr-feed

Step 16: CCTV Panel
         → /admin/cctv (camera grid + modals + architecture diagram)

Step 17: Simulation Panel
         → /admin/simulation (full engine controls + SimLog)

Step 18: Integration pass
         → Verify engine tick updates are reflected in EVERY page
         → Verify AlertBanner appears on ALL pages when alerts exist
         → Verify QR flow updates VenueContext and admin pages reflect it
         → Verify EngineStatusDot is in every page header
         → Verify intent taps from /go update intentFlow in IntentMap

Step 19: Mobile responsiveness
         → QR flow pages: max-w-sm, mx-auto, large tap targets (min h-12)
         → Attendee pages: mobile-first, bottom nav visible on small screens
         → Admin pages: sidebar collapses to icon-only below lg breakpoint

Step 20: Final polish
         → All CCTV buttons show correct prototype toast
         → Scenario changes show toast confirmation
         → "I've Arrived" button navigates correctly
         → Suggestion engine only triggers when genuinely better option exists
         → No console errors on any route
         → Engine cleanup on unmount (clearInterval)
```

---

# PART 12 — DONE WHEN

**System feels unified:**
- [ ] AlertBanner appears on the same alert on BOTH the attendee app
      and the admin dashboard simultaneously (same context)
- [ ] EngineStatusDot is visible in every page's header area
- [ ] A density change from the simulation is visible within one tick
      on the attendee dashboard AND the admin heatmap
- [ ] An intent tap on /go is reflected immediately in /admin/intent
      intentFlow data

**QR flow works end-to-end:**
- [ ] /scan → /register → /welcome → /go → /suggest → /navigate → /welcome
      all complete without errors
- [ ] Suggestion only appears when intended zone > 65% density
- [ ] "Take me here" and "Go anyway" both navigate correctly
- [ ] "I've Arrived" updates context and returns to welcome screen

**Simulation engine:**
- [ ] Start / Pause / Reset all work correctly
- [ ] All 5 scenarios visibly change zone densities within 2–3 ticks
- [ ] Emergency scenario auto-fires an alert that appears on all pages
- [ ] SimLog shows events updating every tick

**Admin features:**
- [ ] Intent arrows animate on /admin/intent
- [ ] Zone click on /admin/intent updates right panel
- [ ] /admin/qr-feed shows live events from simulation + real QR taps
- [ ] /admin/cctv all buttons show appropriate prototype toast
- [ ] Architecture diagram renders correctly (HTML/CSS, not image)
- [ ] All incidents can be added and resolved

**General:**
- [ ] Admin password gate works (venue2025)
- [ ] No route crashes on direct navigation
- [ ] Mobile experience on QR flow pages feels like a real phone app
- [ ] No console errors

---

# FINAL INSTRUCTION TO THE AGENT

The test for whether this is built correctly is not whether every feature
is present. The test is whether someone watching a demo can immediately
understand: "The person on the phone and the person on the monitor are
both looking at the same venue, the same data, and the same moment in time."

Use Plan Mode first. Review the plan before execution. Build in the
exact order given in Part 11. If you encounter an ambiguity not addressed
in this document, make a reasonable decision that preserves the unified
feeling of the system and proceed.
```
