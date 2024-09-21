// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ element: Element, ...rest }) => {
  const { token, role } = useSelector((state) => state.auth) || localStorage.getItem('token')
  return token && role === 'admin' ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default AdminRoute;
