import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function QRActivityFeed() {
  const { qrFeed } = useSimulation();
  const [filter, setFilter] = useState('All');

  const stats = {
    total: qrFeed.length,
    entry: qrFeed.filter(e => e.type === 'entry').length,
    intent: qrFeed.filter(e => e.type === 'intent').length,
    arrival: qrFeed.filter(e => e.type === 'zone_arrival').length,
    exit: qrFeed.filter(e => e.type === 'exit').length
  };

  const filteredFeed = filter === 'All' 
    ? qrFeed 
    : qrFeed.filter(e => {
        if (filter === 'Entries') return e.type === 'entry';
        if (filter === 'Intents') return e.type === 'intent';
        if (filter === 'Arrivals') return e.type === 'zone_arrival';
        if (filter === 'Exits') return e.type === 'exit';
        return true;
      });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'entry': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'intent': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'zone_arrival': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'exit': return 'bg-[#334155] text-[#94A3B8] border border-[#475569]';
      default: return 'bg-[#334155] text-[#F1F5F9] border border-[#475569]';
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#1E293B] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-4 md:p-6 border-b border-[#334155] bg-[#0F172A] flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">QR Scan Activity</h2>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {[['Total', stats.total, 'text-white'], 
             ['Entries', stats.entry, 'text-blue-400'], 
             ['Intents', stats.intent, 'text-amber-400'], 
             ['Arrivals', stats.arrival, 'text-green-400'], 
             ['Exits', stats.exit, 'text-[#94A3B8]']].map(([label, val, col]) => (
             <div key={label} className="bg-[#1E293B] border border-[#334155] rounded-lg p-3">
               <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{label}</div>
               <div className={`text-2xl font-bold ${col}`}>{val}</div>
             </div>
           ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 text-sm overflow-x-auto pb-1 mt-2">
          {['All', 'Entries', 'Intents', 'Arrivals', 'Exits'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-white text-black' : 'bg-[#334155] text-[#F1F5F9] hover:bg-[#475569]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {filteredFeed.length === 0 ? (
            <div className="text-center p-10 text-[#94A3B8]">No activities found. Activate simulation.</div>
          ) : (
            filteredFeed.map(event => (
              <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg hover:bg-[#334155]/50 border-b border-[#334155] last:border-0 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <div className="text-xs text-[#94A3B8] font-mono shrink-0 w-20">{formatTime(event.timestamp)}</div>
                  <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm w-24 text-center ${getBadgeStyle(event.type)}`}>
                    {event.type.replace('_', ' ')}
                  </div>
                  <div className="font-semibold text-[#F1F5F9] w-32 truncate">{event.attendeeName}</div>
                </div>
                
                <div className="md:ml-auto text-sm text-[#94A3B8] md:w-1/3 truncate md:text-right pl-[112px] md:pl-0">
                  {event.type === 'intent' && event.zone.includes('→') ? (
                    <span className="text-amber-400 font-medium">Redirected to {event.zone.split('→')[1]}</span>
                  ) : event.type === 'intent' ? (
                    <span>Headed to <strong className="text-white">{event.zone}</strong></span>
                  ) : event.type === 'exit' ? (
                    <span>Left via <strong className="text-white">{event.zone}</strong></span>
                  ) : event.type === 'entry' ? (
                    <span>Registered at <strong className="text-white">{event.zone}</strong></span>
                  ) : (
                    <span>Arrived at <strong className="text-white">{event.zone}</strong></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
