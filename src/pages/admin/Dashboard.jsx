import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';
import KPICard from '../../components/admin/KPICard';
import StaffRow from '../../components/admin/StaffRow';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, dispatch } = useContext(VenueContext);
  const navigate = useNavigate();

  const totalCapacity = state.venue.totalCapacity;
  const currentAttendance = state.venue.currentAttendance;
  
  // Averages
  const activeZones = state.zones.filter(z => z.occupancy > 0);
  const avgWait = activeZones.length ? Math.round(activeZones.reduce((s, z) => s + z.waitTime, 0) / activeZones.length) : 0;
  const activeAlerts = state.alerts.filter(a => !a.acknowledged).length;
  const openIncidents = state.incidents.filter(i => i.status === 'open').length;

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Jury Tip Banner */}
      <div className="bg-accent/20 border border-accent/30 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <span className="text-2xl mt-0.5" role="img" aria-label="tip">💡</span>
        <div>
          <h4 className="font-bold text-accent mb-1">Important Tip for Jury</h4>
          <p className="text-sm text-primary leading-relaxed">
            Try the <strong>Simulation</strong> tool—the last option in the side panel. It allows you to trigger various scenarios (like emergency alerts, high traffic bursts, and crowd movements) so you can observe how the system adapts and responds dynamically in real-time!
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Current Attendance" value={currentAttendance.toLocaleString()} subtext={`Capacity: ${totalCapacity.toLocaleString()}`} icon="🏟️" />
        <KPICard label="Avg Wait Time" value={`~${avgWait}m`} icon="⏳" trend={avgWait > 15 ? 12 : -5} />
        <KPICard label="Open Incidents" value={openIncidents} icon="🚨" />
        <KPICard label="Active Alerts" value={activeAlerts} icon="⚠️" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
         {/* Left Col: Mini Heatmap */}
         <div className="w-full lg:w-2/3 bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-base flex justify-between items-center">
              <h3 className="font-bold text-primary">Live Overview</h3>
              <button onClick={() => navigate('/admin/heatmap')} className="text-xs text-accent hover:text-blue-400 font-medium tracking-wide">FULL MAP &rarr;</button>
            </div>
            <div className="flex-1 bg-base relative overflow-hidden flex items-center justify-center p-4">
              <div className="w-full h-full bg-[url('/map-bg.svg')] bg-contain bg-center bg-no-repeat opacity-50 absolute inset-0"></div>
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 w-full h-full content-center">
                {state.zones.map(z => {
                   const isCrit = z.density >= 90;
                   return (
                     <div key={z.id} className={`p-3 rounded-lg border flex flex-col gap-1 shadow-sm ${isCrit ? 'bg-critical/20 border-critical/50' : z.density >= 70 ? 'bg-caution/20 border-caution/50' : 'bg-surface border-border'}`}>
                        <span className="text-xs font-bold text-primary truncate block">{z.name}</span>
                        <span className={`text-sm font-bold ${isCrit ? 'text-critical' : z.density >= 70 ? 'text-caution' : 'text-safe'}`}>{Math.round(z.density)}%</span>
                     </div>
                   )
                })}
              </div>
            </div>
         </div>

         {/* Right Col: Alert Feed */}
         <div className="w-full lg:w-1/3 bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-base flex justify-between items-center">
              <h3 className="font-bold text-primary">Live Alerts</h3>
              <button 
                onClick={() => dispatch({ type: 'ALERT_CLEAR_ALL' })}
                className="text-xs text-muted hover:text-primary transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0B1121]">
               {state.alerts.filter(a => !a.acknowledged).length === 0 ? (
                 <div className="text-center p-10 text-muted text-sm">No active alerts</div>
               ) : (
                 state.alerts.filter(a => !a.acknowledged).map(alert => (
                   <div key={alert.id} className={`p-3 rounded-lg border bg-surface flex flex-col gap-2 ${alert.type === 'emergency' || alert.type === 'critical' ? 'border-l-4 border-l-critical border-border' : 'border-border'}`}>
                     <div className="flex justify-between items-start">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${alert.type === 'emergency' ? 'bg-critical text-white' : alert.type === 'critical' ? 'bg-critical/20 text-critical' : alert.type === 'warning' ? 'bg-caution/20 text-caution' : 'bg-info/20 text-info'}`}>
                         {alert.type}
                       </span>
                       <span className="text-[10px] text-muted">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <span className="font-semibold text-sm text-primary">{alert.title}</span>
                     <button 
                       onClick={() => dispatch({ type: 'ALERT_ACKNOWLEDGE', payload: { id: alert.id } })}
                       className="text-xs bg-elevated hover:bg-border text-primary py-1.5 rounded transition-colors mt-1"
                     >
                       Acknowledge
                     </button>
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>

      {/* Staff Status Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-base">
            <h3 className="font-bold text-primary">Staff Status</h3>
            <p className="text-xs text-muted">Quick dispatch</p>
          </div>
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-[#0B1121] text-muted sticky top-0">
                 <tr>
                   <th className="p-3 font-semibold text-xs">Name</th>
                   <th className="p-3 font-semibold text-xs">Assigned Zone</th>
                   <th className="p-3 font-semibold text-xs">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {state.staff.map(s => (
                    <StaffRow 
                      key={s.id} 
                      staff={s} 
                      zones={state.zones} 
                      onUpdateZone={(id, zoneId) => dispatch({ type: 'STAFF_UPDATE_ZONE', payload: { id, zoneId } })}
                    />
                 ))}
               </tbody>
             </table>
          </div>
      </div>

    </div>
  );
}
