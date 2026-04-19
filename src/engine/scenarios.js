export const scenarios = {
  normal: {
    label: "Normal Operations",
    icon: "✅",
    description: "Steady crowd, manageable queues. Baseline state.",
    zoneTargets: {
      "gate-1": 45, "gate-2": 35, "gate-3": 40,
      "north-stand": 60, "south-stand": 55, "main-stage": 65,
      "food-court-a": 50, "food-court-b": 40,
      "restroom-a": 45, "restroom-b": 40,
    },
    noise: 5,
  },
  surge: {
    label: "Crowd Surge",
    icon: "🌊",
    description: "Sudden influx at entry gates. North Stand filling fast.",
    zoneTargets: {
      "gate-1": 92, "gate-2": 78, "gate-3": 88,
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
      "gate-1": 98, "gate-2": 95, "gate-3": 97,
      "north-stand": 40, "south-stand": 35, "main-stage": 100,
      "food-court-a": 30, "food-court-b": 25,
      "restroom-a": 20, "restroom-b": 18,
    },
    noise: 3,
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
      "gate-1": 30, "gate-2": 25, "gate-3": 28,
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
      "gate-1": 55, "gate-2": 98, "gate-3": 50,
      "north-stand": 60, "south-stand": 95, "main-stage": 65,
      "food-court-a": 55, "food-court-b": 50,
      "restroom-a": 48, "restroom-b": 42,
    },
    noise: 4,
  },
};
