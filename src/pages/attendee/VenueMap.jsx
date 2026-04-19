import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';
import { MapContainer, ImageOverlay, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { densityColor } from '../../utils/density';

export default function VenueMap() {
  const { state } = useContext(VenueContext);
  const bounds = [[0, 0], [600, 800]];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="p-4 pb-2 bg-base border-b border-border shadow-sm z-10 flex-none">
        <h2 className="text-xl font-bold text-primary">Venue Map</h2>
        <p className="text-xs text-muted">Tap a zone to see details</p>
      </div>

      <div className="flex-1 w-full bg-surface relative z-0">
         <MapContainer 
           bounds={bounds} 
           crs={L.CRS.Simple} 
           className="h-full w-full bg-base"
           zoomControl={false}
           attributionControl={false}
         >
           <ImageOverlay url="/map-bg.svg" bounds={bounds} />
           
           {state.zones.map(zone => {
             // Let's create an arbitrary rect from lat lng if available for visualization since the V1 map had hardcoded rects structure that we changed into lat lng
             // We map 51.5 / -0.09 coordinates to some arbitrary width/height.
             // We don't have explicit w/h in state.zones for polygons. Let's do a 80x80 box around the LatLng center.
             const cY = (zone.lat - 51.5) * 50000 % 600 + 100;
             const cX = (zone.lng + 0.1) * 30000 % 800 + 100;
             const sizeY = 80;
             const sizeX = 120;
             const rectBounds = [
                [cY - sizeY/2, cX - sizeX/2],
                [cY + sizeY/2, cX + sizeX/2]
             ];
             const fillColor = densityColor(zone.density);

             return (
               <Polygon 
                 key={zone.id}
                 positions={rectBounds} 
                 pathOptions={{ color: fillColor, fillColor: fillColor, fillOpacity: Math.max(0.3, zone.density / 100) }}
               >
                 <Tooltip sticky direction="top" className="bg-surface text-primary border-border shadow-lg">
                   <div className="font-bold">{zone.name}</div>
                   <div className="text-sm">{Math.round(zone.density)}% Occupied</div>
                   <div className="text-xs text-muted">~{Math.round(zone.waitTime)}m wait</div>
                 </Tooltip>
               </Polygon>
             );
           })}
         </MapContainer>
      </div>

      <div className="flex gap-2 justify-center py-3 bg-base border-t border-border flex-none z-10">
         <div className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-3 rounded-sm bg-safe"></span> Open</div>
         <div className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-3 rounded-sm bg-caution"></span> Busy</div>
         <div className="flex items-center gap-1.5 text-xs text-muted"><span className="w-3 h-3 rounded-sm bg-critical"></span> Full</div>
      </div>
    </div>
  );
}
