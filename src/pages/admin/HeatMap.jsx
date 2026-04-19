import React, { useContext, useState } from 'react';
import { VenueContext } from '../../context/VenueContext';
import { MapContainer, ImageOverlay, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { densityColor } from '../../utils/density';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export default function HeatMap() {
  const { state, dispatch } = useContext(VenueContext);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const bounds = [[0, 0], [600, 800]];
  const selectedZone = state.zones.find(z => z.id === selectedZoneId);

  return (
    <div className="flex h-full gap-6">
      <div className={`flex-1 bg-surface border border-border rounded-xl overflow-hidden shadow-lg transition-all ${selectedZone ? 'w-2/3 hidden md:flex' : 'w-full'}`}>
        <MapContainer 
          bounds={bounds} 
          crs={L.CRS.Simple} 
          className="h-full w-full bg-base"
          zoomControl={false}
          attributionControl={false}
        >
          <ImageOverlay url="/map-bg.svg" bounds={bounds} />
          
          {state.zones.map(zone => {
             const cY = (zone.lat - 51.5) * 50000 % 600 + 100;
             const cX = (zone.lng + 0.1) * 30000 % 800 + 100;
             const sizeY = 80;
             const sizeX = 120;
             const rectBounds = [
                [cY - sizeY/2, cX - sizeX/2],
                [cY + sizeY/2, cX + sizeX/2]
             ];
             const fillColor = densityColor(zone.density);
             const isSelected = selectedZoneId === zone.id;

             // Map center logic and Polygon overlay rendering.
             return (
               <Polygon 
                 key={zone.id}
                 positions={rectBounds} 
                 pathOptions={{ 
                   color: isSelected ? '#FFFFFF' : fillColor, 
                   weight: isSelected ? 3 : 1,
                   fillColor: fillColor, 
                   fillOpacity: Math.max(0.3, zone.density / 100) 
                 }}
                 eventHandlers={{ click: () => setSelectedZoneId(zone.id) }}
               />
             );
          })}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-surface/90 backdrop-blur border border-border p-3 rounded-xl flex gap-4 text-xs font-medium shadow-xl">
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-safe opacity-60"></span> 0-39%</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-caution opacity-60"></span> 40-69%</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-critical opacity-60"></span> 70-100%</div>
        </div>
      </div>

      {selectedZone && (
        <div className="w-full md:w-1/3 min-w-[300px] bg-surface border border-border rounded-xl shadow-lg flex flex-col animate-in slide-in-from-right-4 duration-300">
           <div className="p-4 border-b border-border bg-base flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary">{selectedZone.name}</h3>
              <button onClick={() => setSelectedZoneId(null)} className="w-8 h-8 rounded-full bg-elevated hover:bg-border flex items-center justify-center text-muted hover:text-primary transition-colors">&times;</button>
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-base border border-border p-3 rounded-xl">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Density</div>
                    <div className="text-3xl font-bold flex items-end gap-2" style={{ color: densityColor(selectedZone.density) }}>
                      {Math.round(selectedZone.density)}%
                      <span className="text-sm pb-1">{selectedZone.trend === 'rising' ? '↑' : selectedZone.trend === 'falling' ? '↓' : '−'}</span>
                    </div>
                 </div>
                 <div className="bg-base border border-border p-3 rounded-xl">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Wait Time</div>
                    <div className="text-3xl font-bold text-primary">~{Math.round(selectedZone.waitTime)}m</div>
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <div className="flex justify-between text-sm text-primary p-2 bg-elevated rounded">
                    <span className="text-muted">Staff assigned</span>
                    <span className="font-bold">{state.staff.filter(s => s.zoneId === selectedZone.id).length}</span>
                 </div>
                 <div className="flex justify-between text-sm text-primary p-2 bg-elevated rounded">
                    <span className="text-muted">Active incidents</span>
                    <span className="font-bold text-critical">{state.incidents.filter(i => i.zoneId === selectedZone.id && i.status === 'open').length}</span>
                 </div>
                 <div className="flex justify-between text-sm text-primary p-2 bg-elevated rounded">
                    <span className="text-muted">Intent Flow</span>
                    <span className="font-bold text-caution">{state.intentFlow[selectedZone.id] || 0} heading here</span>
                 </div>
              </div>

              <div className="bg-base border border-border p-3 rounded-xl">
                <div className="text-[10px] text-muted uppercase font-bold mb-3">Density Trend (Mock Data)</div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v: selectedZone.density - 10}, {v: selectedZone.density - 5}, {v: selectedZone.density}]}>
                      <Line type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button className="w-full bg-accent hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold shadow-md mt-auto">
                Dispatch Staff Here
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
