import React from 'react';
import useLogout from '../../hooks/useLogout';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Login/AuthProvider';

function Header() {
  const user = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogout();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <div id='header' className='container d-flex flex-wrap'>
      <h1 className='container text-center m-5'>Bienvenido a CineTiko</h1>
      <nav className="col-12 d-flex">
        <div className='col-10 d-flex justify-content-start'>
          <Link to="/pelis" className='btn btn-danger m-2'>Peliculas</Link>
          <Link to="/favoritas" className='btn btn-danger m-2'>Favoritas</Link>
          <Link to="/resenas" className='btn btn-danger m-2'>Reseñas</Link>
        </div>
        <div className='col-2 d-flex justify-content-end'>
          {user ? (
            <button className='btn btn-secondary' onClick={handleLogoutClick}>Cerrar Sesión</button>
          ) : (
            <Link to="/login">Iniciar Sesión</Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
