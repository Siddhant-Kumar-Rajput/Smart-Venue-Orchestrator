/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:     "#0F172A",
        surface:  "#1E293B",
        elevated: "#334155",
        border:   "#475569",
        primary:  "#F1F5F9",
        muted:    "#94A3B8",
        accent:   "#3B82F6",
        safe:     "#22C55E",
        caution:  "#F59E0B",
        critical: "#EF4444",
        info:     "#38BDF8",
      }
    },
  },
  plugins: [],
}
