import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Guest';
  const gateParam = searchParams.get('gate') || '1';
  
  const { zones, alerts } = useSimulation();
  
  // Calculate average venue capacity from zones
  const avgCapacity = zones.length > 0 
    ? Math.round(zones.reduce((acc, z) => acc + z.density, 0) / zones.length) 
    : 0;
    
  // Nearest food naive logic
  const foodWait = 12; // Static for prototype UX 

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#F1F5F9] pb-8">
      <div className="max-w-md w-full mx-auto px-4 pt-10">
        <h1 className="text-3xl font-bold mb-1">Hey, {name}! 👋</h1>
        <p className="text-[#94A3B8] mb-8">You're at Gate {gateParam} — North Entrance</p>
        
        <div className="flex bg-[#1E293B] border border-[#334155] rounded-xl mb-8 p-4 justify-between text-center divide-x divide-[#334155] shadow-lg">
          <div className="px-2 w-1/3">
             <p className="text-[#94A3B8] text-xs mb-1 uppercase">Capacity</p>
             <p className="font-bold text-lg text-white">{avgCapacity}%</p>
          </div>
          <div className="px-2 w-1/3">
             <p className="text-[#94A3B8] text-xs mb-1 uppercase">Nearest Food</p>
             <p className="font-bold text-lg text-amber-400">~{foodWait}m wait</p>
          </div>
          <div className="px-2 w-1/3">
             <p className="text-[#94A3B8] text-xs mb-1 uppercase">Alerts</p>
             <p className={`font-bold text-lg ${alerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>{alerts.length}</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-sm mb-6">
           <h2 className="text-xl font-bold mb-4">Where do you want to go?</h2>
           <div className="grid grid-cols-2 gap-4">
             <button onClick={() => navigate('/go?category=food')} className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
               <span className="text-3xl">🍔</span>
               <span className="font-semibold text-sm">Food & Drinks</span>
             </button>
             <button onClick={() => navigate('/go?category=restrooms')} className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
               <span className="text-3xl">🚻</span>
               <span className="font-semibold text-sm">Restrooms</span>
             </button>
             <button onClick={() => navigate('/go?category=seating')} className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
               <span className="text-3xl">💺</span>
               <span className="font-semibold text-sm">Seating Areas</span>
             </button>
             <button onClick={() => navigate('/go?category=stage')} className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#334155] transition-colors">
               <span className="text-3xl">🎭</span>
               <span className="font-semibold text-sm">Stage / Main Area</span>
             </button>
           </div>
        </div>
        
        <div className="text-center">
          <button onClick={() => navigate('/attendee')} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            View Venue Map
          </button>
        </div>
      </div>
    </div>
  );
}
