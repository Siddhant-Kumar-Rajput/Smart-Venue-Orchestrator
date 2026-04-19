import React from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import HeatmapOverlay from '../components/HeatmapOverlay';
import 'leaflet/dist/leaflet.css';

export default function VenueMap() {
  const bounds = [[0, 0], [600, 800]];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 p-4">
      <h2 className="text-xl font-bold shrink-0">Venue Map</h2>
      
      <div className="flex-1 rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden relative shadow-sm min-h-0">
        <MapContainer 
          crs={L.CRS.Simple} 
          bounds={bounds} 
          minZoom={-1} 
          maxZoom={2} 
          zoom={0}
          center={[300, 400]}
          style={{ height: '100%', width: '100%', background: '#0F172A' }}
        >
          <HeatmapOverlay />
        </MapContainer>
      </div>

      <div className="flex gap-2 justify-between shrink-0">
        <button className="flex-1 bg-[#334155] hover:bg-[#475569] text-white rounded-lg px-2 py-3 md:py-2 text-sm font-medium text-center transition-colors">
          Nearest Exit
        </button>
        <button className="flex-1 bg-[#334155] hover:bg-[#475569] text-white rounded-lg px-2 py-3 md:py-2 text-sm font-medium text-center transition-colors">
          Nearest Food
        </button>
        <button className="flex-1 bg-[#334155] hover:bg-[#475569] text-white rounded-lg px-2 py-3 md:py-2 text-sm font-medium text-center transition-colors">
          Nearest Restroom
        </button>
      </div>
    </div>
  );
}
