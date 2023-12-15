// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const user = useAuth();

  if (!user) {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    return <Navigate to="/login" replace={true} />;
  }

  // Solo necesita devolver el componente Route
  return <Route {...rest} element={<Element />} />;
};

export default PrivateRoute;
