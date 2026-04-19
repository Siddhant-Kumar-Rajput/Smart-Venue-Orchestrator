export const mockZones = [
  { id: 'north-stand', name: 'North Stand', defaultDensity: 30, x: 200, y: 50, width: 400, height: 100, category: 'seating' },
  { id: 'south-stand', name: 'South Stand', defaultDensity: 40, x: 200, y: 450, width: 400, height: 100, category: 'seating' },
  { id: 'main-concourse', name: 'Main Concourse', defaultDensity: 60, x: 200, y: 150, width: 400, height: 300, category: 'stage' },
  { id: 'vip-lounge', name: 'VIP Lounge', defaultDensity: 20, x: 600, y: 150, width: 150, height: 100, category: 'seating' },
  { id: 'food-court-a', name: 'Food Court A', defaultDensity: 50, x: 50, y: 150, width: 150, height: 200, category: 'food' },
  { id: 'food-court-b', name: 'Food Court B', defaultDensity: 70, x: 50, y: 350, width: 150, height: 100, category: 'food' },
  { id: 'restroom-north', name: 'North Restroom Block', defaultDensity: 30, x: 100, y: 50, width: 100, height: 50, category: 'restrooms' },
  { id: 'medical-center', name: 'Medical Center', defaultDensity: 10, x: 50, y: 50, width: 50, height: 50, category: 'medical' },
  { id: 'gate-1', name: 'Gate 1', defaultDensity: 20, x: 300, y: 0, width: 100, height: 50, category: 'entry' },
  { id: 'gate-3', name: 'Gate 3', defaultDensity: 40, x: 300, y: 550, width: 100, height: 50, category: 'entry' }
];

export const mockStaff = [
  { id: 's1', name: 'Alice Parker', zone: 'North Stand', status: 'Active' },
  { id: 's2', name: 'Bob Smith', zone: 'South Stand', status: 'Active' },
  { id: 's3', name: 'Charlie Liu', zone: 'Main Concourse', status: 'On Break' },
  { id: 's4', name: 'Diana Prince', zone: 'VIP Lounge', status: 'Active' },
  { id: 's5', name: 'Ethan Hunt', zone: 'Food Court A', status: 'Active' },
  { id: 's6', name: 'Fiona Gallagher', zone: 'Medical Center', status: 'Active' },
  { id: 's7', name: 'George Costanza', zone: 'Main Concourse', status: 'Inactive' },
  { id: 's8', name: 'Hannah Abbott', zone: 'North Stand', status: 'Active' },
];

export const mockQueues = [
  { id: 'entry-main', name: 'Entry Gate', type: 'Entry', waitTime: 5, trend: '→' },
  { id: 'food-main', name: 'Food Court', type: 'Food & Beverage', waitTime: 12, trend: '↑' },
  { id: 'restroom-main', name: 'Restrooms', type: 'Restrooms', waitTime: 3, trend: '→' },
  { id: 'medical-main', name: 'Medical', type: 'Medical', waitTime: 0, trend: '→' }
];

export const zoneCategories = {
  food: ["Food Court A", "Food Court B", "Snack Bar North", "Snack Bar South"],
  restrooms: ["North Restroom Block", "Restroom Block B", "Restroom Block C"],
  seating: ["North Stand", "South Stand", "East Gallery", "VIP Lounge"],
  stage: ["Main Stage Area", "Stage Left Viewing", "Main Concourse"],
  entry: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5"]
};

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
  "Gate 3→Main Concourse": [
    "Enter through the turnstiles at Gate 3",
    "Proceed straight past the security checkpoint",
    "You have arrived at the Main Concourse"
  ],
  "Food Court A→North Stand": [
    "Exit Food Court A towards the west tunnel",
    "Take a right at the end of the tunnel",
    "North Stand entrance will be on your left"
  ],
  "Gate 1→Food Court B": [
    "Head south along the outer ring",
    "Turn right before South Stand",
    "Food Court B is straight ahead"
  ]
};

export const walkingMinutes = {
  "Gate 1": { "Food Court A": 4, "Food Court B": 6, "North Stand": 3, "Main Concourse": 2 },
  "Gate 3": { "Food Court A": 2, "Food Court B": 8, "North Stand": 5, "Main Concourse": 1 },
  "Food Court A": { "North Stand": 2, "Gate 1": 4, "Gate 3": 2, "Food Court B": 7 },
  "Food Court B": { "North Stand": 8, "South Stand": 2, "Main Concourse": 4 },
  "North Stand": { "Food Court A": 2, "Gate 1": 3 },
  "Main Concourse": { "Gate 3": 1, "Food Court A": 3, "North Stand": 2 }
};

export const mockCameras = [
  { id: "cam-01", name: "Main Entrance Cam", zone: "Gate 1", status: "disconnected", resolution: "1080p", ip: "192.168.1.101" },
  { id: "cam-02", name: "North Concourse Cam", zone: "North Stand", status: "disconnected", resolution: "1080p", ip: "192.168.1.102" },
  { id: "cam-03", name: "Food Court Cam A", zone: "Food Court A", status: "disconnected", resolution: "720p", ip: "192.168.1.103" },
  { id: "cam-04", name: "Gate 3 Entry Cam", zone: "Gate 3", status: "disconnected", resolution: "1080p", ip: "192.168.1.104" },
  { id: "cam-05", name: "South Stand Cam", zone: "South Stand", status: "disconnected", resolution: "1080p", ip: "192.168.1.105" },
  { id: "cam-06", name: "Emergency Exit Cam", zone: "Main Concourse", status: "disconnected", resolution: "720p", ip: "192.168.1.106" },
];
