import React, { useContext, useState } from 'react';
import { VenueContext } from '../../context/VenueContext';
import QRFeedRow from '../../components/admin/QRFeedRow';

export default function QRFeed() {
  const { state } = useContext(VenueContext);
  const [filter, setFilter] = useState('All');

  const stats = {
    total: state.qrFeed.length,
    entry: state.qrFeed.filter(e => e.eventType === 'entry').length,
    intent: state.qrFeed.filter(e => e.eventType === 'intent').length,
    arrival: state.qrFeed.filter(e => e.eventType === 'zone_arrival').length,
    exit: state.qrFeed.filter(e => e.eventType === 'exit').length
  };

  const filteredFeed = filter === 'All' 
    ? state.qrFeed 
    : state.qrFeed.filter(e => {
        if (filter === 'Entries') return e.eventType === 'entry';
        if (filter === 'Intents') return e.eventType === 'intent';
        if (filter === 'Arrivals') return e.eventType === 'zone_arrival';
        if (filter === 'Exits') return e.eventType === 'exit';
        return true;
      });

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-border overflow-hidden shadow-lg">
      <div className="p-4 md:p-6 border-b border-border bg-base flex flex-col gap-4 z-10 shrink-0">
        <h2 className="text-xl font-bold text-primary">QR Scan Activity Feed</h2>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
           {[['Total', stats.total, 'text-primary'], 
             ['Entries', stats.entry, 'text-accent'], 
             ['Intents', stats.intent, 'text-caution'], 
             ['Arrivals', stats.arrival, 'text-safe'], 
             ['Exits', stats.exit, 'text-muted']].map(([label, val, col]) => (
             <div key={label} className="bg-elevated/30 border border-border/50 rounded-lg p-3 flex flex-col items-center justify-center">
               <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">{label}</div>
               <div className={`text-2xl font-bold ${col}`}>{val}</div>
             </div>
           ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-sm overflow-x-auto pb-1 mt-2 no-scrollbar">
          {['All', 'Entries', 'Intents', 'Arrivals', 'Exits'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-primary text-base' : 'bg-elevated text-muted hover:text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-[#0B1121]">
        <div className="flex flex-col">
          {filteredFeed.length === 0 ? (
            <div className="text-center p-12 text-muted h-full flex items-center justify-center">
              No activities found. The Simulation Engine generates events automatically.
            </div>
          ) : (
            filteredFeed.map(event => (
              <QRFeedRow key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
