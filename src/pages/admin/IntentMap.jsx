import React, { useContext, useState } from 'react';
import { VenueContext } from '../../context/VenueContext';
import { MapContainer, ImageOverlay, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import IntentArrow from '../../components/admin/IntentArrow';
import { densityColor } from '../../utils/density';

export default function IntentMap() {
  const { state } = useContext(VenueContext);
  const [viewMode, setViewMode] = useState('both'); // 'occupancy', 'intent', 'both'
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const bounds = [[0, 0], [600, 800]];
  const mapCenter = [300, 400]; // Y, X 

  const sortedZones = state.zones.map(z => {
    const headingHere = state.intentFlow[z.id] || 0;
    // Map bounds approximation for arrow centroid relative to map bg size
    const cY = (z.lat - 51.5) * 50000 % 600 + 100;
    const cX = (z.lng + 0.1) * 30000 % 800 + 100;
    
    // Scale intent vs capacity as a mock percentage load.
    // 1 intent = 1% for ease of demo
    const pressure = Math.min(100, z.density + headingHere);
    return { ...z, headingHere, centroid: [cY, cX], pressure };
  }).sort((a, b) => b.pressure - a.pressure);

  const selectedZone = sortedZones.find(z => z.id === selectedZoneId);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Map Section */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-lg min-h-[50vh]">
        <div className="p-4 border-b border-border bg-base flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
           <div>
             <h3 className="font-bold text-primary">Predictive Pathing</h3>
             <p className="text-xs text-muted">Dual-layer map highlighting congestion</p>
           </div>
           <div className="flex bg-elevated rounded-lg p-1 border border-border shrink-0">
              <button 
                onClick={() => setViewMode('occupancy')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${viewMode === 'occupancy' ? 'bg-accent text-white' : 'text-muted hover:text-primary'}`}
              >
                Occupancy Only
              </button>
              <button 
                onClick={() => setViewMode('intent')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${viewMode === 'intent' ? 'bg-accent text-white' : 'text-muted hover:text-primary'}`}
              >
                Intent Flow
              </button>
              <button 
                onClick={() => setViewMode('both')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${viewMode === 'both' ? 'bg-accent text-white' : 'text-muted hover:text-primary'}`}
              >
                Both ✓
              </button>
           </div>
        </div>

        <div className="flex-1 relative z-0">
          <MapContainer 
            bounds={bounds} 
            crs={L.CRS.Simple} 
            className="h-full w-full bg-[#0B1121]"
            zoomControl={false}
            attributionControl={false}
            dragging={true}
          >
            <ImageOverlay url="/map-bg.svg" bounds={bounds} />
            
            {sortedZones.map(zone => {
               const sizeY = 80; const sizeX = 120;
               const rectBounds = [
                  [zone.centroid[0] - sizeY/2, zone.centroid[1] - sizeX/2],
                  [zone.centroid[0] + sizeY/2, zone.centroid[1] + sizeX/2]
               ];

               return (
                 <React.Fragment key={zone.id}>
                   {/* Layer 1: Occupancy Fill */}
                   {(viewMode === 'both' || viewMode === 'occupancy') && (
                     <Polygon 
                       positions={rectBounds} 
                       pathOptions={{ 
                         color: densityColor(zone.density), 
                         fillColor: densityColor(zone.density), 
                         fillOpacity: Math.max(0.2, zone.density / 100),
                         weight: selectedZoneId === zone.id ? 3 : 1
                       }}
                       eventHandlers={{ click: () => setSelectedZoneId(zone.id) }}
                     />
                   )}

                   {/* Layer 2: Intent Arrows */}
                   {(viewMode === 'both' || viewMode === 'intent') && (
                     <IntentArrow 
                       startPoint={mapCenter}
                       endPoint={zone.centroid}
                       count={zone.headingHere}
                       destDensity={zone.density}
                       onClick={() => setSelectedZoneId(zone.id)}
                     />
                   )}
                 </React.Fragment>
               );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Side Panel: Intent Breakdown Data */}
      <div className="w-full lg:w-1/3 bg-surface border border-border rounded-xl flex flex-col shadow-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-base flex flex-col gap-1 z-10 relative">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-primary text-lg">Intent Breakdown</h3>
            <span className="text-[10px] text-safe border border-safe/30 bg-safe/10 px-2 py-0.5 rounded font-bold animate-pulse">
              LIVE
            </span>
          </div>
        </div>

        {selectedZone && (
          <div className="p-5 border-b border-border bg-elevated/20 transition-all shrink-0">
             <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-primary text-xl">{selectedZone.name}</h4>
                <button onClick={() => setSelectedZoneId(null)} className="text-muted hover:text-primary">&times;</button>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <div className="text-xs text-muted uppercase font-bold mb-1">Here Now</div>
                  <div className="text-2xl font-bold flex items-end gap-1">
                    <span style={{ color: densityColor(selectedZone.density) }}>{Math.round(selectedZone.density)}%</span>
                  </div>
               </div>
               <div>
                  <div className="text-xs text-muted uppercase font-bold mb-1">Heading Here</div>
                  <div className="text-2xl font-bold text-caution">
                    +{selectedZone.headingHere} <span className="text-sm">pax</span>
                  </div>
               </div>
             </div>

             <div className="w-full bg-base border border-border rounded-full h-2 mb-2 overflow-hidden flex">
                <div className="h-full" style={{ width: `${selectedZone.density}%`, backgroundColor: densityColor(selectedZone.density) }}></div>
                <div className="h-full bg-caution animate-pulse" style={{ width: `${Math.min(100 - selectedZone.density, selectedZone.headingHere)}%` }}></div>
             </div>
             
             <div className="text-xs flex justify-between font-medium">
               <span className="text-muted">Combined Pressure: {Math.round(selectedZone.pressure)}%</span>
               {selectedZone.pressure > 85 ? (
                 <span className="text-critical animate-pulse font-bold">⚠️ Rerouting recommended</span>
               ) : (
                 <span className="text-safe">✅ Within safe range</span>
               )}
             </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-[#0B1121] text-muted sticky top-0 z-10">
               <tr>
                 <th className="p-3 font-semibold text-xs border-b border-border">Zone</th>
                 <th className="p-3 font-semibold text-xs border-b border-border text-center">Pressure</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border hover:divide-transparent">
               {sortedZones.map((z) => {
                 const isCrit = z.pressure > 80;
                 return (
                   <tr key={z.id} onClick={() => setSelectedZoneId(z.id)} className={`hover:bg-elevated cursor-pointer transition-colors ${selectedZoneId === z.id ? 'bg-elevated/50' : ''} ${isCrit ? 'bg-critical/5' : ''}`}>
                     <td className="p-3">
                        <div className="font-semibold text-primary">{z.name}</div>
                        <div className="text-[10px] text-muted mt-0.5">{Math.round(z.density)}% here • <span className="text-caution">+{z.headingHere} heading</span></div>
                     </td>
                     <td className="p-3 text-center align-middle">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold leading-none ${isCrit ? 'bg-critical/20 text-critical border border-critical/30' : z.pressure > 50 ? 'bg-caution/20 text-caution border border-caution/30' : 'bg-safe/10 text-safe border border-safe/20'}`}>
                          {Math.round(z.pressure)}%
                        </span>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
