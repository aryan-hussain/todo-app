// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token')
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
