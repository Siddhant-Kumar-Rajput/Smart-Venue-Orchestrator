import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import ZoneCard from '../../components/attendee/ZoneCard';
import QueueItem from '../../components/attendee/QueueItem';

export default function Dashboard() {
  const { state } = useContext(VenueContext);
  const navigate = useNavigate();

  const sortedZones = [...state.zones].sort((a, b) => b.density - a.density);
  const top4Zones = sortedZones.slice(0, 4);

  const queues = state.zones.filter(z => z.category === 'food' || z.category === 'restroom').sort((a, b) => b.waitTime - a.waitTime);
  const top4Queues = queues.slice(0, 4);

  const getIcon = (cat) => {
    switch (cat) {
      case 'food': return '🍔';
      case 'restroom': return '🚻';
      case 'entry': return '🚪';
      case 'seating': return '💺';
      case 'stage': return '🎭';
      default: return '📍';
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div>
         <h2 className="text-xl font-bold text-primary mb-3">Venue Overview</h2>
         <div className="grid grid-cols-1 gap-3">
           {top4Zones.map(zone => <ZoneCard key={zone.id} zone={zone} />)}
         </div>
      </div>
      
      <div>
         <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-primary">Queue Status</h2>
            <button onClick={() => navigate('/attendee/queues')} className="text-sm font-semibold text-accent hover:text-blue-400 text-right pr-2">See all &rarr;</button>
         </div>
         <div className="grid grid-cols-1 gap-2">
           {top4Queues.map(queue => <QueueItem key={queue.id} zone={queue} icon={getIcon(queue.category)} />)}
         </div>
      </div>

      <div className="pt-2">
        <button onClick={() => navigate('/attendee/map')} className="w-full border border-border bg-surface text-primary hover:bg-elevated text-sm py-3.5 rounded-xl font-medium transition-colors">
          View Full Venue Map 🗺️
        </button>
      </div>
    </div>
  );
}
