import React from 'react';

export default function QRFeedRow({ event }) {
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'entry': return 'bg-accent/20 text-accent border-accent/30';
      case 'intent': return 'bg-caution/20 text-caution border-caution/30';
      case 'zone_arrival': return 'bg-safe/20 text-safe border-safe/30';
      case 'exit': return 'bg-border text-muted border-border';
      default: return 'bg-border text-primary border-border';
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg hover:bg-elevated/50 border-b border-border/50 last:border-0 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-4 mb-2 md:mb-0">
        <div className="text-xs text-muted font-mono shrink-0 w-20">{formatTime(event.timestamp)}</div>
        <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm w-24 text-center border ${getBadgeStyle(event.eventType)}`}>
          {event.eventType.replace('_', ' ')}
        </div>
        <div className="font-semibold text-primary w-32 truncate">{event.attendeeName}</div>
      </div>
      
      <div className="md:ml-auto text-sm text-muted md:w-1/3 truncate md:text-right pl-[112px] md:pl-0">
        {event.eventType === 'intent' && event.zoneName.includes('→') ? (
          <span className="text-caution font-medium">Redirected to {event.zoneName.split('→')[1]}</span>
        ) : event.eventType === 'intent' ? (
          <span>Headed to <strong className="text-white">{event.zoneName}</strong></span>
        ) : event.eventType === 'exit' ? (
          <span>Left via <strong className="text-white">{event.zoneName}</strong></span>
        ) : event.eventType === 'entry' ? (
          <span>Registered at <strong className="text-white">{event.zoneName}</strong></span>
        ) : (
          <span>Arrived at <strong className="text-white">{event.zoneName}</strong></span>
        )}
      </div>
    </div>
  );
}
