import React, { useContext, useState } from 'react';
import { VenueContext } from '../../context/VenueContext';
import StaffRow from '../../components/admin/StaffRow';

export default function Staff() {
  const { state, dispatch } = useContext(VenueContext);
  const [filter, setFilter] = useState('All');

  const filteredStaff = filter === 'All' 
    ? state.staff 
    : state.staff.filter(s => s.status === filter.toLowerCase());

  const handleUpdateZone = (id, zoneId) => {
    dispatch({ type: 'STAFF_UPDATE_ZONE', payload: { id, zoneId } });
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border bg-base flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-primary">Staff Roster</h2>
           <p className="text-sm text-muted">Manage active personnel ({state.staff.length} total, {state.staff.filter(s => s.status === 'active').length} active)</p>
        </div>
        
        <div className="flex gap-2">
          {['All', 'Active', 'Break'].map(f => (
             <button 
               key={f} 
               onClick={() => setFilter(f)}
               className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === f ? 'bg-accent text-white' : 'bg-elevated hover:bg-border text-primary'}`}
             >
               {f}
             </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm">
           <thead className="bg-[#0B1121] text-muted sticky top-0 border-b border-border z-10">
             <tr>
               <th className="p-4 font-semibold text-xs">Name & ID</th>
               <th className="p-4 font-semibold text-xs">Assigned Zone</th>
               <th className="p-4 font-semibold text-xs">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border/50">
             {filteredStaff.map(s => (
                <StaffRow key={s.id} staff={s} zones={state.zones} onUpdateZone={handleUpdateZone} />
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
