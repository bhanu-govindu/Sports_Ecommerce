import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../auth';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to auth page with return URL
    return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}