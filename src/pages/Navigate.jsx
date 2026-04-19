import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, ImageOverlay, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulation } from '../context/SimulationContext';
import { mockZones, walkingDirections } from '../simulation/mockData';

export default function Navigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('to') || 'Food Court A';
  const { setQrFeed, attendees, setIntentFlow } = useSimulation();

  const currentAttendee = attendees && attendees.length > 0 ? attendees[attendees.length - 1] : { name: "Guest", currentZone: "Gate 1" };
  const currentZoneName = currentAttendee.currentZone || "Gate 1";

  const startZone = mockZones.find(z => z.name === currentZoneName) || mockZones[0];
  const destZone = mockZones.find(z => z.name === destination) || mockZones[1];

  const bounds = [[0, 0], [600, 800]];
  const pathKey = `${currentZoneName}→${destination}`;
  const instructions = walkingDirections[pathKey] || [
    `Follow signs towards ${destination}`,
    "Stay on the main path",
    "Your destination will be visible shortly"
  ];

  const pathCoordinates = [
    [startZone.y + startZone.height / 2, startZone.x + startZone.width / 2],
    [destZone.y + destZone.height / 2, destZone.x + destZone.width / 2]
  ];

  const handleArrive = () => {
    setIntentFlow(prev => ({ ...prev, [destination]: Math.max(0, (prev[destination] || 0) - 1) }));
    setQrFeed(prev => [{
      id: crypto.randomUUID(), type: 'zone_arrival',
      attendeeName: currentAttendee.name, zone: destination,
      timestamp: Date.now()
    }, ...prev].slice(0, 100));
    
    navigate(`/welcome?name=${encodeURIComponent(currentAttendee.name)}&gate=1`);
  };

  const blueDotIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div class='w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse'></div>",
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  const destFlagIcon = L.divIcon({
     className: 'custom-div-icon',
     html: "<div class='text-2xl drop-shadow-md'>🚩</div>",
     iconSize: [24, 24],
     iconAnchor: [12, 24]
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#F1F5F9]">
      <div className="max-w-md w-full mx-auto h-full flex flex-col flex-1 relative bg-[#1E293B]">
        
        <div className="absolute top-4 left-4 z-[1000]">
           <button onClick={() => navigate(-1)} className="bg-[#0F172A] text-white px-3 py-2 rounded-lg text-sm shadow-md border border-[#334155] flex items-center gap-1">
             &larr; Back
           </button>
        </div>

        <div className="h-64 sm:h-80 w-full relative">
          <MapContainer 
            bounds={bounds} 
            crs={L.CRS.Simple} 
            className="h-full w-full bg-[#0F172A]"
            zoomControl={false}
            attributionControl={false}
          >
            <ImageOverlay url="/map-bg.svg" bounds={bounds} />
            <Polyline positions={pathCoordinates} color="#3B82F6" weight={4} dashArray="5, 10" className="animate-[dash_1s_linear_infinite]" />
            <Marker position={pathCoordinates[0]} icon={blueDotIcon} />
            <Marker position={pathCoordinates[1]} icon={destFlagIcon} />
          </MapContainer>
        </div>

        <div className="flex-1 bg-[#0F172A] p-6 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.5)] -mt-4 relative z-10 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Heading to {destination}</h2>
          <p className="text-[#94A3B8] text-sm mb-6">Estimated walk: ~{Math.round(pathCoordinates.length * 1.5)} minutes</p>

          <div className="flex-1 mb-6 relative">
             <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-[#334155]"></div>
             <div className="flex flex-col gap-5 relative">
               {instructions.map((step, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-blue-600 border-4 border-[#0F172A] text-[10px] flex items-center justify-center font-bold relative z-10">
                     {idx + 1}
                   </div>
                   <div className={`mt-0.5 ${idx === instructions.length -1 ? 'text-white font-medium' : 'text-[#94A3B8]'} text-sm`}>
                     {step}
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-xl mb-6 shadow-sm">
             <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-1">Destination Live Status</div>
             <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{destination}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">BUSY</span>
             </div>
          </div>

          <button 
            onClick={handleArrive}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-green-600/20 transition-all border border-green-500/50"
          >
            I've Arrived ✓
          </button>
        </div>
        
      </div>
    </div>
  );
}
