import { getDirections } from './directions';

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
      const walkTimeInfo = getDirections(currentZoneId, z.id);
      const walkTime = walkTimeInfo.walkingMins;
      
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
