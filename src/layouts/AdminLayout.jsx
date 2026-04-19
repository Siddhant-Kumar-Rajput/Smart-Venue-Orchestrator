import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { VenueContext } from '../context/VenueContext';
import AlertBanner from '../components/shared/AlertBanner';
import EngineStatusDot from '../components/shared/EngineStatusDot';
import { startEngine, stopEngine } from '../engine';

export default function AdminLayout() {
  const { state, dispatch, stateRef } = useContext(VenueContext);
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === '/admin' && location.pathname === '/admin');
    return `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive ? 'bg-accent text-white' : 'text-muted hover:bg-elevated hover:text-primary'}`;
  };

  const navs = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/heatmap', label: 'Live Heatmap', icon: '🗺️' },
    { path: '/admin/intent', label: 'Intent Flow Map', icon: '🔮' },
    { path: '/admin/staff', label: 'Staff', icon: '👥' },
    { path: '/admin/incidents', label: 'Incidents', icon: '🚨' },
    { path: '/admin/qr-feed', label: 'QR Activity', icon: '📱' },
    { path: '/admin/cctv', label: 'CCTV Setup', icon: '📷' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-base text-primary overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border shrink-0 z-20">
        <div className="p-5 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Admin Control</h2>
          <p className="text-xs text-muted mt-1">Smart Venue Orchestrator</p>
        </div>
        
        <nav className="flex-1 p-3 overflow-y-auto">
          {navs.map(nav => (
             <Link key={nav.path} to={nav.path} replace className={getLinkClass(nav.path)}>
                <span className="text-lg">{nav.icon}</span>
                <span className="font-medium text-sm">{nav.label}</span>
             </Link>
          ))}
          
          <div className="my-4 border-t border-border"></div>
          
          <Link to="/admin/simulation" replace className={getLinkClass('/admin/simulation')}>
            <span className="text-lg">⚙️</span>
            <span className="font-medium text-sm">Simulation</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
             onClick={() => {
               dispatch({ type: 'ADMIN_LOGOUT' });
               navigate('/');
             }} 
             className="text-sm text-red-400 hover:text-red-300 w-full text-left font-medium"
          >
            ← Exit to Public
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AlertBanner />
        
        <header className="bg-surface border-b border-border flex items-center justify-between p-4 shrink-0 z-10">
           <div className="flex items-center gap-4">
             <span className="md:hidden font-bold">Admin</span>
             
             {/* Admin Quick Control */}
             <div className="hidden sm:flex items-center gap-3 bg-base border border-border rounded-full pr-3 pl-1 py-1">
                <EngineStatusDot size="sm" />
                <button 
                  onClick={() => state.engine.running ? stopEngine(dispatch) : startEngine(dispatch, stateRef)}
                  className="text-xs font-semibold text-accent hover:text-blue-400"
                >
                  {state.engine.running ? 'Stop' : 'Start'}
                </button>
             </div>
           </div>
           
           <div className="flex items-center gap-4 text-sm">
             <span className="text-muted hidden sm:inline">{state.venue.event}</span>
             <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center font-bold text-primary">A</div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full relative p-4 md:p-6 pb-20 md:pb-6 bg-base">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around p-2 z-50 overflow-x-auto gap-1">
         {[navs[0], navs[1], navs[2], navs[4], navs[5]].map(nav => (
            <Link key={nav.path} to={nav.path} replace className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${location.pathname === nav.path ? 'text-accent bg-elevated' : 'text-muted'}`}>
              <span className="text-lg">{nav.icon}</span>
              <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis w-12 text-center">{nav.label.split(' ')[0]}</span>
            </Link>
         ))}
         <Link to="/admin/simulation" replace className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${location.pathname === '/admin/simulation' ? 'text-accent bg-elevated' : 'text-muted'}`}>
              <span className="text-lg">⚙️</span>
              <span className="text-[10px]">Sim</span>
         </Link>
      </nav>

    </div>
  );
}
