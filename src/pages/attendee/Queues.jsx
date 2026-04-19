import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';
import QueueItem from '../../components/attendee/QueueItem';

export default function Queues() {
  const { state } = useContext(VenueContext);

  const queues = state.zones.filter(z => z.category !== 'entry').sort((a, b) => b.waitTime - a.waitTime);

  const getIcon = (cat) => {
    switch (cat) {
      case 'food': return '🍔';
      case 'restroom': return '🚻';
      case 'seating': return '💺';
      case 'stage': return '🎭';
      default: return '📍';
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-primary mb-1">All Wait Times</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {queues.map(queue => (
          <QueueItem key={queue.id} zone={queue} icon={getIcon(queue.category)} />
        ))}
      </div>
    </div>
  );
}
