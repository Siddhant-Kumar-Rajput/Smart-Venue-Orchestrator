import React from 'react';
import { Polyline } from 'react-leaflet';

export default function IntentArrow({ startPoint, endPoint, count, destDensity, onClick }) {
  if (count <= 0) return null;

  let weight = 2;
  let dashArray = '8 8';
  let opacity = 0.4;
  
  if (count > 5 && count <= 15) {
    weight = 4;
    dashArray = null; 
    opacity = 0.7;
  } else if (count > 15) {
    weight = 6;
    dashArray = null;
    opacity = 1.0;
  }
  
  let color = '#22C55E';
  if (destDensity > 80) color = '#EF4444';
  else if (destDensity > 60) color = '#F59E0B';

  const pathOptions = { color, weight, dashArray, opacity };

  return (
    <Polyline 
      positions={[startPoint, endPoint]}
      pathOptions={pathOptions}
      className={count > 15 || dashArray ? "animate-[dash_1s_linear_infinite]" : ""}
      eventHandlers={{ click: onClick }}
    />
  );
}
