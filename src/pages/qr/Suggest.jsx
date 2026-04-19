import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import SuggestionCard from '../../components/attendee/SuggestionCard';
import { getSuggestion } from '../../utils/suggestions';

export default function Suggest() {
  const [searchParams] = useSearchParams();
  const intendedId = searchParams.get('intended');
  const attendeeId = searchParams.get('id');
  const navigate = useNavigate();
  const { state, dispatch } = useContext(VenueContext);

  const attendee = state.attendees.find(a => a.id === attendeeId) || { id: 'guest', currentZoneId: 'gate-1', name: 'Guest' };
  const intended = state.zones.find(z => z.id === intendedId);
  
  if (!intended) return navigate(-1); // Safety

  const suggestions = getSuggestion(intended.id, attendee.currentZoneId, intended.category, state.zones, state.intentFlow);
  
  if (!suggestions || suggestions.length === 0) {
    // If suggestion bounds changed just go
    navigate(`/navigate?destination=${intended.id}&id=${attendeeId}`);
    return null;
  }

  const handleTakeMeThere = (alt) => {
    dispatch({ type: 'ATTENDEE_SET_INTENT', payload: { id: attendee.id, zoneId: alt.id } });
    dispatch({ type: 'ZONE_SET_INTENT', payload: { zoneId: alt.id, delta: 1 } });
    dispatch({ type: 'ZONE_SET_INTENT', payload: { zoneId: intended.id, delta: -1 } });
    
    dispatch({ type: 'QR_EVENT_ADD', payload: {
      id: crypto.randomUUID(), eventType: 'intent', attendeeName: attendee.name,
      zoneId: alt.id, zoneName: `${intended.name}→${alt.name}`, timestamp: Date.now()
    }});

    navigate(`/navigate?destination=${alt.id}&id=${attendeeId}`, { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-base overflow-y-auto p-6">
      <div className="flex items-center gap-4 mb-6">
         <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold">
           &larr;
         </button>
      </div>

      <div className="bg-caution/10 border border-caution mb-8 px-5 py-6 rounded-2xl text-center shadow-lg">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-caution mb-2">{intended.name} is currently {Math.round(intended.density)}% full</h2>
        <p className="text-caution/80">Expected wait: ~{Math.round(intended.waitTime)} minutes</p>
      </div>

      <h3 className="text-muted font-medium mb-4 text-center">There's a better option nearby</h3>

      <div className="flex flex-col gap-4">
        {suggestions.map(alt => (
          <SuggestionCard key={alt.id} alt={alt} onSelect={handleTakeMeThere} />
        ))}
      </div>

      <div className="mt-8 text-center pb-8">
        <button 
          onClick={() => navigate(`/navigate?destination=${intended.id}&id=${attendeeId}`, { replace: true })}
          className="text-muted hover:text-primary text-sm font-medium transition-colors border-b border-transparent hover:border-border pb-0.5"
        >
          Go to {intended.name} anyway &rarr;
        </button>
      </div>
    </div>
  );
}
