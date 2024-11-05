// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import UserService from '../utils/UserService'; // Adjust the path as necessary
import Forbidden from '../Error/Forbidden';// Adjust the path as necessary

const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = UserService.isAuthenticated();
  const userRole = UserService.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Forbidden />;
  }

  return element;
};

export default ProtectedRoute;
