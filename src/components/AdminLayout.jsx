import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import AlertStrip from './AlertStrip';

export default function AdminLayout() {
  const { authEnabled, simulationRunning } = useSimulation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authEnabled) {
      navigate('/');
    }
  }, [authEnabled, navigate]);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === '/admin' && location.pathname === '/admin');
    return `flex items-center justify-between px-4 py-2 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-[#94A3B8] hover:bg-[#334155] hover:text-white'}`;
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin' },
    // Only mapped the implemented /admin routes from V1 + V2
    { label: 'Intent Flow Map', path: '/admin/intent', isNew: true },
    { label: 'QR Activity', path: '/admin/qr-feed', isNew: true },
    { label: 'CCTV Setup', path: '/admin/cctv', isNew: true },
    { label: 'Incidents', path: '/admin/incidents' },
  ];

  if (!authEnabled) return null;

  return (
    <div className="flex h-screen bg-[#0F172A] text-[#F1F5F9] font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-[#1E293B] border-r border-[#334155]">
        <div className="p-4 border-b border-[#334155]">
          <h2 className="text-xl font-bold text-white">Admin Control</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Smart Venue System</p>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
              <span>{item.label}</span>
              {item.isNew && (
                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">NEW</span>
              )}
            </Link>
          ))}
          <div className="my-4 border-t border-[#334155]"></div>
          <Link to="/simulation" className={getLinkClass('/simulation')}>Simulation Panel</Link>
        </nav>
        
        <div className="p-4 border-t border-[#334155]">
          <Link to="/" className="text-sm text-red-400 hover:text-red-300">← Exit to Public</Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-[#1E293B] border-b border-[#334155] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="md:hidden font-bold">Admin</span>
            {simulationRunning && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                SIM ACTIVE
              </span>
            )}
          </div>
          <div className="text-sm text-[#94A3B8]">Championship Finals</div>
        </header>
        
        <AlertStrip />
        
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 pb-24 md:pb-6 relative">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] flex justify-around p-3 z-50 overflow-x-auto gap-2">
        <Link to="/admin" className="text-xs text-[#94A3B8] whitespace-nowrap">Dash</Link>
        <Link to="/admin/intent" className="text-xs text-[#94A3B8] whitespace-nowrap">Intent</Link>
        <Link to="/admin/qr-feed" className="text-xs text-[#94A3B8] whitespace-nowrap">QR</Link>
        <Link to="/admin/cctv" className="text-xs text-[#94A3B8] whitespace-nowrap">CCTV</Link>
        <Link to="/simulation" className="text-xs text-[#94A3B8] whitespace-nowrap">Sim</Link>
      </nav>
    </div>
  );
}
