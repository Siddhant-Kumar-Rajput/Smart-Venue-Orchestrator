# APP_LAYOUT.md — Smart Venue Orchestrator (Prototype)

> **Navigation Model:** Simple SPA with 2 roles (Attendee / Admin) and a Simulation panel

---

## Routes

```
/                   → Landing (role selector)
/attendee           → Attendee Dashboard
/attendee/map       → Venue Map + Zone Status
/attendee/queues    → Live Queue Wait Times
/admin              → Admin Control Center
/admin/incidents    → Incident Log
/simulation         → Simulation Control Panel
```

That's it. 7 routes. No over-engineering.

---

## Pages

### `/` — Landing
- Two buttons: "I'm an Attendee" and "Admin Login" (password: hardcoded for prototype)
- Shows event name, date, and current status (Simulation ON/OFF badge)

---

### `/attendee` — Attendee Dashboard
- Wait time cards: Entry Gate | Food | Restrooms (colour-coded: green / amber / red)
- Active alerts strip at the top
- Quick links to Map and Queues
- Simulation updates these cards automatically every few seconds

---

### `/attendee/map` — Venue Map
- SVG floor plan with colour-coded zone overlays (crowd density)
- Click a zone → small popup: zone name, density %, estimated wait
- "Find nearest exit / restroom" buttons highlight the relevant zone

---

### `/attendee/queues` — Queue Status
- Simple list of all service points with current wait time and a trend arrow (↑ ↓ →)
- Refreshes automatically from the simulation engine

---

### `/admin` — Admin Control Center
- KPI row: Attendance | Avg Wait | Open Incidents | Active Alerts
- Full venue heatmap (same map as attendee but with density numbers shown)
- Alert feed on the right: all active alerts with Acknowledge button
- Staff list: name, zone, status — manually update status via dropdown

---

### `/admin/incidents` — Incident Log
- Simple form: Type + Zone + Severity + Note → Add Incident
- List of incidents: Open / Resolved toggle
- No database — stored in React state, resets on refresh (prototype behaviour, fine for now)

---

### `/simulation` — Simulation Control Panel *(Admin only)*
- Scenario buttons: Normal | Crowd Surge | Emergency | Half-Time Rush
- Intensity slider: Low / Medium / High
- Affected zone selector (checkboxes)
- Start / Stop / Reset buttons
- Live event log showing what the engine is generating

---

## Navigation Flow

```
Landing (/)
  ├── Attendee ──→ /attendee ──→ /attendee/map
  │                         └──→ /attendee/queues
  │
  └── Admin ──→ password check ──→ /admin ──→ /admin/incidents
                                         └──→ /simulation
```

Admin check: a simple hardcoded password prompt (`useState`) — no JWT, no auth library needed for a prototype.

---

## Layout Structure

### Attendee Layout
```
┌──────────────────────────────────────────┐
│  Header: Logo | Event Name | Alert Strip │
├──────────────────────────────────────────┤
│           Page Content                   │
├──────────────────────────────────────────┤
│  Bottom Nav: Dashboard | Map | Queues    │  ← mobile-friendly
└──────────────────────────────────────────┘
```

### Admin Layout
```
┌────────────┬─────────────────────────────┐
│  Sidebar   │  Top Bar: Event | Sim Badge │
│  • Control │─────────────────────────────│
│  • Incid.  │       Page Content          │
│  • Sim.    │                             │
└────────────┴─────────────────────────────┘
```

---

## Key Reusable Components

| Component | Used In | What It Does |
|---|---|---|
| `<ZoneCard>` | Attendee Dashboard, Admin | Shows density + wait time for one zone |
| `<AlertStrip>` | All pages | Top banner for active alerts |
| `<VenueMap>` | Attendee Map, Admin | SVG floor plan with colour overlays |
| `<QueueItem>` | Queue page, Admin | Single queue row with wait + trend |
| `<KPICard>` | Admin Dashboard | One big number with a label |
| `<IncidentForm>` | Admin Incidents | Add new incident |
| `<ScenarioPanel>` | Simulation | Scenario buttons + slider + log |
| `<SimLog>` | Simulation | Auto-scrolling event log |

---

## Data Flow (Prototype)

```
Simulation Engine (setInterval)
  │
  └──→ SimulationContext (React Context)
            │
            ├──→ ZoneCard (reads density)
            ├──→ VenueMap (reads zone colours)
            ├──→ QueueItem (reads wait times)
            ├──→ AlertStrip (reads active alerts)
            └──→ AdminDashboard (reads KPIs)
```

All data lives in one React Context object. Components read what they need. The simulation engine writes to it on every tick. No API calls. No network. Instant updates.
