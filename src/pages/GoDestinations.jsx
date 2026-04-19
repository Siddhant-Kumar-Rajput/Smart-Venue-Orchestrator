import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { zoneCategories, walkingMinutes } from '../simulation/mockData';

export default function GoDestinations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'food';
  const { zones, setIntentFlow, setQrFeed, attendees } = useSimulation();

  const currentAttendee = attendees && attendees.length > 0 ? attendees[attendees.length - 1] : { name: "Guest", currentZone: "Gate 1" };
  const currentZone = currentAttendee.currentZone || "Gate 1";
  
  const categoryZonesFlat = zoneCategories[category] || [];
  
  const destinations = categoryZonesFlat.map(name => {
    const zInfo = zones.find(z => z.name === name) || { density: 0, waitTime: 0 };
    const distanceDict = walkingMinutes[currentZone] || {};
    const distance = distanceDict[name] || 5; 
    return { name, density: zInfo.density, waitTime: zInfo.waitTime, distance };
  });

  const getSuggestion = (intendedZoneName) => {
    const intended = destinations.find(d => d.name === intendedZoneName);
    if (!intended || intended.density < 65) return null;

    const alternatives = destinations
      .filter(d => d.name !== intendedZoneName)
      .map(d => ({
        ...d,
        score: (d.density * 0.6) + (d.distance * 0.4)
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    if (alternatives.length === 0) return null;
    if (alternatives[0].density >= intended.density) return null;
    return { intended, alternatives };
  };

  const handleTap = (dest) => {
    setIntentFlow(prev => ({
      ...prev,
      [dest.name]: (prev[dest.name] || 0) + 1
    }));
    
    setQrFeed(prev => [{
      id: crypto.randomUUID(), type: 'intent',
      attendeeName: currentAttendee.name, zone: dest.name,
      timestamp: Date.now()
    }, ...prev].slice(0, 100));
    
    const suggData = getSuggestion(dest.name);
    if (suggData) {
      navigate(`/suggest?data=${encodeURIComponent(JSON.stringify(suggData))}`);
    } else {
      navigate(`/navigate?to=${encodeURIComponent(dest.name)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#F1F5F9]">
      <div className="max-w-md w-full mx-auto p-4 pt-10">
        <button onClick={() => navigate(-1)} className="text-[#94A3B8] hover:text-white mb-6 text-sm flex items-center gap-1">
           &larr; Back
        </button>
        <h1 className="text-3xl font-bold mb-2">Where are you headed?</h1>
        <p className="text-[#94A3B8] mb-6 capitalize">{category} options</p>
        
        <div className="flex flex-col gap-4">
           {destinations.map(d => {
             const status = d.density > 80 ? 'FULL' : d.density > 60 ? 'BUSY' : 'OPEN';
             const statusColor = status === 'FULL' ? 'text-red-400 border-red-400 bg-red-400/10' : status === 'BUSY' ? 'text-amber-400 border-amber-400 bg-amber-400/10' : 'text-green-400 border-green-400 bg-green-400/10';
             const barColor = status === 'FULL' ? 'bg-red-500' : status === 'BUSY' ? 'bg-amber-500' : 'bg-green-500';

             return (
               <button 
                 key={d.name} 
                 onClick={() => handleTap(d)}
                 className="bg-[#1E293B] border border-[#334155] hover:border-blue-500 rounded-xl p-4 text-left transition-all relative overflow-hidden shadow-sm"
               >
                 <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-lg text-white pr-4">{d.name}</h3>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusColor}`}>
                     {status}
                   </span>
                 </div>
                 
                 <div className="flex gap-4 text-sm text-[#94A3B8] mb-4">
                   <span>Wait: ~{Math.round(d.waitTime)}m</span>
                   <span>Walk: ~{d.distance}m</span>
                 </div>
                 
                 <div className="w-full bg-[#0F172A] rounded-full h-2 border border-[#334155]">
                   <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, d.density))}%` }}></div>
                 </div>
                 <div className="text-right text-xs mt-1 text-[#94A3B8]">
                   {Math.round(d.density)}% full
                 </div>
               </button>
             );
           })}
        </div>
      </div>
    </div>
  );
}
