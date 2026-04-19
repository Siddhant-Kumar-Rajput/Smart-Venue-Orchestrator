import React, { useContext } from 'react';
import { VenueContext } from '../../context/VenueContext';
import IncidentCard from '../../components/admin/IncidentCard';

export default function Incidents() {
  const { state, dispatch } = useContext(VenueContext);

  const openIncidents = state.incidents.filter(i => i.status === 'open');
  const resolvedIncidents = state.incidents.filter(i => i.status === 'resolved');

  const handleResolve = (id) => {
    dispatch({ type: 'INCIDENT_RESOLVE', payload: { id } });
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto pb-10">
      
      <div className="flex justify-between items-center bg-base border border-border p-4 rounded-xl shrink-0">
         <div>
           <h2 className="text-2xl font-bold text-primary">Incident Log</h2>
           <p className="text-muted text-sm border-l-2 border-critical pl-2 mt-1">
             {openIncidents.length} critical issues require attention
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
         
         <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col gap-4">
           <h3 className="font-bold text-primary border-b border-border pb-2 text-lg">Active Incidents</h3>
           {openIncidents.length === 0 ? (
             <div className="text-muted text-sm italic py-8 text-center bg-base rounded-xl font-medium">No open incidents. 👏</div>
           ) : (
             <div className="flex flex-col gap-4">
               {openIncidents.map(inc => (
                 <IncidentCard 
                   key={inc.id} 
                   incident={inc} 
                   zoneName={state.zones.find(z => z.id === inc.zoneId)?.name || 'Unknown Zone'} 
                   onResolve={handleResolve} 
                 />
               ))}
             </div>
           )}
         </div>

         <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col gap-4 opacity-80">
           <h3 className="font-bold text-primary border-b border-border pb-2 text-lg">Resolved Today</h3>
           {resolvedIncidents.length === 0 ? (
             <div className="text-muted text-sm italic py-8 text-center">No resolved incidents.</div>
           ) : (
             <div className="flex flex-col gap-4">
               {resolvedIncidents.map(inc => (
                 <IncidentCard 
                   key={inc.id} 
                   incident={inc} 
                   zoneName={state.zones.find(z => z.id === inc.zoneId)?.name || 'Unknown Zone'} 
                   onResolve={handleResolve} 
                 />
               ))}
             </div>
           )}
         </div>

      </div>
    </div>
  );
}
