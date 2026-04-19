import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function Incidents() {
  const { incidents, setIncidents, zones } = useSimulation();
  
  const [type, setType] = useState('Medical');
  const [zoneId, setZoneId] = useState(zones[0]?.id || '');
  const [severity, setSeverity] = useState('Low');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const zoneName = zones.find(z => z.id === zoneId)?.name || '';
    const newIncident = {
      id: Date.now().toString(),
      type,
      zone: zoneName,
      severity,
      notes,
      resolved: false,
      time: new Date().toLocaleTimeString()
    };
    setIncidents(prev => [newIncident, ...prev]);
    setNotes(''); 
  };

  const toggleResolved = (id) => {
    setIncidents(prev => prev.map(ind => ind.id === id ? { ...ind, resolved: !ind.resolved } : ind));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Incidents</h1>
          <p className="text-sm text-[#94A3B8]">Log and track venue issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 align-top items-start">
        <form onSubmit={handleSubmit} className="md:col-span-1 rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-sm flex flex-col gap-4 sticky top-6">
          <h2 className="font-semibold text-lg border-b border-[#334155] pb-2">New Incident</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="bg-[#0F172A] border border-[#334155] rounded-lg p-2 text-sm focus:border-blue-500 outline-none w-full">
              <option>Medical</option>
              <option>Security</option>
              <option>Maintenance</option>
              <option>Customer Service</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Zone</label>
            <select value={zoneId} onChange={e => setZoneId(e.target.value)} className="bg-[#0F172A] border border-[#334155] rounded-lg p-2 text-sm focus:border-blue-500 outline-none w-full">
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Severity</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(sev => (
                <label key={sev} className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg p-2 flex items-center justify-center cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 transition-colors">
                  <input type="radio" value={sev} checked={severity === sev} onChange={() => setSeverity(sev)} className="hidden" />
                  <span className="text-sm font-medium">{sev}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#0F172A] border border-[#334155] rounded-lg p-2 text-sm focus:border-blue-500 outline-none w-full resize-none min-h-[80px]" placeholder="Brief description..." required></textarea>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold mt-2 transition-colors">
            Log Incident
          </button>
        </form>

        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Recent Incidents</h2>
          {incidents.length === 0 ? (
             <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center text-[#94A3B8]">
               No incidents logged yet.
             </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incidents.map(inc => (
                <div key={inc.id} className={`rounded-xl border ${inc.resolved ? 'border-[#334155] bg-[#0F172A] opacity-70' : 'border-[#334155] bg-[#1E293B]'} p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${inc.severity === 'High' ? 'bg-red-500/20 text-red-400' : inc.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{inc.severity}</span>
                       <span className="font-semibold text-white">{inc.type}</span>
                       <span className="text-xs text-[#94A3B8]">• {inc.time}</span>
                    </div>
                    <div className="text-sm text-[#F1F5F9] font-medium">{inc.zone}</div>
                    <p className="text-sm mt-2 text-[#94A3B8] leading-relaxed">{inc.notes}</p>
                  </div>
                  <button onClick={() => toggleResolved(inc.id)} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${inc.resolved ? 'bg-[#334155] text-white hover:bg-[#475569]' : 'bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/50'}`}>
                    {inc.resolved ? 'Reopen' : 'Mark Resolved'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
