import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { toast } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gateParam = searchParams.get('gate') || '1';
  const gateName = `Gate ${gateParam}`;
  
  const { setAttendees, setQrFeed } = useSimulation();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    if (phone.replace(/\D/g, '').length < 10) return toast.error('Enter valid 10 digit number');

    const newAttendee = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      entryGate: gateName,
      entryTime: Date.now(),
      currentZone: gateName,
      status: 'active'
    };

    setAttendees(prev => [...prev, newAttendee]);
    
    // Add real event to QR Feed
    setQrFeed(prev => [{
      id: crypto.randomUUID(),
      type: 'entry',
      attendeeName: newAttendee.name,
      zone: gateName,
      timestamp: Date.now()
    }, ...prev].slice(0, 100));

    toast.success('Registration complete!');
    navigate(`/welcome?name=${encodeURIComponent(newAttendee.name)}&gate=${gateParam}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F172A] text-[#F1F5F9] p-4 pt-12">
      <div className="max-w-md w-full">
        <button onClick={() => navigate(-1)} className="text-[#94A3B8] hover:text-white mb-6 text-sm flex items-center gap-1">
           &larr; Back
        </button>
        
        <h1 className="text-3xl font-bold mb-2">Quick Registration</h1>
        <p className="text-[#94A3B8] mb-8">Takes 10 seconds. Helps us make your visit better.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-sm">
          <div className="flex flex-col gap-2">
             <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Full Name</label>
             <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none border-2" placeholder="E.g. Rahul Sharma" />
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-xs text-[#94A3B8] uppercase tracking-wide font-medium">Mobile Number</label>
             <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none border-2" placeholder="10-digit number" />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3.5 font-bold text-lg w-full mt-4 shadow-md transition-colors">
            Continue &rarr;
          </button>
        </form>

        <p className="text-xs text-center text-[#475569] mt-8 px-8">
          Your number is only used for venue assistance and will not be shared.
        </p>
      </div>
    </div>
  );
}
