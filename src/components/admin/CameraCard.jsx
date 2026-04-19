import React from 'react';

export default function CameraCard({ cam, onConnect, onLearnMore }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col shadow-lg transition-transform hover:-translate-y-1">
      <div className="p-4 border-b border-border flex justify-between items-start bg-base">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">📷</span>
              <h3 className="font-bold text-primary text-sm">{cam.name}</h3>
           </div>
           <p className="text-xs text-muted font-mono">{cam.ip}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-border text-muted rounded border border-border">
          NOT CONNECTED
        </span>
      </div>
      
      <div className="flex-1 bg-[#020617] h-32 flex flex-col items-center justify-center p-6 text-center border-b border-border relative overflow-hidden group">
         <div className="text-elevated text-3xl mb-2">📹</div>
         <div className="text-xs text-border font-medium">Feed Unavailable</div>
         <div className="absolute inset-0 bg-base/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onConnect(cam)} className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-600 transition-colors">
              Configure RTSP
            </button>
         </div>
      </div>

      <div className="p-3 bg-base flex justify-between items-center text-xs">
         <span className="text-muted truncate max-w-[120px]">{cam.zone}</span>
         <div className="flex gap-2">
            <span className="bg-surface px-2 py-1 rounded text-muted font-mono border border-border">{cam.resolution}</span>
            <button onClick={onLearnMore} className="bg-elevated hover:bg-border text-primary px-2 py-1 rounded transition-colors text-[10px] uppercase font-bold">
              Info
            </button>
         </div>
      </div>
    </div>
  );
}
