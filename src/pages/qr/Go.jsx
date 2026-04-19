import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import DestinationTile from '../../components/attendee/DestinationTile';
import { getSuggestion } from '../../utils/suggestions';
import { getDirections } from '../../utils/directions';

export default function Go() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const attendeeId = searchParams.get('id');
  const navigate = useNavigate();
  const { state, dispatch } = useContext(VenueContext);

  const attendee = state.attendees.find(a => a.id === attendeeId) || { id: 'guest', currentZoneId: 'gate-1' };
  const currentZoneId = attendee.currentZoneId;

  const categoryHeadings = {
    food: "Food & Drinks",
    restroom: "Restrooms",
    seating: "Your Seat Area",
    stage: "Main Stage"
  };

  const zones = state.zones.filter(z => z.category === category);
  
  // Sort: OPEN (<40) first, BUSY (<70) next, FULL (>=70) last
  zones.sort((a, b) => {
    const scoreA = a.density < 40 ? 1 : a.density < 70 ? 2 : 3;
    const scoreB = b.density < 40 ? 1 : b.density < 70 ? 2 : 3;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.density - b.density;
  });

  const handleSelect = (zone) => {
    // Dispatch intent to metrics
    dispatch({ type: 'ATTENDEE_SET_INTENT', payload: { id: attendee.id, zoneId: zone.id } });
    dispatch({ type: 'ZONE_SET_INTENT', payload: { zoneId: zone.id, delta: 1 } });
    dispatch({ type: 'QR_EVENT_ADD', payload: {
      id: crypto.randomUUID(), eventType: 'intent', attendeeName: attendee.name || 'Guest',
      zoneId: zone.id, zoneName: zone.name, timestamp: Date.now()
    }});

    const suggestions = getSuggestion(zone.id, currentZoneId, category, state.zones, state.intentFlow);
    
    if (suggestions && suggestions.length > 0) {
      navigate(`/suggest?intended=${zone.id}&alt=${suggestions[0].id}&id=${attendee.id}`, { replace: true });
    } else {
      navigate(`/navigate?destination=${zone.id}&id=${attendee.id}`, { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-y-auto w-full p-6 bg-base">
      <div className="flex items-center gap-4 mb-8">
         <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold">
           &larr;
         </button>
         <div>
            <h1 className="text-2xl font-bold text-primary">{categoryHeadings[category] || 'Destinations'}</h1>
            <p className="text-muted text-sm">Tap where you want to go</p>
         </div>
      </div>

      <div className="flex flex-col gap-4 pb-20">
         {zones.map(zone => {
           const walkInfo = getDirections(currentZoneId, zone.id);
           return (
             <DestinationTile 
               key={zone.id} 
               zone={zone}
               walkTime={walkInfo.walkingMins}
               onClick={() => handleSelect(zone)}
             />
           );
         })}
      </div>
    </div>
  );
}
