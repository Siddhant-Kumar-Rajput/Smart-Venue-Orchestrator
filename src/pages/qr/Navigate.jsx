import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import { MapContainer, ImageOverlay, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WalkingStep from '../../components/attendee/WalkingStep';
import ZoneBadge from '../../components/shared/ZoneBadge';
import { getDirections } from '../../utils/directions';

export default function Navigate() {
  const [searchParams] = useSearchParams();
  const destId = searchParams.get('destination');
  const attendeeId = searchParams.get('id');
  const navigate = useNavigate();
  const { state, dispatch } = useContext(VenueContext);

  const attendee = state.attendees.find(a => a.id === attendeeId) || { id: 'guest', currentZoneId: 'gate-1', name: 'Guest' };
  const dest = state.zones.find(z => z.id === destId);
  const current = state.zones.find(z => z.id === attendee.currentZoneId) || state.zones[0];
  
  if (!dest) return null;

  const bounds = [[0, 0], [600, 800]];
  const pathCoords = [
    [current.lat || 300, current.lng || 400], // fallback if missing, though we won't use lat/lng since map uses simple bounds. Wait Context has lat/lng but ImageOverlay goes with bounds... Let's just create coords mathematically for map center if missing...
    // The prompt says "Map is for orientation only". We can calculate Y X from standard. Since the venue map background maps to bounds 600, 800 roughly let's just make arbitrary points for effect based on lat/lng index differences.
    [(current.lat - 51.5) * 50000 % 600 + 100, (current.lng + 0.1) * 30000 % 800 + 100],
    [(dest.lat - 51.5) * 50000 % 600 + 100, (dest.lng + 0.1) * 30000 % 800 + 100],
  ];

  const directions = getDirections(current.id, dest.id);

  const blueDotIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div class='w-4 h-4 bg-accent rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse'></div>",
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  const destFlagIcon = L.divIcon({
     className: 'custom-div-icon',
     html: "<div class='text-3xl drop-shadow-lg -ml-1.5 -mt-3'>🚩</div>",
     iconSize: [30, 30],
     iconAnchor: [15, 30]
  });

  const handleArrive = () => {
    dispatch({ type: 'ATTENDEE_UPDATE_ZONE', payload: { id: attendee.id, zoneId: dest.id } });
    dispatch({ type: 'ZONE_SET_INTENT', payload: { zoneId: dest.id, delta: -1 } });
    dispatch({ type: 'QR_EVENT_ADD', payload: {
      id: crypto.randomUUID(), eventType: 'zone_arrival', attendeeName: attendee.name,
      zoneId: dest.id, zoneName: dest.name, timestamp: Date.now()
    }});
    navigate(`/welcome?id=${attendeeId}`, { replace: true });
  };

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden relative">
      
      {/* Mini Map (top 45%) */}
      <div className="h-[45vh] w-[400px] shrink-0 relative bg-surface">
        <MapContainer 
          bounds={bounds} 
          crs={L.CRS.Simple} 
          className="h-full w-full bg-base"
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
        >
          <ImageOverlay url="/map-bg.svg" bounds={bounds} />
          <Polyline positions={pathCoords} color="#3B82F6" weight={5} dashArray="8, 12" className="animate-[dash_1s_linear_infinite]" />
          <Marker position={pathCoords[0]} icon={blueDotIcon} />
          <Marker position={pathCoords[1]} icon={destFlagIcon} />
        </MapContainer>
      </div>

      {/* Directions (bottom 55%) */}
      <div className="flex-1 bg-surface p-6 pb-8 shadow-[0_-15px_20px_rgba(0,0,0,0.5)] z-20 flex flex-col relative rounded-t-3xl border-t border-border mt-[-20px] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h2 className="text-2xl font-bold text-primary leading-tight">{dest.name}</h2>
          <ZoneBadge density={dest.density} />
        </div>
        
        <div className="flex items-center gap-2 text-primary font-semibold bg-elevated px-3 py-2 rounded-lg mb-6 w-max border border-border">
          <span className="text-lg">⏳</span>
          ~{Math.round(dest.waitTime)} min wait
        </div>

        <div className="flex-1 mb-6 relative">
           <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-border"></div>
           <div className="flex flex-col gap-6 relative">
             {directions.steps.map((step, idx) => (
               <WalkingStep key={idx} step={step} index={idx} isLast={idx === directions.steps.length - 1} />
             ))}
           </div>
        </div>

        <p className="text-muted text-sm mb-4 text-center">~{directions.walkingMins} minute walk</p>

        <button 
          onClick={handleArrive}
          className="w-full bg-safe hover:bg-green-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-safe/20 transition-all border border-safe/50 mb-4"
        >
          I've Arrived ✓
        </button>
        
        <div className="text-center">
           <button onClick={() => navigate(`/go?category=${dest.category}&id=${attendeeId}`, { replace: true })} className="text-muted hover:text-primary text-xs font-medium">
             Change destination
           </button>
        </div>
      </div>
    </div>
  );
}
