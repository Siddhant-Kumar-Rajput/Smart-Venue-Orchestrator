import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';

// Priority: emergency > critical > warning > info
const typeWeights = { emergency: 4, critical: 3, warning: 2, info: 1 };

export default function AlertBanner() {
  const { state, dispatch } = useContext(VenueContext);
  
  const activeAlerts = state.alerts.filter(a => !a.acknowledged);
  if (activeAlerts.length === 0) return null;

  // Sort by priority then newest
  activeAlerts.sort((a, b) => {
    const wA = typeWeights[a.type] || 0;
    const wB = typeWeights[b.type] || 0;
    if (wA !== wB) return wB - wA;
    return b.timestamp - a.timestamp;
  });

  const alert = activeAlerts[0];
  const isEmergency = alert.type === 'emergency';
  const isAdmin = state.isAdminAuthenticated;

  let bgClass, borderClass, textClass, icon;
  switch (alert.type) {
    case 'emergency':
      bgClass = 'bg-critical'; borderClass = 'border-critical'; textClass = 'text-white'; icon = '🚨';
      break;
    case 'critical':
      bgClass = 'bg-critical/20'; borderClass = 'border-critical/50'; textClass = 'text-critical'; icon = '❌';
      break;
    case 'warning':
      bgClass = 'bg-caution/20'; borderClass = 'border-caution/50'; textClass = 'text-caution'; icon = '⚠️';
      break;
    default:
      bgClass = 'bg-info/20'; borderClass = 'border-info/50'; textClass = 'text-info'; icon = 'ℹ️';
  }

  // Attendee cannot dismiss an emergency alert, only admin can.
  // Other alerts can be dismissed by attendee (which acknowledges them globally for now, or just hides them locally? The prompt says "dismissible" and "only admin can acknowledge". Let's have dismiss acknowledge it globally to keep logic simple, or just admin access check).
  // "Emergency: sticky, full-width red bar, cannot be dismissed by attendee (only admin can acknowledge it)"
  const canDismiss = isAdmin || !isEmergency;

  return (
    <div className={`w-full ${bgClass} border-b ${borderClass} p-3 shrink-0 flex items-start gap-3 shadow-md z-50`}>
       <div className="text-xl mt-0.5">{icon}</div>
       <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm ${isEmergency ? 'text-white' : 'text-primary'}`}>{alert.title}</h4>
          <p className={`text-xs mt-0.5 ${isEmergency ? 'text-red-100' : 'text-muted'}`}>{alert.message}</p>
       </div>
       {canDismiss && (
         <button 
           onClick={() => dispatch({ type: 'ALERT_ACKNOWLEDGE', payload: { id: alert.id } })}
           className={`p-1 rounded opacity-70 hover:opacity-100 transition-opacity ${isEmergency ? 'text-white hover:bg-white/20' : 'text-primary hover:bg-elevated'}`}
         >
           ✖
         </button>
       )}
    </div>
  );
}
