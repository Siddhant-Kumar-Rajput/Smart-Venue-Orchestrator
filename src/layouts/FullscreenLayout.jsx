import React from 'react';
import { Outlet } from 'react-router-dom';
import AlertBanner from '../components/shared/AlertBanner';

export default function FullscreenLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AlertBanner />
      <div className="flex-1 flex flex-col w-full max-w-sm mx-auto bg-base relative overflow-hidden shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
}
