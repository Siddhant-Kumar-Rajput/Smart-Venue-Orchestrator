export function checkAlertRules(zones, existingAlerts, dispatch) {
  zones.forEach(zone => {
    const alreadyAlerted = existingAlerts.some(
      a => a.zoneId === zone.id && !a.acknowledged &&
           Date.now() - a.timestamp < 60000 
    );
    if (alreadyAlerted) return;

    if (zone.density >= 90) {
      dispatch({ type: "ALERT_ADD", payload: {
        id: crypto.randomUUID(), type: "critical",
        title: `Critical — ${zone.name}`,
        message: `${zone.name} is at ${Math.round(zone.density)}% capacity. Immediate action required.`,
        zoneId: zone.id, timestamp: Date.now(), acknowledged: false,
      }});
    } else if (zone.density >= 75 && zone.trend === "rising") {
      dispatch({ type: "ALERT_ADD", payload: {
        id: crypto.randomUUID(), type: "warning",
        title: `Warning — ${zone.name}`,
        message: `${zone.name} is at ${Math.round(zone.density)}% and rising. Consider rerouting attendees.`,
        zoneId: zone.id, timestamp: Date.now(), acknowledged: false,
      }});
    }
  });
}
