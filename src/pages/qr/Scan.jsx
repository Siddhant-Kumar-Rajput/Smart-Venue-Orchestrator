import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VenueContext } from '../../context/VenueContext';
import { toast } from 'react-hot-toast';

export default function Scan() {
  const [searchParams] = useSearchParams();
  const gateId = searchParams.get('gate') || 'gate-1';
  const navigate = useNavigate();
  const { state } = useContext(VenueContext);
  
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState('');

  const gateName = state.zones.find(z => z.id === gateId)?.name || "Main Entrance";

  const handleLogin = (e) => {
    e.preventDefault();
    const existing = state.attendees.find(a => a.phone === phone);
    if (existing) {
      toast.success("Welcome back!");
      navigate(`/welcome?id=${existing.id}`, { replace: true });
    } else {
      toast.error("Number not found. Please register.");
      navigate(`/register?gate=${gateId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      <div className="flex justify-between items-center mb-12 flex-none">
        <h2 className="text-accent font-bold tracking-tight">Smart Venue Orchestrator</h2>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-elevated"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-16 text-center">
         <div className="w-32 h-32 bg-elevated rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden shadow-lg border border-border">
            <span className="text-6xl">📱</span>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
         </div>
         
         <h1 className="text-3xl font-bold text-primary mb-2">Welcome to the event</h1>
         <p className="text-accent font-medium mb-4">You've arrived at {gateName}</p>
         <p className="text-muted text-sm max-w-[260px] mx-auto leading-relaxed mb-8">
           Let's personalise your experience. It takes 10 seconds.
         </p>
      </div>

      <div className="w-full flex-none pb-6">
        {showLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
             <input 
               type="tel"
               placeholder="Enter 10-digit mobile number"
               autoFocus
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               className="w-full bg-elevated border border-border rounded-lg px-4 py-3.5 text-primary placeholder-muted focus:outline-none focus:border-accent"
             />
             <button type="submit" className="bg-accent hover:bg-blue-700 text-white rounded-lg px-4 py-3.5 font-bold transition-colors shadow-md">
               Login &rarr;
             </button>
             <button type="button" onClick={() => setShowLogin(false)} className="text-xs text-muted mt-2">
               Cancel
             </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
             <button 
               onClick={() => navigate(`/register?gate=${gateId}`)} 
               className="w-full bg-accent hover:bg-blue-700 text-white rounded-lg px-4 py-4 font-bold transition-colors shadow-md text-lg"
             >
               Get Started
             </button>
             <button 
               onClick={() => setShowLogin(true)}
               className="text-sm text-muted hover:text-primary transition-colors py-2"
             >
               Already registered? Enter your number
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
