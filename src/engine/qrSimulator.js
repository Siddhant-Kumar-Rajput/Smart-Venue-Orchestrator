const mockNames = [
  "Arjun M.", "Priya S.", "Rahul K.", "Zara A.", "Dev P.",
  "Neha R.", "Vikram S.", "Ananya T.", "Kabir N.", "Meera V."
];

export function simulateQRTick(zones, dispatch) {
  const count = Math.floor(Math.random() * 4); // 0–3 events per tick
  const types = ["entry", "intent", "zone_arrival", "exit"];

  for (let i = 0; i < count; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    let type = types[Math.floor(Math.random() * types.length)];
    
    // Make sure intent isn't generated for gate or exit for weird zones
    if (type === 'intent' && zone.category === 'entry') continue;

    let zoneStr = zone.name;
    if (type === 'intent') {
       // if intent, occasionally simulate a redirect string
       if (Math.random() > 0.7) {
         const otherZones = zones.filter(z => z.category === zone.category && z.id !== zone.id);
         if (otherZones.length > 0) {
           const alt = otherZones[Math.floor(Math.random() * otherZones.length)];
           zoneStr = `${zone.name}→${alt.name}`;
         }
       }
    }

    dispatch({
      type: "QR_EVENT_ADD",
      payload: {
        id: crypto.randomUUID(),
        eventType: type,
        attendeeName: mockNames[Math.floor(Math.random() * mockNames.length)],
        zoneId: zone.id,
        zoneName: zoneStr,
        timestamp: Date.now(),
      }
    });
  }
}
