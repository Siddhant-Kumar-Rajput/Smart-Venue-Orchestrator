import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { toast } from 'react-hot-toast';

export default function QRScan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gateParam = searchParams.get('gate') || '1';
  const gateName = `Gate ${gateParam}`;
  
  const { attendees } = useSimulation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const existing = attendees.find(a => a.phone === phoneNumber);
    if (existing) {
      navigate(`/welcome?name=${encodeURIComponent(existing.name)}&gate=${gateParam}`);
    } else {
      toast.error('Number not registered.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] text-[#F1F5F9] p-4 text-center">
      <div className="max-w-md w-full bg-[#1E293B] rounded-2xl p-8 border border-[#334155] shadow-lg">
        <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-6 object-contain" />
        <h1 className="text-2xl font-bold mb-2">Welcome to Metro Arena</h1>
        <p className="text-lg text-green-400 font-semibold mb-6">You've scanned the QR at {gateName}</p>
        <p className="text-sm text-[#94A3B8] mb-8">Let's get you set up for a great experience.</p>

        <button 
          onClick={() => navigate(`/register?gate=${gateParam}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-4 font-bold text-lg w-full mb-8 shadow-md"
        >
          Get Started &rarr;
        </button>

        <div className="pt-6 border-t border-[#334155]">
          <p className="text-xs text-[#94A3B8] mb-3 uppercase tracking-wide">Already registered?</p>
          <form onSubmit={handleLogin} className="flex gap-2">
            <input 
              type="tel"
              placeholder="Enter mobile number" 
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none text-sm"
            />
            <button type="submit" className="bg-[#334155] hover:bg-[#475569] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
