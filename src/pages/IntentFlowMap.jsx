import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulation } from '../context/SimulationContext';

export default function IntentFlowMap() {
  const { zones, intentFlow } = useSimulation();
  const [viewMode, setViewMode] = useState('both'); // 'occupancy', 'intent', 'both'
  const [selectedZone, setSelectedZone] = useState(null);

  const bounds = [[0, 0], [600, 800]];
  const mapCenter = [300, 400]; // Center point [y, x]

  const sortedZones = [...zones].map(z => ({
    ...z,
    headingHere: intentFlow[z.name] || 0,
    totalExpected: z.density + (intentFlow[z.name] || 0)
  })).sort((a, b) => b.totalExpected - a.totalExpected);

  const getStyle = (density) => {
    if (density > 80) return { color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.7 };
    if (density > 60) return { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.7 };
    return { color: '#22C55E', fillColor: '#22C55E', fillOpacity: 0.7 };
  };

  const getArrowStyle = (count, destinationDensity) => {
    let weight = 2;
    let dashArray = '5, 10';
    if (count > 5 && count <= 15) {
      weight = 4;
      dashArray = null; // Solid
    } else if (count > 15) {
      weight = 6;
      dashArray = null;
    }
    
    let color = '#22C55E';
    if (destinationDensity > 80) color = '#EF4444';
    else if (destinationDensity > 60) color = '#F59E0B';

    return { color, weight, dashArray };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Map Section */}
      <div className="w-full lg:w-2/3 flex flex-col h-[65vh] lg:h-full bg-[#1E293B] rounded-xl border border-[#334155] overflow-hidden">
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0F172A]">
          <h2 className="font-bold text-white">Intent Flow Map</h2>
          
          <div className="flex bg-[#1E293B] rounded-lg p-1 border border-[#334155]">
            <button 
              onClick={() => setViewMode('occupancy')}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'occupancy' ? 'bg-blue-600 text-white' : 'text-[#94A3B8] hover:text-white'}`}
            >
              Occupancy Only
            </button>
            <button 
              onClick={() => setViewMode('intent')}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'intent' ? 'bg-blue-600 text-white' : 'text-[#94A3B8] hover:text-white'}`}
            >
              Intent Flow
            </button>
            <button 
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'both' ? 'bg-blue-600 text-white' : 'text-[#94A3B8] hover:text-white'}`}
            >
              Both (Default)
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <MapContainer 
            bounds={bounds} 
            crs={L.CRS.Simple} 
            className="h-full w-full bg-[#0F172A]"
            zoomControl={false}
            attributionControl={false}
          >
            <ImageOverlay url="/map-bg.svg" bounds={bounds} />
            
            {zones.map(zone => {
              const rectBounds = [
                [zone.y, zone.x],
                [zone.y + zone.height, zone.x + zone.width]
              ];
              const intentCount = intentFlow[zone.name] || 0;
              const centroid = [zone.y + zone.height / 2, zone.x + zone.width / 2];

              return (
                <React.Fragment key={zone.id}>
                  {/* Layer 1: Occupancy Fill */}
                  {(viewMode === 'both' || viewMode === 'occupancy') && (
                    <Polygon 
                      positions={rectBounds} 
                      pathOptions={getStyle(zone.density)}
                      eventHandlers={{ click: () => setSelectedZone(zone.name) }}
                    >
                      <Tooltip sticky direction="top" className="bg-[#1E293B] text-white border-0 shadow-lg">
                        <div className="font-bold">{zone.name}</div>
                        <div className="text-sm">{Math.round(zone.density)}% Occupied</div>
                      </Tooltip>
                    </Polygon>
                  )}

                  {/* Layer 2: Intent Arrows */}
                  {(viewMode === 'both' || viewMode === 'intent') && intentCount > 0 && (
                    <Polyline 
                      positions={[mapCenter, centroid]}
                      pathOptions={getArrowStyle(intentCount, zone.density)}
                      className="animate-[dash_1s_linear_infinite]"
                      eventHandlers={{ click: () => setSelectedZone(zone.name) }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Side Panel: Intent Breakdown Data */}
      <div className="w-full lg:w-1/3 flex flex-col bg-[#1E293B] rounded-xl border border-[#334155] overflow-hidden">
        <div className="p-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <h2 className="font-bold text-white">Intent Breakdown</h2>
          <span className="text-[10px] text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded animate-pulse">
            Live — updates every 4s
          </span>
        </div>
        
        {/* Selected Zone Focus Details */}
        {selectedZone && (() => {
          const z = sortedZones.find(z => z.name === selectedZone);
          if (!z) return null;
          return (
            <div className="p-4 border-b border-[#334155] bg-[#334155]/20">
              <h3 className="font-bold text-white text-lg">{z.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <div className="text-xs text-[#94A3B8] uppercase">Currently Here</div>
                  <div className="font-bold text-white text-xl">{Math.round(z.density)}%</div>
                </div>
                <div>
                  <div className="text-xs text-[#94A3B8] uppercase">Heading Here</div>
                  <div className="font-bold text-amber-400 text-xl">+{z.headingHere} pax</div>
                </div>
              </div>
              {z.totalExpected > 80 && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded p-2 text-xs text-red-200">
                  <span className="font-bold text-red-400">Suggestion:</span> Consider redirecting arrivals to alternative areas to prevent crowding.
                </div>
              )}
            </div>
          );
        })()}

        <div className="flex-1 overflow-y-auto w-full">
           <table className="w-full text-left text-sm">
             <thead className="bg-[#0F172A] text-[#94A3B8] sticky top-0">
               <tr>
                 <th className="p-3 font-semibold text-xs">Zone</th>
                 <th className="p-3 font-semibold text-xs">Here</th>
                 <th className="p-3 font-semibold text-xs">Heading</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#334155]">
               {sortedZones.map((z) => {
                 const isCrit = z.totalExpected > 80;
                 return (
                   <tr key={z.id} onClick={() => setSelectedZone(z.name)} className={`hover:bg-[#334155] cursor-pointer transition-colors ${isCrit ? 'bg-red-500/5' : ''}`}>
                     <td className="p-3 text-white">
                        {z.name}
                        {isCrit && <div className="text-[10px] text-red-400 font-bold">EXPECTED CRITICAL</div>}
                     </td>
                     <td className="p-3">
                        <span className={z.density > 80 ? 'text-red-400 font-bold' : z.density > 60 ? 'text-amber-400' : 'text-green-400'}>
                          {Math.round(z.density)}%
                        </span>
                     </td>
                     <td className="p-3">
                        {z.headingHere > 0 ? (
                           <span className="text-amber-400 font-bold flex items-center gap-1">
                             <span className="text-[10px]">↑</span> {z.headingHere}
                           </span>
                        ) : (
                          <span className="text-[#94A3B8]">-</span>
                        )}
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
