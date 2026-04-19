# 🚀 ANTIGRAVITY AGENT PROMPT — V2
# Smart Venue Orchestrator — Expanded Prototype Build Mission

> This file supersedes ANTIGRAVITY_PROMPT.md (V1).
> Read this file fully, then read TECH_STACK.md, APP_LAYOUT.md, and
> DESIGN_GUIDELINES.md before writing any code. All four files together
> define the complete system.

---

## WHAT CHANGED FROM V1

V1 built a working simulation dashboard. V2 adds three major layers on top:

1. **QR Code Attendee Flow** — scan → register → personalized web app →
   destination intent → smart suggestions → walking guide
2. **Intent Heatmap** — dual-layer map showing WHERE people are (occupancy)
   AND where they plan to go (intent flow arrows/animated dots)
3. **CCTV Integration Panel** — non-functional but fully designed UI showing
   the concept, architecture diagram, and "Connect Camera" button

Everything from V1 is kept. These are additions, not replacements.

---

## SYSTEM OVERVIEW (Updated)

```
Smart Venue Orchestrator
│
├── DATA SOURCES (3 layers — all feed into SimulationContext)
│   ├── Layer 1: Simulation Engine     ← prototype default, from V1
│   ├── Layer 2: QR Code Tracking      ← NEW, implemented in prototype
│   └── Layer 3: CCTV AI Analysis      ← NEW, concept UI only (non-functional)
│
├── ATTENDEE EXPERIENCE (mobile-first web app)
│   ├── QR Scan → Registration (name + phone number)
│   ├── Personalized Welcome Screen
│   ├── Destination Intent — tap where you want to go
│   ├── Smart Suggestion Engine — better alternatives with "Take me there"
│   ├── In-venue Walking Guide (step-by-step via venue map)
│   ├── Live Zone Status (crowd %, wait time, trend)
│   └── Exit Scan — completes the data loop
│
├── ADMIN CONTROL CENTER
│   ├── All V1 features (heatmap, staff, incidents, resources)
│   ├── Intent Flow Map (dual-layer: occupancy + intent) ← NEW
│   ├── QR Activity Feed (live scan events)              ← NEW
│   └── CCTV Integration Panel (concept UI)              ← NEW
│
└── INTELLIGENCE LAYER
    ├── Occupancy calculation (zone scan counts)
    ├── Intent prediction (how many heading where)
    ├── Suggestion engine (route to better alternatives)
    └── Flow analytics (entry rate, intent vs arrival, exit rate)
```

---

## TECH STACK (unchanged from V1)

React 18 + Vite, JavaScript only, Tailwind CSS, React Router v6,
Recharts, Leaflet + react-leaflet, react-hot-toast, React Context.

No TypeScript. No backend. No database.
All data (including QR registrations and intent taps) lives in
SimulationContext and resets on page refresh. This is correct for a prototype.

---

## UPDATED SIMULATIONCONTEXT SCHEMA

Expand the existing SimulationContext to include these new state slices:

```javascript
// NEW slices to add alongside existing V1 state

attendees: [
  // Added when a person scans QR and registers
  {
    id: "uuid",
    name: "Rahul Sharma",
    phone: "98XXXXXXXX",           // stored as entered, display masked
    entryGate: "Gate 3",
    entryTime: 1700000000000,      // timestamp
    currentZone: "North Stand",    // updated on each zone scan
    intendedZone: "Food Court A",  // set when they tap destination
    intentTime: 1700000001000,     // when they tapped the intent
    status: "active"               // active | exited
  }
],

intentFlow: {
  // How many people currently intend to go to each zone
  // Updated every time an attendee taps a destination
  "Food Court A": 14,
  "Gate 1": 3,
  "North Restroom Block": 7,
  // ...
},

qrFeed: [
  // Last 30 QR scan events (for admin QR Activity Feed)
  {
    id: "uuid",
    type: "entry" | "intent" | "zone_arrival" | "exit",
    attendeeName: "Rahul Sharma",
    zone: "Gate 3",
    timestamp: 1700000000000
  }
],

cctvCameras: [
  // Static mock data for CCTV panel concept UI
  {
    id: "cam-01",
    name: "Main Entrance Cam",
    zone: "Gate 1",
    status: "disconnected",   // always disconnected in prototype
    resolution: "1080p",
    ipAddress: "192.168.1.101"
  },
  // ... 5-6 cameras total across different zones
]
```

---

## UPDATED ROUTE MAP

Add these new routes on top of the 7 from V1:

```
/scan                      → QR Landing (simulates what a QR code opens)
/register                  → Attendee Registration (name + phone)
/welcome                   → Personalized Welcome Screen (post-registration)
/go                        → Destination Intent Screen (where do you want to go?)
/suggest                   → Smart Suggestion Screen (better alternatives)
/navigate                  → In-Venue Walking Guide
/admin/intent              → Intent Flow Map (dual-layer heatmap)  [admin]
/admin/qr-feed             → QR Activity Feed                       [admin]
/admin/cctv                → CCTV Integration Panel                 [admin]
```

Total routes: 7 (V1) + 9 (new) = 16 routes.

---

## NEW FEATURE — QR CODE ATTENDEE FLOW

### How It Works in the Prototype

Since we cannot physically print QR codes in a prototype, the flow is
simulated via a "Simulate QR Scan" button on the Landing page that opens
`/scan`. This allows demo-ers to walk through the full attendee journey.

### Page: `/scan` — QR Landing

- Full-screen mobile view (max-width: 420px, centred)
- Venue logo at top
- Text: "Welcome to Metro Arena"
- Text: "You've scanned the QR at Gate [X]"  ← Gate is in the URL param `?gate=3`
- Subtext: "Let's get you set up for a great experience."
- Large button: "Get Started →"  → navigates to `/register?gate=3`
- Small text: "Already registered? Enter your number"
  → input field, submits → navigates to `/welcome` if number matches
  an existing attendee in context, else shows error toast

### Page: `/register` — Registration

- Mobile-first layout
- Heading: "Quick Registration"
- Subheading: "Takes 10 seconds. Helps us make your visit better."
- Form fields (no `<form>` tag — use onClick handler):
  - Full Name (text input, required)
  - Mobile Number (tel input, required, 10-digit validation)
- Button: "Continue →"
- On submit:
  - Validate: name not empty, phone is 10 digits
  - Create a new attendee object in SimulationContext
  - Set currentZone to the gate from URL param
  - Add a QR feed event: type "entry"
  - Navigate to `/welcome?name=Rahul&gate=3`
- Privacy note at bottom: "Your number is only used for venue assistance."

### Page: `/welcome` — Personalized Welcome

- Mobile-first layout
- Large greeting: "Hey, Rahul! 👋"  ← from URL param / context
- Subtext: "You're at Gate 3 — North Entrance"
- Status bar showing 3 quick stats:
  - Venue Capacity: [X]%
  - Your nearest food: [Y] min wait
  - Current alerts: [N]
- Big prominent card: "Where do you want to go?"
  with 4 quick-tap destination categories:
  - 🍔 Food & Drinks
  - 🚻 Restrooms
  - 💺 Seating Areas
  - 🎭 Stage / Main Area
- Each card tap → navigates to `/go?category=food`
- Bottom: small link "View Venue Map" → `/attendee/map`

### Page: `/go` — Destination Intent

- Heading: "Where are you headed?"
- Subheading: based on category param (e.g., "Food & Drink options")
- Scrollable list of all locations in that category:
  Each item shows:
  - Location name (e.g., "Food Court A — Block 2")
  - Current crowd: [colour-coded bar] X% full
  - Wait time: ~X mins
  - Distance: ~X min walk from their current zone
  - Status badge: OPEN | BUSY | FULL
- On tap of any location:
  - Record intent in SimulationContext (attendee.intendedZone = selection)
  - Increment intentFlow[selectedZone] by 1
  - Add QR feed event: type "intent"
  - Check if better suggestion exists (see Suggestion Engine below)
  - If yes → navigate to `/suggest?from=FoodCourtA&to=FoodCourtB`
  - If no → navigate directly to `/navigate?to=FoodCourtA`

### Suggestion Engine Logic

Run this check every time an attendee taps a destination:

```javascript
function getSuggestion(intendedZone, allZones, category) {
  const intended = allZones.find(z => z.name === intendedZone);

  // Only suggest if intended zone is above 65% occupancy
  if (intended.density < 65) return null;

  // Find alternatives in same category
  const alternatives = allZones
    .filter(z => z.category === category && z.name !== intendedZone)
    .map(z => ({
      ...z,
      score: (z.density * 0.6) + (z.distanceFrom[currentZone] * 0.4)
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);  // top 2 alternatives

  if (alternatives.length === 0) return null;
  if (alternatives[0].density >= intended.density) return null;

  return alternatives;
}
```

### Page: `/suggest` — Smart Suggestion

- Triggered only when a better alternative is found
- Layout:
  - Top section (amber/caution background):
    - Icon: ⚠️
    - "Food Court A is currently at 82% capacity"
    - "Expected wait: ~18 minutes"
  - Middle section: "We found better options for you —"
  - Suggestion cards (1–2 cards):
    Each shows:
    - Location name
    - Crowd level (colour-coded)
    - Wait time
    - Walking time from current position
    - Saving badge: "Save ~12 mins" in green
    - Button: "Take me there →"
  - Bottom: text link "Go to Food Court A anyway →"  ← respects choice
- "Take me there" → records new intent → navigate to `/navigate`
- "Go anyway" → keeps original intent → navigate to `/navigate` with original

### Page: `/navigate` — In-Venue Walking Guide

- Shows the venue map (same Leaflet map) with:
  - User's current position (blue pulsing dot at their current zone)
  - Destination marker (flag icon at target zone)
  - A simple polyline drawn between current zone centroid and destination centroid
    (not real routing — just a straight or 2-point path through named waypoints)
- Below the map: step-by-step text directions:
  ```
  Step 1: Head towards the Main Concourse (North)
  Step 2: Pass through Section B corridor
  Step 3: Food Court A is on your left
  Estimated walk: ~3 minutes
  ```
  ← These directions are pre-written strings in mockData.js for each
     common zone-to-zone path. No real routing algorithm needed.
- Destination info card at bottom:
  - Current crowd %, wait time, open/busy status
  - Refreshes from SimulationContext every 5 seconds
- Button: "I've arrived" → marks attendee as arrived at destination,
  removes their intent from intentFlow, updates their currentZone,
  adds QR feed event: type "zone_arrival"

---

## NEW FEATURE — INTENT HEATMAP (Innovation 1)

### Concept

The standard heatmap shows where people ARE (occupancy — solid colour fill).
The intent heatmap adds a second layer showing where people PLAN TO GO
(intent — animated arrows or flowing dots pointing toward destinations).

This gives admins the ability to see congestion BEFORE it happens.

### Page: `/admin/intent` — Intent Flow Map

Layout:
- Full-width map taking up 65% of the screen height
- Right panel (35% width): Intent breakdown table

Map Layer 1 — Occupancy (same as V1 heatmap):
- Zone polygons filled with green → amber → red based on density %
- Opacity: 0.7

Map Layer 2 — Intent Flow (new):
- For each zone that has intentFlow[zone] > 0:
  - Draw animated SVG arrows pointing FROM the centre of the map
    TOWARD that zone's centroid
  - Arrow thickness scales with intentFlow count:
    - 1–5 people: thin dashed line
    - 6–15 people: medium solid line
    - 16+ people: thick solid line with animated pulse
  - Arrow colour: matches destination zone's occupancy colour
    (so a red zone with 20 people heading to it = thick red arrow)
- Animate the arrows using CSS keyframe animation:
  `stroke-dashoffset` animation to make them appear as flowing dots

Map interaction:
- Click any zone → side panel updates to show:
  - Zone name
  - Current occupancy: X%
  - People currently here: N (from simulation)
  - People intending to come here: N (from intentFlow)
  - People who left in last 10 mins: N (simulated)
  - Suggestion: "Consider redirecting arrivals to [Zone Y]"

Right panel — Intent Breakdown Table:
- Columns: Zone | Currently Here | Heading Here | Left Recently | Status
- Rows sorted by (currently_here + heading_here) descending
- Rows with (currently_here + heading_here > 80% capacity) highlighted red
- Refresh indicator: "Live — updates every 4s"

Simulation integration:
- intentFlow values are partially driven by the simulation engine
- Every simulation tick, engine randomly moves a few attendees'
  intended destinations to simulate organic flow
- QR-registered attendees' intents are also reflected here

Toggle button at top of map: "Occupancy Only | Intent Flow | Both (default)"

---

## NEW FEATURE — QR ACTIVITY FEED

### Page: `/admin/qr-feed`

- Heading: "QR Scan Activity"
- Live counter row:
  - Total Scans Today: N
  - Registrations: N
  - Intent Taps: N
  - Arrivals Confirmed: N
  - Exits: N
- Filter tabs: All | Entries | Intents | Arrivals | Exits
- Scrollable feed (newest first, capped at 100 items):
  Each row:
  - Timestamp (HH:MM:SS)
  - Type badge (colour-coded: Entry=blue, Intent=amber, Arrival=green, Exit=grey)
  - Attendee name (partially masked: "Rahul S.")
  - Zone name
  - For intent events: show arrow "Food Court A → Food Court B" if redirected
- Auto-updates from SimulationContext.qrFeed
- Simulation engine also generates mock QR events every tick so the feed
  is always active even without real attendees scanning

---

## NEW FEATURE — CCTV INTEGRATION PANEL

### Page: `/admin/cctv`

This page is entirely non-functional but fully designed to demonstrate
the concept to judges and stakeholders. Every button shows an explanatory
tooltip or modal explaining what it would do in production.

### Layout

Top section — "Data Source Mode" toggle bar:
```
[ Simulation Engine ✓ ]  [ QR Tracking ]  [ CCTV Analysis ]
        (active)           (partial)         (configure)
```
The CCTV tab is selected when on this page.

Camera Grid (2×3 grid of camera cards):
Each camera card shows:
- Camera name + zone (e.g., "Gate 1 — Cam 01")
- IP address (e.g., 192.168.1.101)
- Resolution badge (1080p)
- Status: large badge — "NOT CONNECTED" in grey
- A placeholder video area (dark grey box with camera icon + text
  "Feed available after connection")
- Button: "Connect" → opens Connection Modal (see below)
- Button: "View Architecture" → opens Architecture Modal

Connection Modal (non-functional, but fully designed):
```
┌─────────────────────────────────────────────┐
│  Connect Camera — Gate 1 Cam 01             │
├─────────────────────────────────────────────┤
│  Camera IP:    [ 192.168.1.101         ]    │
│  Port:         [ 554                   ]    │
│  Protocol:     [ RTSP ▾               ]    │
│  Username:     [ admin                 ]    │
│  Password:     [ ••••••               ]    │
│                                             │
│  ℹ️  Camera must be on the same WiFi        │
│     network as this system.                 │
│                                             │
│  AI Analysis:  [ Person Counting ✓    ]    │
│                [ Zone Density   ✓    ]    │
│                [ Anomaly Detect □    ]    │
│                                             │
│  [ Test Connection ]   [ Save & Connect ]   │
│                                             │
│  ⚠️  Note: CCTV integration requires the   │
│     Venue Intelligence Server to be        │
│     installed on a local machine.          │
└─────────────────────────────────────────────┘
```
"Test Connection" → toast: "Connection test is disabled in prototype mode."
"Save & Connect" → toast: "CCTV integration is available in production deployment."

Architecture Diagram Modal:
Show a clean SVG/HTML diagram inside a modal with this flow:

```
 [CCTV Camera]──RTSP Stream──►[Local AI Server]
      │                              │
      │                         TensorFlow.js
      │                        (COCO-SSD Model)
      │                              │
      │                    Person Detection + Count
      │                              │
      └──────────────────────►[Zone Density API]
                                      │
                               SimulationContext
                                      │
                    ┌─────────────────┴──────────────────┐
                    │                                    │
              [Admin Heatmap]                    [Attendee App]
              (real-time update)              (crowd warnings)
```

Below the diagram, show these explanation cards:

Card 1 — "How it works in production":
"Each CCTV camera streams video over RTSP to a local AI server running
on the venue's network. A TensorFlow.js model counts people in each
frame and updates zone density every 5 seconds. No video is stored —
only the count number is sent to the system."

Card 2 — "WiFi requirement":
"All cameras and the AI server must be on the same local WiFi or LAN.
The system auto-discovers cameras using mDNS. Admin scans for available
cameras using the 'Scan Network' button."

Card 3 — "Privacy":
"No video footage leaves the venue network. The AI model processes
frames locally and only transmits occupancy counts. Fully GDPR compliant."

Card 4 — "In this prototype":
"The Simulation Engine generates the same data that CCTV AI would produce
in production. Switch to Simulation mode to see the full system working."

Button at bottom: "Scan for Cameras on This Network"
→ toast: "Network scan is disabled in prototype mode. Use Simulation Engine."

Button: "Download Integration Guide (PDF)"
→ toast: "Integration guide will be available in production package."

---

## UPDATED SIMULATION ENGINE

Add to `src/simulation/engine.js`:

```javascript
// Every simulation tick, also:
// 1. Generate mock QR scan events and push to qrFeed
// 2. Randomly adjust intentFlow values to simulate real attendee movement
// 3. Simulate attendees completing their journeys (intent → arrival → exit)

function simulateQRActivity(dispatch, zones) {
  const mockNames = ["Priya S.", "Arjun M.", "Neha K.", "Vikram P.", "Zara A."];
  const eventTypes = ["entry", "intent", "zone_arrival", "exit"];

  // Generate 0–3 random QR events per tick
  const count = Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const event = {
      id: crypto.randomUUID(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      attendeeName: mockNames[Math.floor(Math.random() * mockNames.length)],
      zone: zones[Math.floor(Math.random() * zones.length)].name,
      timestamp: Date.now()
    };
    dispatch({ type: "ADD_QR_EVENT", payload: event });
  }

  // Randomly shift 1–2 intent counts between zones
  dispatch({ type: "SIMULATE_INTENT_FLOW" });
}
```

---

## UPDATED MOCK DATA

Add to `src/simulation/mockData.js`:

```javascript
// Zone categories (for destination filtering on /go page)
export const zoneCategories = {
  food: ["Food Court A", "Food Court B", "Snack Bar North", "Snack Bar South"],
  restrooms: ["Restroom Block A", "Restroom Block B", "Restroom Block C"],
  seating: ["North Stand", "South Stand", "East Gallery", "VIP Section"],
  stage: ["Main Stage Area", "Stage Left Viewing", "Stage Right Viewing"],
  entry: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5"]
};

// Pre-written walking directions between common zone pairs
export const walkingDirections = {
  "Gate 3→Food Court A": [
    "Head straight through the main concourse",
    "Turn left at the North corridor sign",
    "Food Court A is 50m ahead on your right"
  ],
  "Gate 1→North Stand": [
    "Follow the blue signs toward North Stand",
    "Take the escalator or ramp to Level 2",
    "Your section is directly ahead"
  ],
  // Add 8–10 common paths
};

// Distance matrix (walking minutes between zones — for suggestion scoring)
export const walkingMinutes = {
  "Gate 1": { "Food Court A": 4, "Food Court B": 6, "North Stand": 3 },
  "Gate 3": { "Food Court A": 2, "Food Court B": 8, "North Stand": 5 },
  // ... fill in for all major zone pairs
};

// Mock CCTV cameras
export const mockCameras = [
  { id: "cam-01", name: "Main Entrance Cam", zone: "Gate 1",
    status: "disconnected", resolution: "1080p", ip: "192.168.1.101" },
  { id: "cam-02", name: "North Concourse Cam", zone: "North Stand",
    status: "disconnected", resolution: "1080p", ip: "192.168.1.102" },
  { id: "cam-03", name: "Food Court Cam A", zone: "Food Court A",
    status: "disconnected", resolution: "720p", ip: "192.168.1.103" },
  { id: "cam-04", name: "Gate 3 Entry Cam", zone: "Gate 3",
    status: "disconnected", resolution: "1080p", ip: "192.168.1.104" },
  { id: "cam-05", name: "South Stand Cam", zone: "South Stand",
    status: "disconnected", resolution: "1080p", ip: "192.168.1.105" },
  { id: "cam-06", name: "Emergency Exit Cam", zone: "Main Concourse",
    status: "disconnected", resolution: "720p", ip: "192.168.1.106" },
];
```

---

## UPDATED NAVIGATION FLOW

```
Landing (/)
  │
  ├── [Simulate QR Scan] button ──→ /scan?gate=3
  │         └──→ /register?gate=3
  │                   └──→ /welcome  (personalized)
  │                             └──→ /go?category=food
  │                                       └──→ /suggest  (if crowd > 65%)
  │                                       │         └──→ /navigate
  │                                       └──→ /navigate  (if crowd ok)
  │
  ├── [Enter as Attendee] ──→ /attendee (original dashboard)
  │
  └── [Admin Access] ──→ password ──→ /admin/dashboard
            ├── /admin/heatmap
            ├── /admin/intent    ← NEW (Intent Flow Map)
            ├── /admin/staff
            ├── /admin/incidents
            ├── /admin/resources
            ├── /admin/qr-feed   ← NEW
            ├── /admin/cctv      ← NEW
            └── /simulation
```

Update the AdminSidebar to include the three new items:
```
• Dashboard
• Live Heatmap
• Intent Flow Map  ← NEW (with "NEW" badge)
• Staff
• Incidents
• Resources
• QR Activity     ← NEW (with "NEW" badge)
• CCTV Setup      ← NEW (with "NEW" badge)
─────────────────
• Simulation
```

---

## UPDATED BUILD ORDER

Follow this exact order. Steps 1–10 are from V1 (already done if building fresh).
Steps 11+ are new.

```
Step 1  → Project scaffold + dependencies + Tailwind config
Step 2  → SimulationContext with UPDATED schema (includes attendees, intentFlow,
           qrFeed, cctvCameras)
Step 3  → simulation/engine.js + scenarios.js + UPDATED mockData.js
Step 4  → Router setup + layout shells
Step 5  → V1 reusable components (ZoneCard, AlertStrip, QueueItem, KPICard, SimLog)
Step 6  → HeatmapOverlay + V1 VenueMap page
Step 7  → Landing page (add "Simulate QR Scan" button)
Step 8  → V1 Attendee pages (Dashboard, Map, Queues)
Step 9  → V1 Admin pages (Dashboard, Incidents, Staff, Resources)
Step 10 → V1 Simulation Panel
Step 11 → QR flow pages: /scan → /register → /welcome
Step 12 → /go (Destination Intent) + Suggestion Engine logic
Step 13 → /suggest (Smart Suggestion page)
Step 14 → /navigate (Walking Guide with map + directions)
Step 15 → /admin/intent (Intent Flow Map — dual layer heatmap + animated arrows)
Step 16 → /admin/qr-feed (QR Activity Feed)
Step 17 → /admin/cctv (CCTV Panel — Connection Modal + Architecture Diagram)
Step 18 → Wire simulation engine to generate mock QR events + intent flow
Step 19 → Update AdminSidebar with new routes + NEW badges
Step 20 → Final pass: mobile responsiveness on QR flow pages,
           animation on intent arrows, toast messages on CCTV buttons
```

---

## COMPONENTS TO BUILD (New Ones Only)

**`AttendeeCard.jsx`**
- Used on /welcome
- Shows attendee name, entry gate, current zone
- Props: name, gate, zone, alertCount

**`DestinationTile.jsx`**
- Used on /go page
- Props: name, category, density, waitTime, walkingMins, status
- Tap handler: runs suggestion engine, navigates to /suggest or /navigate
- Status badge: OPEN (green) | BUSY (amber) | FULL (red)

**`SuggestionCard.jsx`**
- Used on /suggest page
- Props: locationName, density, waitTime, walkingMins, savingMins
- "Take me there →" button
- Shows saving badge in green: "Save ~X mins"

**`WalkingStep.jsx`**
- Used on /navigate page
- Props: stepNumber, instruction, isLast
- Numbered circle + text, with connecting vertical line between steps

**`IntentArrow.jsx`**
- Used on /admin/intent map layer
- SVG element: animated dashed/solid arrow from map centre to zone centroid
- Props: targetX, targetY, count, colour
- CSS animation: stroke-dashoffset flowing motion

**`QRFeedRow.jsx`**
- Used on /admin/qr-feed
- Props: type, attendeeName, zone, timestamp
- Colour-coded type badge

**`CameraCard.jsx`**
- Used on /admin/cctv
- Props: camera object from mockCameras
- Non-functional Connect button → opens ConnectionModal
- Dark placeholder video area

**`ConnectionModal.jsx`**
- Used inside CameraCard
- Full form layout as specified above
- All buttons show "disabled in prototype" toast

**`ArchitectureDiagram.jsx`**
- Used inside /admin/cctv page
- Rendered as an HTML/SVG diagram (not an image)
- Shows the CCTV → AI Server → Zone Density API → Admin + Attendee flow
- Clean boxes and arrows, uses design system colours

---

## DONE WHEN (Updated Checklist)

**V1 features (must all still work):**
- [ ] Simulation engine runs and updates heatmap + zone cards every ~4s
- [ ] All 5 scenarios trigger correctly (Normal, Surge, Emergency, Half-Time, VIP)
- [ ] Admin password gate works
- [ ] Incidents can be added and resolved
- [ ] All V1 routes render without errors

**New QR Flow:**
- [ ] "Simulate QR Scan" button on landing opens /scan correctly
- [ ] Registration form validates name (non-empty) and phone (10 digits)
- [ ] Successful registration navigates to /welcome with correct name + gate
- [ ] /go page shows all destinations in the selected category
- [ ] Tapping a zone above 65% density triggers the /suggest page
- [ ] Tapping a zone below 65% goes directly to /navigate
- [ ] /suggest shows 1–2 alternative locations with savings displayed
- [ ] "Take me there" and "Go anyway" both navigate to /navigate correctly
- [ ] /navigate shows map with current position + destination + polyline
- [ ] Walking directions show as numbered steps below the map
- [ ] "I've arrived" button updates SimulationContext correctly

**New Admin Features:**
- [ ] /admin/intent shows dual-layer map (occupancy fill + intent arrows)
- [ ] Intent arrows animate (flowing dot effect on SVG stroke)
- [ ] Clicking a zone updates the right panel with intent breakdown data
- [ ] Occupancy / Intent / Both toggle switches layers correctly
- [ ] /admin/qr-feed shows live feed of QR events (updating from simulation)
- [ ] Filter tabs on qr-feed work correctly
- [ ] /admin/cctv shows 6 camera cards in a grid
- [ ] "Connect" button opens ConnectionModal
- [ ] All modal buttons show "prototype mode" toast (not errors)
- [ ] Architecture diagram renders correctly (SVG/HTML, not a broken image)
- [ ] Explanation cards below diagram are readable
- [ ] AdminSidebar shows 3 new items with "NEW" badges

**General:**
- [ ] All QR flow pages are mobile-first (max-width ~420px, centred)
- [ ] All admin pages work on desktop (1024px+)
- [ ] No console errors on any route
- [ ] Intent flow simulation generates visible arrow changes every few ticks

---

## FINAL NOTE TO THE AGENT

The QR flow pages (/scan, /register, /welcome, /go, /suggest, /navigate)
must look and feel like a real mobile app — not a desktop page shrunk down.
Use max-w-sm or max-w-md with mx-auto, large tap targets (min 48px height),
and generous padding. These pages are what attendees see on their phones.

The CCTV panel must look polished and professional. It is a concept showcase
for judges and stakeholders. Every element should communicate credibility —
real camera IP addresses, real protocol names (RTSP), real AI model names
(TensorFlow.js COCO-SSD). The non-functional state must never look broken —
it must look intentional, like a feature awaiting activation.

Use Plan Mode before beginning. Build in the order specified.
Do not skip any step or combine steps to save time.
