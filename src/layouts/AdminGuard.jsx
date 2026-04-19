import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { VenueContext } from '../context/VenueContext';
import { toast } from 'react-hot-toast';

export default function AdminGuard({ children }) {
  const { state } = useContext(VenueContext);
  const location = useLocation();

  if (!state.isAdminAuthenticated) {
    if (location.pathname !== '/') {
        toast('Admin access required.', { icon: '🔒' });
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
