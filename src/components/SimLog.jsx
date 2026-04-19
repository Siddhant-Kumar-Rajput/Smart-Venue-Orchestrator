import React, { useEffect, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function SimLog() {
  const { simLog } = useSimulation();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simLog]);

  return (
    <div className="rounded-xl border border-[#334155] bg-[#0F172A] p-4 flex flex-col h-64 shadow-inner">
      <h3 className="text-sm font-semibold text-[#94A3B8] mb-3 uppercase tracking-wide">Event Log</h3>
      <div className="flex-1 overflow-y-auto font-mono text-xs pr-2 space-y-1.5 custom-scrollbar">
        {simLog.map((log, i) => {
          let textClass = "text-[#38BDF8]"; // info blue
          if (log.type === 'critical' || log.type === 'emergency') textClass = "text-[#EF4444]";
          if (log.type === 'warning') textClass = "text-[#F59E0B]";
          
          return (
            <div key={i} className="flex gap-3">
              <span className="text-[#334155] whitespace-nowrap">{log.time}</span>
              <span className={textClass}>{log.message}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0F172A; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
          border-radius: 4px;
        }
      `}}/>
    </div>
  );
}
