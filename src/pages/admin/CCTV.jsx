import React, { useContext, useState } from 'react';
import { VenueContext } from '../../context/VenueContext';
import CameraCard from '../../components/admin/CameraCard';
import { toast } from 'react-hot-toast';

export default function CCTV() {
  const { state } = useContext(VenueContext);
  const [activeModal, setActiveModal] = useState(null); // 'connection', 'architecture', null
  const [selectedCam, setSelectedCam] = useState(null);

  const openConnection = (cam) => {
    setSelectedCam(cam);
    setActiveModal('connection');
  };

  const showToast = () => {
    toast('Camera connection is disabled in prototype mode. Use the Simulation Engine for live data.', { icon: '⚠️' });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-10">
      
      {/* Top Mode Bar */}
      <div className="flex border-b border-border bg-surface rounded-t-xl overflow-hidden mb-6 shrink-0">
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-muted bg-[#0B1121]">
           Simulation Engine ✓ <br/><span className="text-[10px] font-normal text-safe">(ACTIVE)</span>
        </button>
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-muted">
           QR Tracking <br/><span className="text-[10px] font-normal">(partial — see QR Feed)</span>
        </button>
        <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-accent text-primary bg-elevated/30" title="Connect a camera below to activate CCTV analysis">
           CCTV Analysis <br/><span className="text-[10px] font-normal text-accent">(requires camera connection)</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary">CCTV Integration</h1>
            <span className="text-[10px] uppercase font-bold bg-elevated border border-border text-primary px-2 py-0.5 rounded">Prototype Mode</span>
          </div>
          <p className="text-muted max-w-2xl text-sm leading-relaxed">
            Connect live camera feeds for AI-powered crowd analysis.
            In production, this panel connects to cameras on your local network and uses a TensorFlow.js AI model to count people in each zone automatically. All processing is local — no video leaves the venue network.
          </p>
        </div>
        <button onClick={() => setActiveModal('architecture')} className="bg-elevated hover:bg-border border border-border text-primary px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
           View Architecture
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {state.cameras.map(cam => (
           <CameraCard key={cam.id} cam={cam} onConnect={openConnection} onLearnMore={() => setActiveModal('architecture')} />
         ))}
      </div>

      {/* Connection Modal */}
      {activeModal === 'connection' && selectedCam && (
        <div className="fixed inset-0 bg-base/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-surface border border-border rounded-xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="p-4 border-b border-border bg-base flex justify-between items-center rounded-t-xl">
                <h3 className="font-bold text-primary">Connect Camera — {selectedCam.name}</h3>
                <button onClick={() => setActiveModal(null)} className="text-muted hover:text-primary p-1">&times;</button>
             </div>
             
             <div className="p-6 flex flex-col gap-4 text-sm">
                <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                  <label className="text-muted font-medium">Camera IP</label>
                  <input type="text" readOnly value={selectedCam.ip} className="bg-base border border-border rounded p-2 text-primary/50 cursor-not-allowed" />
                  
                  <label className="text-muted font-medium">Port</label>
                  <input type="text" readOnly value="554" className="bg-base border border-border rounded p-2 text-primary/50 cursor-not-allowed" />
                  
                  <label className="text-muted font-medium">Protocol</label>
                  <select className="bg-base border border-border rounded p-2 text-primary focus:border-accent">
                    <option>RTSP</option>
                  </select>
                  
                  <label className="text-muted font-medium">Username</label>
                  <input type="text" placeholder="admin" className="bg-base border border-border rounded p-2 text-primary focus:border-accent" />
                  
                  <label className="text-muted font-medium">Password</label>
                  <input type="password" placeholder="••••••" className="bg-base border border-border rounded p-2 text-primary focus:border-accent" />
                </div>

                <div className="bg-info/10 border border-info/30 text-info p-3 rounded-lg text-xs flex gap-2 mt-2">
                  <span className="text-lg -mt-0.5">ℹ️</span>
                  <p>Camera must be on the same WiFi/LAN as the server.</p>
                </div>

                <div className="border border-border rounded-lg p-4 mt-2 bg-base">
                  <label className="text-[10px] text-muted uppercase tracking-wider block mb-3 font-bold">AI Analysis Options</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 text-sm text-primary cursor-pointer">
                      <input type="checkbox" readOnly checked className="accent-accent w-4 h-4"/> Person Counting
                    </label>
                    <label className="flex items-center gap-3 text-sm text-primary cursor-pointer">
                      <input type="checkbox" readOnly checked className="accent-accent w-4 h-4"/> Zone Density Estimation
                    </label>
                    <label className="flex items-center gap-3 text-sm text-muted cursor-not-allowed">
                      <input type="checkbox" disabled className="w-4 h-4"/> Anomaly Detection (Beta)
                    </label>
                  </div>
                </div>
                
                <div className="text-[10px] text-muted flex gap-2 mt-2">
                   <span className="text-sm">ⓘ</span>
                   <p>CCTV integration requires the Venue Intelligence Server running on a local device.</p>
                </div>
             </div>

             <div className="p-4 border-t border-border bg-base rounded-b-xl flex justify-end gap-3">
               <button onClick={showToast} className="px-5 py-2.5 bg-elevated hover:bg-border text-primary text-sm font-medium rounded-lg transition-colors">Test Connection</button>
               <button onClick={showToast} className="px-5 py-2.5 bg-accent hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">Save & Connect</button>
             </div>
           </div>
        </div>
      )}

      {/* Architecture Modal */}
      {activeModal === 'architecture' && (
        <div className="fixed inset-0 bg-base/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="sticky top-0 p-5 border-b border-border bg-surface rounded-t-2xl z-10 shadow-sm flex justify-between items-center">
                <h3 className="font-bold text-primary text-xl">How CCTV Integration Works in Production</h3>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:text-primary transition-colors">&times;</button>
             </div>
             
             <div className="p-8 pb-12 flex flex-col gap-10 items-center">
               
               <div className="bg-base rounded-xl border border-border p-8 w-full flex justify-center text-sm font-medium relative">
                 <div className="flex flex-col items-center">
                    
                    <div className="w-48 h-20 bg-surface border-2 border-border rounded-xl flex items-center justify-center shadow-lg z-10">
                      <div className="flex flex-col items-center">
                         <span className="font-bold text-primary text-base">CCTV Camera</span>
                      </div>
                    </div>
                    
                    <div className="h-16 w-1 bg-accent/50 relative overflow-hidden my-1">
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-accent animate-[slideDown_1.5s_linear_infinite] h-8"></div>
                    </div>
                    <div className="text-xs text-muted mb-1 bg-base px-2">RTSP Stream</div>
                    
                    <div className="w-72 h-28 bg-blue-900 border-2 border-accent rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10 text-center p-4 px-8">
                       <span className="font-bold text-white text-lg">Venue Intelligence Server</span>
                       <span className="text-blue-300 text-xs mt-1">TensorFlow.js (COCO-SSD)</span>
                       <span className="text-blue-100 text-xs italic mt-1 bg-black/20 rounded px-2 py-0.5">Person Detection + Counting</span>
                    </div>

                    <div className="h-16 w-1 bg-safe/50 relative overflow-hidden my-1">
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-safe animate-[slideDown_1.5s_linear_infinite] h-8"></div>
                    </div>
                    <div className="text-xs text-safe mb-1 bg-base px-2">Zone Density Data (every 5s)</div>

                    <div className="w-64 h-16 bg-surface border-2 border-border rounded-xl flex items-center justify-center shadow-lg z-10">
                       <span className="font-bold text-primary text-base">Smart Venue Orchestrator API</span>
                    </div>

                    <div className="flex w-80 h-10 border-b-2 border-border relative mt-[-2px]">
                       <div className="w-2 h-full border-l-2 border-border absolute left-0 bottom-0 top-0"></div>
                       <div className="w-2 h-full border-r-2 border-border absolute right-0 bottom-0 top-0"></div>
                    </div>

                    <div className="flex justify-between w-96 mt-2 relative">
                       <div className="w-40 h-16 bg-[#0B1121] border-2 border-border rounded-xl flex items-center justify-center absolute left-[-20px] top-0">
                         <span className="font-bold text-primary text-sm text-center">Admin Intent Map<br/><span className="text-[10px] text-muted font-normal block pt-1">(live updates)</span></span>
                       </div>
                       <div className="w-40 h-16 bg-[#0B1121] border-2 border-border rounded-xl flex items-center justify-center absolute right-[-20px] top-0">
                         <span className="font-bold text-primary text-sm text-center">Attendee App<br/><span className="text-[10px] text-muted font-normal block pt-1">(warnings)</span></span>
                       </div>
                    </div>
                    <div className="h-16"></div> {/* Spacer */}

                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="bg-surface border border-border p-6 rounded-xl">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><span>1️⃣</span> Local Processing</h4>
                    <p className="text-muted text-sm leading-relaxed">Video is analysed on a local server running TensorFlow.js. No footage is transmitted outside the venue network. Only occupancy counts are shared with the system.</p>
                  </div>
                  <div className="bg-surface border border-border p-6 rounded-xl">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><span>2️⃣</span> Auto-Discovery</h4>
                    <p className="text-muted text-sm leading-relaxed">The system scans the local WiFi for RTSP-capable cameras using mDNS. Cameras are auto-detected and listed here for one-click connection.</p>
                  </div>
                  <div className="bg-surface border border-border p-6 rounded-xl">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><span>3️⃣</span> What the AI Sees</h4>
                    <p className="text-muted text-sm leading-relaxed">The COCO-SSD model identifies people in each frame and counts them per zone. It updates zone density every 5 seconds — the same rhythm as the simulation engine in this prototype.</p>
                  </div>
                  <div className="bg-surface border border-accent/50 p-6 rounded-xl bg-accent/5">
                    <h4 className="font-bold text-accent mb-2 flex items-center gap-2"><span>ℹ️</span> In This Prototype</h4>
                    <p className="text-primary text-sm leading-relaxed font-medium">The Simulation Engine generates the exact same zone density data that CCTV AI would produce in production. Switch to Simulation Engine mode above to see the full system working.</p>
                  </div>
               </div>

             </div>
           </div>
        </div>
      )}
    </div>
  );
}
