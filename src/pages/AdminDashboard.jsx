import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import KPICard from '../components/KPICard';
import HeatmapOverlay from '../components/HeatmapOverlay';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

export default function AdminDashboard() {
  const { zones, queues, incidents, alerts, staff, setStaff } = useSimulation();

  const activeAlertCount = alerts.length;
  const avgWait = queues.length > 0 ? Math.round(queues.reduce((acc, q) => acc + q.waitTime, 0) / queues.length) : 0;
  const totalAttendance = Math.round(zones.reduce((acc, z) => acc + (z.density * 150), 0));
  
  const handleStaffStatus = (id, newStatus) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-sm text-[#94A3B8]">Live system metrics</p>
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Est. Attendance" value={totalAttendance} icon="👥" colorClass="text-white" />
        <KPICard label="Avg Wait Time" value={`${avgWait}m`} icon="⏳" colorClass="text-[#F59E0B]" />
        <KPICard label="Open Incidents" value={incidents.filter(i => !i.resolved).length} icon="📋" colorClass="text-[#38BDF8]" />
        <KPICard label="Active Alerts" value={activeAlertCount} icon="🚨" colorClass={activeAlertCount > 0 ? "text-[#EF4444]" : "text-[#22C55E]"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map */}
        <div className="lg:col-span-2 rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden flex flex-col h-[500px] shadow-sm">
          <div className="p-4 bg-[#1E293B] border-b border-[#334155] flex justify-between items-center">
            <h3 className="font-semibold text-white">Live Heatmap</h3>
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="flex-1 bg-[#0F172A] relative">
             <MapContainer crs={L.CRS.Simple} bounds={[[0, 0], [600, 800]]} minZoom={-1} maxZoom={2} center={[300, 400]} zoom={0} style={{ height: '100%', width: '100%', background: '#0F172A' }}>
               <HeatmapOverlay />
             </MapContainer>
          </div>
        </div>

        {/* Staff Management Panel */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] flex flex-col h-[500px] shadow-sm">
          <div className="p-4 border-b border-[#334155]">
            <h3 className="font-semibold text-white">Active Field Staff</h3>
            <p className="text-xs text-[#94A3B8]">Deploy or manage breaks</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
             {staff.map(s => {
               const statusColor = s.status === 'Active' ? 'text-green-400' : s.status === 'On Break' ? 'text-amber-400' : 'text-red-400';
               return (
                 <div key={s.id} className="flex justify-between items-center text-sm border-b border-[#334155] pb-3 last:border-0 last:pb-0">
                   <div>
                     <div className="font-semibold text-white flex items-center gap-2">
                       {s.name}
                       <span className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></span>
                     </div>
                     <div className="text-xs text-[#94A3B8] mt-0.5">{s.zone}</div>
                   </div>
                   <select 
                     value={s.status} 
                     onChange={(e) => handleStaffStatus(s.id, e.target.value)}
                     className="bg-[#0F172A] border border-[#334155] rounded-lg px-2 py-1.5 text-xs outline-none text-[#F1F5F9] focus:border-blue-500"
                   >
                     <option value="Active">Active</option>
                     <option value="On Break">On Break</option>
                     <option value="Inactive">Inactive</option>
                   </select>
                 </div>
               )
             })}
          </div>
        </div>
      </div>
    </div>
  );
}
