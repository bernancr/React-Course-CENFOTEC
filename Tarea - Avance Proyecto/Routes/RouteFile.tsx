import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/Login/AuthProvider';
import Login from '../pages/Login/Login';
import Register from '../pages/Login/Register';
import Pelis from '../pages/Peliculas/Pelis';
import Favoritas from '../pages/Peliculas/Favoritas';
import Reviews from '../pages/Peliculas/Reviews';

const PrivateRoute = ({ children }) => {
  const user = useAuth();

  if (!user) {
    // Si el usuario no está autenticado, redirige a la página de inicio
    return <Navigate to="/" replace={true} />;
  }

  // Devuelve el contenido protegido si el usuario está autenticado
  return children;
};

const RouteFile = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pelis" element={<PrivateRoute><Pelis /></PrivateRoute>} />
      <Route path="/favoritas" element={<PrivateRoute><Favoritas /></PrivateRoute>} />
      <Route path="/resenas" element={<PrivateRoute><Reviews /></PrivateRoute>} />
      {/* Agrega más rutas según sea necesario */}
    </Routes>
  );
};

export default RouteFile;
