import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AlertBanner from '../components/shared/AlertBanner';
import EngineStatusDot from '../components/shared/EngineStatusDot';

export default function AttendeeLayout() {
  const location = useLocation();

  const navs = [
    { path: '/attendee', label: 'Dashboard', icon: '🏠' },
    { path: '/attendee/map', label: 'Map', icon: '🗺️' },
    { path: '/attendee/queues', label: 'Queues', icon: '⏳' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base text-primary max-w-sm mx-auto shadow-2xl border-x border-border">
      <AlertBanner />
      
      <header className="p-4 bg-surface border-b border-border flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-bold text-accent">Smart Venue Orchestrator</h1>
          <p className="text-[10px] text-muted">Welcome to the event</p>
        </div>
        <EngineStatusDot size="sm" />
      </header>

      <main className="flex-1 overflow-y-auto w-full pb-20 relative">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface border-t border-border flex justify-around p-3 z-50">
        {navs.map(nav => {
          const active = location.pathname === nav.path;
          return (
            <Link key={nav.path} to={nav.path} replace className={`flex flex-col items-center gap-1 min-w-[70px] ${active ? 'text-accent' : 'text-muted'}`}>
              <span className={`text-xl ${active ? 'scale-110 drop-shadow-sm' : ''} transition-transform`}>{nav.icon}</span>
              <span className="text-[10px] font-medium">{nav.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
