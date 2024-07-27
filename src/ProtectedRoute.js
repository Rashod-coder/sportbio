// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    window.alert('You are not authorized to access this page');
    return <Navigate to="/login" replace />;

  }

  return children;
};

export default ProtectedRoute;
