import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AlertStrip from './AlertStrip';

export default function AttendeeLayout() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === '/attendee' && location.pathname === '/attendee');
    return `flex flex-col items-center text-sm font-medium transition-colors ${isActive ? 'text-blue-500' : 'text-[#94A3B8] hover:text-white'}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#F1F5F9] font-sans">
      <header className="bg-[#1E293B] border-b border-[#334155] p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="font-bold text-lg text-white">Metro Arena</div>
        <div className="text-xs text-[#94A3B8] uppercase tracking-wider">Championship Finals</div>
      </header>
      
      <AlertStrip />
      
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Link to="/attendee" className={getLinkClass('/attendee')}>
          <span className="text-xl mb-1">🏠</span>
          Dashboard
        </Link>
        <Link to="/attendee/map" className={getLinkClass('/attendee/map')}>
          <span className="text-xl mb-1">🗺️</span>
          Map
        </Link>
        <Link to="/attendee/queues" className={getLinkClass('/attendee/queues')}>
          <span className="text-xl mb-1">⏳</span>
          Queues
        </Link>
      </nav>
    </div>
  );
}
