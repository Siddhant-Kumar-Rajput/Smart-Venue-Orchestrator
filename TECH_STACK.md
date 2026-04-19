# TECH_STACK.md — Smart Venue Orchestrator (Prototype)

> **Phase:** Prototype | **Goal:** Fast to build, easy to run, zero infra overhead

---

## Guiding Rule
> One repo. No database. No cloud setup. All "live" data comes from a frontend simulation engine — a simple JS module that generates realistic venue data on a timer.

---

## Frontend (The Whole App)

| What | Choice | Why |
|---|---|---|
| Framework | **React + Vite** | Fastest dev setup, instant HMR |
| Language | **JavaScript** | No TypeScript config overhead |
| Styling | **Tailwind CSS** | No CSS files to manage |
| State | **useState / useContext** | Built-in React, zero extra deps |
| Routing | **React Router v6** | Simple, well-known |
| Charts | **Recharts** | Easy API, good defaults |
| Maps | **Leaflet + react-leaflet** | Lightweight, SVG overlay support |
| Notifications | **react-hot-toast** | One-liner alerts |

No Redux. No TanStack Query. No Zustand. Plain React state is enough for a prototype.

---

## Simulation Engine (Frontend Module)

A plain JS module (`src/simulation/engine.js`) that runs entirely in the browser:

- Runs on `setInterval` every 3–5 seconds
- Generates crowd density, queue wait times, and staff positions
- Triggers scenario events (surge, emergency, half-time) on demand
- Pushes updates into React Context — no WebSocket, no server needed

```
src/simulation/
├── engine.js       # Tick loop + data generator
├── scenarios.js    # Predefined scenario configs (surge, emergency, etc.)
└── mockData.js     # Venue zones, initial state, staff names
```

---

## Backend (Skip for Now)

Not needed for the prototype. Add a minimal Express + Socket.IO server **only if** multi-tab alert sync becomes a requirement.

If added: 5 routes max, in-memory JS object for storage, no database.

---

## Deployment

| Option | How |
|---|---|
| Local | `npm run dev` — done |
| Share with team | **Vercel** — free, one `git push` |
| Cloud Run (later) | Containerize only when moving to staging |

No Docker. No Terraform. No Cloud SQL. Save those for v1.

---

## Full Dependency List

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "recharts": "^2",
    "leaflet": "^1",
    "react-leaflet": "^4",
    "react-hot-toast": "^2",
    "tailwindcss": "^3"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

**9 dependencies. No build complexity. Clone → install → run.**

---

## Folder Structure

```
smart-venue-orchestrator/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # One file per route/page
│   ├── simulation/     # Fake data engine
│   ├── context/        # React context (global state)
│   └── assets/         # Venue SVG floor plan
├── public/
├── index.html
├── package.json
└── vite.config.js
```
