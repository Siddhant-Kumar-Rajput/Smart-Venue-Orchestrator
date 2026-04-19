import React from 'react';
import { Polygon, Popup } from 'react-leaflet';
import { useSimulation } from '../context/SimulationContext';

export default function HeatmapOverlay() {
  const { zones } = useSimulation();

  const getColor = (density) => {
    if (density > 70) return '#EF4444'; // Red
    if (density >= 40) return '#F59E0B'; // Amber
    return '#22C55E'; // Green
  };

  return (
    <>
      {zones.map(zone => {
        // Simple CRS mapping coords: [y, x]
        const bounds = [
          [zone.y, zone.x],
          [zone.y, zone.x + zone.width],
          [zone.y + zone.height, zone.x + zone.width],
          [zone.y + zone.height, zone.x]
        ];

        return (
          <Polygon 
            key={zone.id} 
            positions={bounds} 
            pathOptions={{ 
              fillColor: getColor(zone.density), 
              fillOpacity: 0.5, 
              color: '#334155', 
              weight: 2 
            }}
          >
            <Popup>
              <div className="text-gray-800 font-sans p-1">
                <h4 className="font-bold text-sm mb-1">{zone.name}</h4>
                <div className="flex flex-col gap-0.5 text-xs">
                  <span>Density: {Math.round(zone.density)}%</span>
                  <span>Est. Wait: {Math.round(zone.waitTime)} mins</span>
                  <span>Staff: {zone.staffCount}</span>
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
}
