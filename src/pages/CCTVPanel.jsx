import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { toast } from 'react-hot-toast';

export default function CCTVPanel() {
  const { cctvCameras } = useSimulation();
  const [activeModal, setActiveModal] = useState(null); // 'connection', 'architecture', null
  const [selectedCam, setSelectedCam] = useState(null);

  const openConnection = (cam) => {
    setSelectedCam(cam);
    setActiveModal('connection');
  };

  const handleTest = () => toast('Connection test is disabled in prototype mode.', { icon: '⚠️' });
  const handleSave = () => toast('CCTV integration is available in production deployment.', { icon: 'ℹ️' });
  const handleScan = () => toast('Network scan is disabled in prototype mode. Use Simulation Engine.', { icon: '⚠️' });
  const handleDownload = () => toast('Integration guide will be available in production package.', { icon: 'ℹ️' });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Mode Bar */}
      <div className="flex border-b border-[#334155] bg-[#1E293B] rounded-t-xl overflow-hidden mb-6">
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-[#94A3B8]">
           Simulation Engine ✓ <br/><span className="text-[10px] font-normal">(active)</span>
        </button>
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-[#94A3B8]">
           QR Tracking <br/><span className="text-[10px] font-normal">(partial)</span>
        </button>
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-blue-500 text-white bg-[#0F172A]">
           CCTV Analysis <br/><span className="text-[10px] font-normal text-blue-400">(configure)</span>
        </button>
      </div>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">CCTV Intelligence Integration</h1>
          <p className="text-[#94A3B8] max-w-2xl text-sm">
            Connect local RTSP camera streams to the Edge AI Server to gather real-time crowd density metrics. 
            No video is sent to the cloud. Counts update the heatmap locally.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveModal('architecture')} className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
             View Architecture
          </button>
          <button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-md font-semibold">
             Scan Network
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
         {cctvCameras.map(cam => (
           <div key={cam.id} className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden flex flex-col shadow-lg">
             <div className="p-4 border-b border-[#334155] flex justify-between items-start bg-[#0F172A]">
               <div>
                  <h3 className="font-bold text-white">{cam.name}</h3>
                  <p className="text-xs text-[#94A3B8] font-mono mt-1">{cam.ip}</p>
               </div>
               <span className="text-[10px] font-bold px-2 py-1 bg-[#334155] text-[#94A3B8] rounded border border-[#475569]">
                 NOT CONNECTED
               </span>
             </div>
             
             <div className="flex-1 bg-[#020617] h-32 flex flex-col items-center justify-center p-6 text-center border-b border-[#334155] relative overflow-hidden group">
                <div className="text-[#334155] text-4xl mb-2">📹</div>
                <div className="text-xs text-[#475569] font-medium">Feed available after connection</div>
                <div className="absolute inset-0 bg-[#0F172A]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openConnection(cam)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">Configure RTSP</button>
                </div>
             </div>

             <div className="p-3 bg-[#0F172A] flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">{cam.zone}</span>
                <span className="bg-[#1E293B] px-2 py-1 rounded text-[#94A3B8] font-mono">{cam.resolution}</span>
             </div>
           </div>
         ))}
      </div>

      {/* Connection Modal */}
      {activeModal === 'connection' && selectedCam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0F172A] rounded-t-xl">
                <h3 className="font-bold text-white">Connect Camera — {selectedCam.name}</h3>
                <button onClick={() => setActiveModal(null)} className="text-[#94A3B8] hover:text-white">&times;</button>
             </div>
             
             <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-[100px_1fr] items-center gap-2 text-sm">
                  <label className="text-[#94A3B8]">Camera IP</label>
                  <input type="text" disabled value={selectedCam.ip} className="bg-[#0F172A] border border-[#334155] rounded p-2 text-white/50" />
                  
                  <label className="text-[#94A3B8]">Port</label>
                  <input type="text" readOnly value="554" className="bg-[#0F172A] border border-[#334155] rounded p-2 text-white" />
                  
                  <label className="text-[#94A3B8]">Protocol</label>
                  <select className="bg-[#0F172A] border border-[#334155] rounded p-2 text-white">
                    <option>RTSP</option>
                  </select>
                  
                  <label className="text-[#94A3B8]">Username</label>
                  <input type="text" placeholder="admin" className="bg-[#0F172A] border border-[#334155] rounded p-2 text-white" />
                  
                  <label className="text-[#94A3B8]">Password</label>
                  <input type="password" placeholder="••••••" className="bg-[#0F172A] border border-[#334155] rounded p-2 text-white" />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3 rounded-lg text-xs flex gap-2">
                  <span className="text-xl -mt-1">ℹ️</span>
                  <p>Camera must be on the same local network as the intelligence server.</p>
                </div>

                <div className="border border-[#334155] rounded-lg p-3">
                  <label className="text-xs text-[#94A3B8] uppercase block mb-2 font-bold">AI Analysis Modes</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" readOnly checked className="accent-blue-500"/> Person Counting</label>
                    <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" readOnly checked className="accent-blue-500"/> Zone Density mapped</label>
                    <label className="flex items-center gap-2 text-sm text-[#94A3B8]"><input type="checkbox" disabled /> Anomaly Detection</label>
                  </div>
                </div>
             </div>

             <div className="p-4 border-t border-[#334155] bg-[#0F172A] rounded-b-xl flex justify-end gap-3">
               <button onClick={handleTest} className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-sm rounded-lg transition-colors">Test Connection</button>
               <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Save & Connect</button>
             </div>
           </div>
        </div>
      )}

      {/* Architecture Modal */}
      {activeModal === 'architecture' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-[#0F172A] border border-[#334155] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="sticky top-0 p-4 border-b border-[#334155] flex justify-between items-center bg-[#1E293B] rounded-t-xl z-10 shadow-md">
                <h3 className="font-bold text-white text-lg">System Architecture: Edge AI</h3>
                <button onClick={() => setActiveModal(null)} className="text-[#94A3B8] hover:text-white bg-[#334155] rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
             </div>
             
             <div className="p-8 pb-12 flex flex-col gap-8 items-center text-center">
               
               {/* Diagram SVG */}
               <svg className="w-full max-w-2xl h-auto" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M400 120 L400 180" stroke="#334155" strokeWidth="4" strokeDasharray="8 8" className="animate-[dash_1s_linear_infinite]" />
                  <path d="M400 280 L400 340" stroke="#334155" strokeWidth="4" strokeDasharray="8 8" className="animate-[dash_1s_linear_infinite]" />
                  <path d="M400 420 L250 420 L250 460" stroke="#334155" strokeWidth="4" fill="none"/>
                  <path d="M400 420 L550 420 L550 460" stroke="#334155" strokeWidth="4" fill="none"/>
                  <path d="M400 420 L400 460" stroke="#334155" strokeWidth="4" fill="none"/>

                  <rect x="300" y="40" width="200" height="80" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
                  <text x="400" y="80" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">CCTV Camera</text>
                  <text x="400" y="100" fill="#94A3B8" fontSize="14" textAnchor="middle">RTSP Stream</text>

                  <rect x="250" y="180" width="300" height="100" rx="10" fill="#1E40AF" stroke="#3B82F6" strokeWidth="3"/>
                  <text x="400" y="215" fill="white" fontSize="22" fontWeight="bold" textAnchor="middle">Local AI Server</text>
                  <text x="400" y="240" fill="#93C5FD" fontSize="16" textAnchor="middle">TensorFlow.js (COCO-SSD)</text>
                  <text x="400" y="265" fill="white" fontSize="14" fontStyle="italic" textAnchor="middle">Person Detection & Counting</text>

                  <rect x="300" y="340" width="200" height="80" rx="10" fill="#065F46" stroke="#10B981" strokeWidth="3"/>
                  <text x="400" y="380" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">SimulationContext</text>
                  <text x="400" y="400" fill="#A7F3D0" fontSize="14" textAnchor="middle">Zone Density Update</text>

                  <rect x="150" y="460" width="200" height="60" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
                  <text x="250" y="495" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Admin Heatmap</text>

                  <rect x="450" y="460" width="200" height="60" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
                  <text x="550" y="495" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Attendee App</text>
               </svg>

               {/* Explanation Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-xl">
                    <h4 className="font-bold text-white text-base mb-2">How it works in production</h4>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">Each CCTV camera streams video over RTSP to a local AI server running on the venue's network. A TensorFlow.js model counts people in each frame and updates zone density every 5 seconds. No video is stored — only the count number is sent to the system.</p>
                  </div>
                  <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-xl">
                    <h4 className="font-bold text-white text-base mb-2">WiFi Requirement</h4>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">All cameras and the AI server must be on the same local WiFi or LAN. The system auto-discovers cameras using mDNS. Admin scans for available cameras using the 'Scan Network' button.</p>
                  </div>
                  <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-xl">
                    <h4 className="font-bold text-white text-base mb-2">Privacy & GDPR</h4>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">No video footage leaves the venue network. The AI model processes frames locally and only transmits occupancy counts, ensuring 100% GDPR compliance regarding biometric data.</p>
                  </div>
                  <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-xl border-l-4 border-l-amber-500">
                    <h4 className="font-bold text-white text-base mb-2">In this prototype</h4>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">The Simulation Engine generates the exact same schema data that the CCTV AI Server would produce in production. The system acts identically regardless of source.</p>
                  </div>
               </div>

               <button onClick={handleDownload} className="mt-4 px-6 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-xl font-bold transition-colors w-full md:w-auto">
                 Download Integration Guide (PDF)
               </button>

             </div>
           </div>
        </div>
      )}
    </div>
  );
}
