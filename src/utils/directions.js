export const directions = {
  "gate-1→food-court-a": {
    steps: [
      "Head straight through the Main Concourse",
      "Follow the blue Food signs on your left",
      "Food Court A is 50 metres ahead"
    ],
    walkingMins: 3
  },
  "gate-1→restroom-a": {
    steps: [
      "Turn left after the entrance turnstiles",
      "Restroom Block A is at the end of the corridor"
    ],
    walkingMins: 1
  },
  "food-court-a→main-stage": {
    steps: [
      "Exit the food court towards the central arena",
      "Follow the large illuminated arrows to the Main Stage",
      "Keep right to avoid the North Stand cross-traffic"
    ],
    walkingMins: 4
  },
  "gate-3→north-stand": {
    steps: [
      "Walk straight past the South Stand",
      "Take the escalators to Level 2",
      "North Stand entrances will be directly ahead"
    ],
    walkingMins: 6
  }
};

export function getDirections(fromZoneId, toZoneId) {
  const key = `${fromZoneId}→${toZoneId}`;
  return directions[key] || {
    steps: [
      `Follow the signs toward ${toZoneId.replace(/-/g, " ")}`,
      "Ask any staff member in a blue vest for help"
    ],
    walkingMins: 5
  };
}
