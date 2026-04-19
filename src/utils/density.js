export function densityColor(density) {
  if (density < 40) return "#22C55E";
  if (density < 70) return "#F59E0B";
  return "#EF4444";
}

export function densityLabel(density) {
  if (density < 40) return "Open";
  if (density < 70) return "Busy";
  return "Full";
}

export function densityBgClass(density) {
  if (density < 40) return "bg-safe/20 border-safe/30 text-safe";
  if (density < 70) return "bg-caution/20 border-caution/30 text-caution";
  return "bg-critical/20 border-critical/30 text-critical";
}
