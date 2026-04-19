export const scenarios = {
  normal: {
    description: "moderate density, short queues",
    zoneTarget: (zone) => zone.defaultDensity + (Math.random() * 10 - 5),
    queueTarget: (queue) => queue.baseWaitTime + (Math.random() * 2),
  },
  surge: {
    description: "2-3 zones spike to critical density",
    zoneTarget: (zone) => ['North Stand', 'Main Concourse'].includes(zone.name) ? 85 : zone.defaultDensity,
    queueTarget: (queue) => queue.baseWaitTime * 1.5,
  },
  emergency: {
    description: "one zone goes to 100%, emergency alert fires",
    zoneTarget: (zone) => zone.name === 'South Stand' ? 100 : zone.defaultDensity * 0.4,
    queueTarget: (queue) => queue.baseWaitTime * 0.5, // people abandon queues
  },
  halftime: {
    description: "food/restroom queues spike sharply",
    zoneTarget: (zone) => zone.defaultDensity * 0.8, // stands empty a bit
    queueTarget: (queue) => ['Food & Beverage', 'Restrooms'].includes(queue.type) ? queue.baseWaitTime * 3 : queue.baseWaitTime,
  },
  vip: {
    description: "entry gate and specific zones surge briefly",
    zoneTarget: (zone) => zone.name === 'VIP Lounge' ? 95 : zone.defaultDensity,
    queueTarget: (queue) => queue.type === 'Entry' ? queue.baseWaitTime * 2 : queue.baseWaitTime,
  }
};
