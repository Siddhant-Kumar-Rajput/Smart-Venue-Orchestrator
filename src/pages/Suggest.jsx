import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';

export default function Suggest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIntentFlow, setQrFeed, attendees } = useSimulation();
  
  const currentAttendee = attendees && attendees.length > 0 ? attendees[attendees.length - 1] : { name: "Guest" };

  const dataStr = searchParams.get('data');
  if (!dataStr) return navigate('/go');
  
  const suggData = JSON.parse(decodeURIComponent(dataStr));
  const intended = suggData.intended;
  const alternatives = suggData.alternatives;

  const handleTakeMeThere = (alt) => {
    // Record redirected intent
    setIntentFlow(prev => ({
      ...prev,
      [alt.name]: (prev[alt.name] || 0) + 1,
      [intended.name]: Math.max(0, (prev[intended.name] || 0) - 1)
    }));
    
    setQrFeed(prev => [{
      id: crypto.randomUUID(), type: 'intent',
      attendeeName: currentAttendee.name, zone: `${intended.name} → ${alt.name}`,
      timestamp: Date.now()
    }, ...prev].slice(0, 100));

    navigate(`/navigate?to=${encodeURIComponent(alt.name)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#F1F5F9] pb-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-amber-900/30 border-b border-amber-500/30 px-6 py-10 pt-16 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-amber-50">{intended.name} is currently at {Math.round(intended.density)}% capacity</h2>
          <p className="text-amber-200 mt-2">Expected wait: ~{Math.round(intended.waitTime)} minutes</p>
        </div>

        <div className="p-6">
          <h3 className="text-[#94A3B8] font-medium mb-4 text-center">We found better options for you —</h3>

          <div className="flex flex-col gap-4">
             {alternatives.map(alt => {
                const totalTimeIntended = intended.waitTime + intended.distance;
                const totalTimeAlt = alt.waitTime + alt.distance;
                const savedMins = Math.max(0, Math.round(totalTimeIntended - totalTimeAlt));

                const statusColor = alt.density > 80 ? 'text-red-400 bg-red-400/10 border-red-400' : alt.density > 60 ? 'text-amber-400 bg-amber-400/10 border-amber-400' : 'text-green-400 bg-green-400/10 border-green-400';
                
                return (
                  <div key={alt.name} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white">{alt.name}</h4>
                      {savedMins > 0 && (
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                          Save ~{savedMins} mins
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 text-sm text-[#94A3B8] mb-4">
                      <span>Wait: ~{Math.round(alt.waitTime)}m</span>
                      <span>Walk: ~{alt.distance}m</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusColor}`}>
                       {Math.round(alt.density)}% FULL
                       </span>
                    </div>

                    <button 
                      onClick={() => handleTakeMeThere(alt)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold shadow-md transition-colors"
                    >
                      Take me there &rarr;
                    </button>
                  </div>
                );
             })}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate(`/navigate?to=${encodeURIComponent(intended.name)}`)}
              className="text-[#94A3B8] hover:text-white text-sm transition-colors border-b border-transparent hover:border-white pb-0.5"
            >
              Go to {intended.name} anyway &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
