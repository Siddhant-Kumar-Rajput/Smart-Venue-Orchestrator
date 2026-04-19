import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import { densityColor } from '../../utils/density';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const attendeeId = searchParams.get('id');
  const navigate = useNavigate();
  const { state } = useContext(VenueContext);

  const attendee = state.attendees.find(a => a.id === attendeeId) || { name: 'Guest', currentZoneId: 'gate-1' };
  const currentZone = state.zones.find(z => z.id === attendee.currentZoneId) || state.zones[0];
  
  // Calculate stats
  const venueDensity = Math.round((state.venue.currentAttendance / state.venue.totalCapacity) * 100);
  const activeAlerts = state.alerts.filter(a => !a.acknowledged).length;
  
  // Find nearest food Wait
  const foodZones = state.zones.filter(z => z.category === 'food');
  const nearestFoodWait = foodZones.length ? Math.round(Math.min(...foodZones.map(z => z.waitTime))) : 0;

  const getDensityDot = (zoneCategory) => {
    // Just find average or max density of that category for the badge
    const catZones = state.zones.filter(z => z.category === zoneCategory);
    if (!catZones.length) return "bg-safe";
    const avg = catZones.reduce((s, z) => s + z.density, 0) / catZones.length;
    if (avg < 40) return "bg-safe border-safe/50";
    if (avg < 70) return "bg-caution border-caution/50";
    return "bg-critical border-critical/50";
  };

  const navTo = (category) => {
    navigate(`/go?category=${category}&id=${attendeeId}`);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-y-auto w-full">
      <div className="p-6 pb-2 pb-0 flex-none sticky top-0 bg-base/90 backdrop-blur z-10 border-b border-border/50">
        <h2 className="text-accent font-bold tracking-tight mb-6">Smart Venue Orchestrator</h2>
        
        <h1 className="text-3xl font-bold text-primary mb-1">Hey, {attendee.name.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-muted">You're at {currentZone.name} — {currentZone.description || 'Welcome inside'}</p>
        
        <div className="flex gap-2 w-full overflow-x-auto py-5 no-scrollbar">
           <div className="bg-surface border border-border px-4 py-2.5 rounded-xl shrink-0 flex flex-col justify-center">
             <div className="text-[10px] uppercase text-muted font-bold tracking-wider mb-1">Capacity</div>
             <div className="text-lg font-bold flex items-center gap-2">
               <span style={{ color: densityColor(venueDensity) }}>{venueDensity}%</span> full
             </div>
           </div>
           
           <div className="bg-surface border border-border px-4 py-2.5 rounded-xl shrink-0 flex flex-col justify-center">
             <div className="text-[10px] uppercase text-muted font-bold tracking-wider mb-1">Nearest Food</div>
             <div className="text-lg font-bold text-primary">~{nearestFoodWait}m wait</div>
           </div>
           
           <div className={`border px-4 py-2.5 rounded-xl shrink-0 flex flex-col justify-center ${activeAlerts > 0 ? "bg-critical/10 border-critical/30" : "bg-surface border-border"}`}>
             <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${activeAlerts > 0 ? "text-critical" : "text-muted"}`}>Alerts</div>
             <div className={`text-lg font-bold ${activeAlerts > 0 ? "text-critical" : "text-primary"}`}>{activeAlerts} Active</div>
           </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-4 flex flex-col">
        <h3 className="font-bold text-primary text-xl mb-4">Where would you like to go?</h3>
        
        <div className="grid grid-cols-2 gap-4 flex-1 content-start">
           
           <button onClick={() => navTo('food')} className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-elevated transition-colors relative">
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border ${getDensityDot('food')}`}></span>
              <span className="text-4xl drop-shadow-md">🍔</span>
              <span className="font-bold text-primary text-sm">Food & Drinks</span>
           </button>
           
           <button onClick={() => navTo('restroom')} className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-elevated transition-colors relative">
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border ${getDensityDot('restroom')}`}></span>
              <span className="text-4xl drop-shadow-md">🚻</span>
              <span className="font-bold text-primary text-sm">Restrooms</span>
           </button>
           
           <button onClick={() => navTo('seating')} className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-elevated transition-colors relative">
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border ${getDensityDot('seating')}`}></span>
              <span className="text-4xl drop-shadow-md">💺</span>
              <span className="font-bold text-primary text-sm">Your Seat Area</span>
           </button>
           
           <button onClick={() => navTo('stage')} className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-elevated transition-colors relative">
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border ${getDensityDot('stage')}`}></span>
              <span className="text-4xl drop-shadow-md">🎭</span>
              <span className="font-bold text-primary text-sm">Main Stage</span>
           </button>

        </div>
        
        <div className="mt-8 mb-4 text-center">
           <button onClick={() => navigate('/attendee/map')} className="text-accent font-semibold text-sm hover:text-blue-400">
             View Full Venue Map &rarr;
           </button>
        </div>
      </div>
    </div>
  );
}
