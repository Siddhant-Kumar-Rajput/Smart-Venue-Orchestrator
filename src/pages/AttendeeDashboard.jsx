import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import ZoneCard from '../components/ZoneCard';
import QueueItem from '../components/QueueItem';
import { Link } from 'react-router-dom';

export default function AttendeeDashboard() {
  const { zones, queues } = useSimulation();

  const busyZones = [...zones].sort((a, b) => b.density - a.density).slice(0, 3);
  const coreQueues = queues.slice(0, 4);

  return (
    <div className="p-4 flex flex-col gap-8 w-full max-w-3xl mx-auto">
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold">Busiest Areas</h2>
            <p className="text-sm text-[#94A3B8]">High density zones</p>
          </div>
          <Link to="/attendee/map" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View Map &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {busyZones.map(z => (
            <ZoneCard key={z.id} name={z.name} density={z.density} waitTime={z.waitTime} trend={z.trend} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-xl font-bold">Current Wait Times</h2>
            <p className="text-sm text-[#94A3B8]">Main service points</p>
          </div>
          <Link to="/attendee/queues" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">All Queues &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreQueues.map(q => (
            <QueueItem key={q.id} name={q.name} waitTime={q.waitTime} trend={q.trend} />
          ))}
        </div>
      </section>
    </div>
  );
}
