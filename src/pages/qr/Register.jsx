import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const gateId = searchParams.get('gate') || 'gate-1';
  const navigate = useNavigate();
  const { dispatch } = useContext(VenueContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your full name');
    if (phone.replace(/\D/g, '').length !== 10) return setError('Please enter a valid 10-digit number');

    const newId = crypto.randomUUID();
    dispatch({
      type: 'ATTENDEE_REGISTER',
      payload: {
        id: newId,
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        entryGateId: gateId,
        entryTime: Date.now(),
        currentZoneId: gateId,
        intendedZoneId: null,
        intentTime: null,
        status: 'active'
      }
    });
    
    dispatch({ type: 'VENUE_INCREMENT_ATTENDANCE' });
    dispatch({
      type: 'QR_EVENT_ADD',
      payload: {
        id: crypto.randomUUID(),
        eventType: 'entry',
        attendeeName: name.trim(),
        zoneId: gateId,
        zoneName: gateId,
        timestamp: Date.now()
      }
    });

    navigate(`/welcome?id=${newId}`, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <div className="flex justify-between items-center mb-10 flex-none">
        <h2 className="text-accent font-bold tracking-tight">Smart Venue Orchestrator</h2>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-elevated"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-2">Quick Setup</h1>
        <p className="text-muted text-sm mb-10">Your information helps us guide you better through the venue.</p>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
           <div className="flex flex-col gap-5">
             <div>
               <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Full Name</label>
               <input 
                 type="text" 
                 placeholder="e.g. Rahul Sharma"
                 value={name}
                 onChange={(e) => { setName(e.target.value); setError(''); }}
                 className="w-full bg-elevated border border-border rounded-xl px-4 py-4 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors"
               />
             </div>
             <div>
               <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Mobile Number</label>
               <input 
                 type="tel" 
                 placeholder="10 digit number"
                 value={phone}
                 onChange={(e) => { setPhone(e.target.value); setError(''); }}
                 className="w-full bg-elevated border border-border rounded-xl px-4 py-4 text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors block"
               />
             </div>
             
             {error && <div className="text-red-400 text-sm font-medium mt-[-8px]">{error}</div>}
             
             <p className="text-xs text-muted mt-2 opacity-70">
                🔒 Used only for venue guidance. Not shared.
             </p>
           </div>
           
           <div className="mt-auto pt-8 pb-6">
             <button type="submit" className="w-full bg-accent hover:bg-blue-700 text-white rounded-xl px-4 py-4 font-bold text-lg transition-colors shadow-md flex justify-between items-center">
               <span>Continue</span>
               <span>&rarr;</span>
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}
