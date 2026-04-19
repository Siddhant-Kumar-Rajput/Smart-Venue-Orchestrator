import React, { useRef, useEffect } from 'react';

export default function SimLog({ logs }) {
  const scrollRef = useRef(null);

  // Auto-scroll to top when logs update since newest is at top
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const getColor = (type) => {
    switch(type) {
      case 'alert': return 'text-critical';
      case 'qr': return 'text-accent';
      case 'scenario': return 'text-caution';
      case 'info':
      default: return 'text-muted';
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  return (
    <div className="bg-base border border-border rounded-xl flex flex-col h-full shadow-inner overflow-hidden font-mono text-[10px] md:text-xs">
      <div className="p-3 border-b border-border bg-surface text-primary font-bold font-sans flex justify-between items-center z-10">
        <span>Engine Event Stream</span>
        <span className="text-[10px] font-normal text-muted bg-elevated px-2 py-0.5 rounded">Showing last 50</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 flex flex-col items-start bg-[#0B1121]">
        {logs.map(log => (
          <div key={log.id} className={`flex gap-3 w-full hover:bg-elevated/20 p-1 rounded transition-colors ${getColor(log.type)}`}>
             <span className="opacity-50 shrink-0 select-none">[{formatTime(log.time)}]</span>
             <span className="font-semibold break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
