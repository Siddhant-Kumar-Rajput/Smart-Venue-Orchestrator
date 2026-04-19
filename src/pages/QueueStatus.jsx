import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import QueueItem from '../components/QueueItem';

export default function QueueStatus() {
  const { queues } = useSimulation();
  const [filter, setFilter] = useState('All');

  const tabs = ['All', 'Entry', 'Food & Beverage', 'Restrooms', 'Medical'];

  const filtered = filter === 'All' ? queues : queues.filter(q => q.type === filter);

  return (
    <div className="p-4 w-full max-w-3xl mx-auto flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-2xl font-bold">Live Wait Times</h2>
        <p className="text-sm text-[#94A3B8] mt-1">Updated automatically from venue sensors</p>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#334155] border border-[#334155]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(q => (
          <QueueItem key={q.id} name={q.name} waitTime={q.waitTime} trend={q.trend} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-12 bg-[#1E293B] rounded-xl border border-[#334155] text-[#94A3B8]">
            No queues found for {filter}.
          </div>
        )}
      </div>
    </div>
  );
}
