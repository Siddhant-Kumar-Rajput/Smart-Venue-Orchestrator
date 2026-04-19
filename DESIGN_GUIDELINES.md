# DESIGN_GUIDELINES.md — Smart Venue Orchestrator (Prototype)

> **Principle:** Clear, fast, readable. A venue dashboard is read under stress — keep it obvious.

---

## 1. UI/UX Principles

**Show the most critical info first.** Alerts and high-density zones should be impossible to miss.

**One action per screen.** Don't overwhelm. Each page has one primary thing the user does — check queues, view the map, trigger a scenario.

**Prototype ≠ polished.** Focus on usability and clarity. Visual polish comes in v1. Don't spend time on micro-animations or pixel-perfect spacing right now.

**No dead ends.** Every page has a clear way back and a clear next step.

---

## 2. Color System

Keep it simple. Three status colours + a neutral base is all you need.

| Token | Value | Used For |
|---|---|---|
| Safe | `#22C55E` (green) | Low density, short wait, OK status |
| Caution | `#F59E0B` (amber) | Moderate density, growing queues |
| Critical | `#EF4444` (red) | High density, emergency, long wait |
| Info | `#38BDF8` (blue) | Informational alerts, advisories |
| Background | `#0F172A` | App background (dark theme) |
| Surface | `#1E293B` | Cards, panels |
| Text Primary | `#F1F5F9` | Main readable text |
| Text Muted | `#94A3B8` | Labels, timestamps, secondary info |
| Border | `#334155` | Card borders, dividers |

### Heatmap Gradient (Crowd Density)
```
0% ──────── 50% ──────── 100%
#22C55E    #F59E0B    #EF4444
 Safe       Caution    Critical
```

Use this gradient consistently on the map, zone cards, and density bars. A user who sees red anywhere should immediately understand it means "problem here."

---

## 3. Typography

Use **Inter** (Google Fonts). It's clean, legible at small sizes, and free.

| Role | Size | Weight |
|---|---|---|
| Page title | 24px | 600 |
| Section heading | 18px | 600 |
| Body / card content | 14px | 400 |
| Labels / metadata | 12px | 400 |
| KPI number | 32–36px | 700 |
| Simulation log | 13px monospace | 400 |

Keep line height at `1.5` for body text. Don't go below `12px` for anything the user needs to read.

---

## 4. Spacing

Use Tailwind's default spacing scale. Stick to these for consistency:

- Card padding: `p-4` (16px)
- Gap between cards: `gap-4` or `gap-6`
- Page padding: `px-6 py-6`
- Section separation: `mt-8`

Don't eyeball spacing. Use the scale.

---

## 5. Component Style Rules

**Cards**
```
rounded-xl  bg-[surface]  border border-[#334155]  p-4  shadow-sm
```

**Status Badges**
```
rounded-full  px-2 py-0.5  text-xs font-medium
→ green bg for Safe, amber for Caution, red for Critical
```

**Buttons — Primary**
```
bg-blue-600  hover:bg-blue-700  text-white  rounded-lg  px-4 py-2  font-medium
```

**Buttons — Danger**
```
bg-red-600  hover:bg-red-700  text-white  rounded-lg  px-4 py-2  font-medium
```

**Alert Banner (top of page)**
```
Critical → bg-red-600 text-white (sticky, full width)
Warning  → bg-amber-500 text-black
Info     → bg-blue-500 text-white
```

---

## 6. Interaction Guidelines

**Real-time updates** — When a zone card changes from Caution to Critical, change the colour. No animation needed for prototype — a plain colour change is clear enough.

**Simulation log** — Auto-scroll to the latest entry. Use a `useEffect` + `scrollIntoView`. Limit to last 50 entries to keep it performant.

**Scenario trigger feedback** — When admin clicks "Start Surge", immediately update a status badge that says "Surge Active" in red. Don't leave the user wondering if it worked.

**Loading states** — For prototype, there's no real loading (all data is local). If you do add a loading state, use a simple "Loading..." text, not a spinner library.

**Errors** — Use `react-hot-toast` for any error messages. Red toast, 3 seconds, done.

---

## 7. Accessibility (Prototype Baseline)

Don't skip the basics — they're easy and matter:

- All icon-only buttons need an `aria-label`
- Status colours must also have a text label (don't rely on colour alone)
- Keyboard navigation should work for the main flows
- Don't remove focus outlines (`outline: none` globally is bad practice)
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<button>` (not `<div onClick>`)

Full WCAG compliance can wait for v1. These basics take 10 minutes and make the app usable for everyone.

---

## 8. Performance (Prototype)

The simulation engine runs `setInterval` in the browser. A few simple rules:

- Clear the interval on component unmount (`return () => clearInterval(id)`)
- Don't re-render the whole map on every tick — only update the zone that changed
- Keep the simulation log capped at 50 items (`array.slice(-50)`)
- Don't import entire icon libraries — pick individual icons

Target: page feels snappy. If scrolling or switching tabs feels sluggish, the interval is too frequent or you're re-rendering too much.

---

## 9. Code Guidelines (Keep It Simple)

**File naming:** PascalCase for components (`ZoneCard.jsx`), camelCase for everything else (`engine.js`).

**Component rule:** If a component is longer than ~100 lines, split it. One component = one responsibility.

**No premature abstraction.** If something is used once, don't abstract it. Abstract when you use it a third time.

**Context:** One `SimulationContext` holds all simulation state. One `AppContext` for things like the current role (attendee / admin) and alert list. Don't create a new context for every feature.

**Hardcoded data is fine for prototype.** Venue zones, staff names, scenario configs — keep them in `mockData.js` and `scenarios.js`. No need to fetch from an API.

**Folder rule:**
```
components/   → shared, reusable UI
pages/        → one file per route, composes components
simulation/   → engine logic only, no UI
context/      → React context files only
assets/       → SVGs, images
```

Keep it flat. Don't create subfolders until you have 10+ files in one folder.
