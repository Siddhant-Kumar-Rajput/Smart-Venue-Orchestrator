import React from 'react';

export default function StaffRow({ staff, zones, onUpdateZone }) {
  return (
    <tr className="border-b border-border/50 hover:bg-elevated/30 transition-colors">
      <td className="p-3">
         <div className="font-medium text-primary">{staff.name}</div>
         <div className="text-[10px] text-muted font-mono">{staff.id}</div>
      </td>
      <td className="p-3">
         <select 
           value={staff.zoneId}
           onChange={(e) => onUpdateZone(staff.id, e.target.value)}
           className="bg-base border border-border rounded px-2 py-1 text-sm text-primary focus:border-accent"
         >
           {zones.map(z => (
             <option key={z.id} value={z.id}>{z.name}</option>
           ))}
         </select>
      </td>
      <td className="p-3">
         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${staff.status === 'active' ? 'bg-safe/20 text-safe' : 'bg-border text-muted'}`}>
           {staff.status}
         </span>
      </td>
    </tr>
  );
}
