import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import FullscreenLayout from './layouts/FullscreenLayout';
import AttendeeLayout from './layouts/AttendeeLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminGuard from './layouts/AdminGuard';

// Shared Pages
import Landing from './pages/Landing';

// Attendee Flow Pages (QR)
import Scan from './pages/qr/Scan';
import Register from './pages/qr/Register';
import Welcome from './pages/qr/Welcome';
import Go from './pages/qr/Go';
import Suggest from './pages/qr/Suggest';
import Navigate from './pages/qr/Navigate';

// Attendee Pages (Tabs)
import AttendeeDashboard from './pages/attendee/Dashboard';
import AttendeeQueues from './pages/attendee/Queues';
import AttendeeVenueMap from './pages/attendee/VenueMap';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminHeatMap from './pages/admin/HeatMap';
import AdminIntentMap from './pages/admin/IntentMap';
import AdminStaff from './pages/admin/Staff';
import AdminIncidents from './pages/admin/Incidents';
import AdminQRFeed from './pages/admin/QRFeed';
import AdminCCTV from './pages/admin/CCTV';
import AdminSimulation from './pages/admin/Simulation';

function App() {
  return (
    <VenueProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Public / QR Flow (Fullscreen) */}
          <Route element={<FullscreenLayout />}>
            <Route path="scan" element={<Scan />} />
            <Route path="register" element={<Register />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="go" element={<Go />} />
            <Route path="suggest" element={<Suggest />} />
            <Route path="navigate" element={<Navigate />} />
          </Route>

          {/* Attendee Map & Queues */}
          <Route path="/attendee" element={<AttendeeLayout />}>
            <Route index element={<AttendeeDashboard />} />
            <Route path="map" element={<AttendeeVenueMap />} />
            <Route path="queues" element={<AttendeeQueues />} />
          </Route>

          {/* Operations / Admin */}
          <Route path="/admin" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
             <Route index element={<AdminDashboard />} />
             <Route path="heatmap" element={<AdminHeatMap />} />
             <Route path="intent" element={<AdminIntentMap />} />
             <Route path="staff" element={<AdminStaff />} />
             <Route path="incidents" element={<AdminIncidents />} />
             <Route path="qr-feed" element={<AdminQRFeed />} />
             <Route path="cctv" element={<AdminCCTV />} />
             <Route path="simulation" element={<AdminSimulation />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster position="top-center" toastOptions={{ className: 'bg-surface text-primary border border-border shadow-2xl' }} />
    </VenueProvider>
  );
}

export default App;
