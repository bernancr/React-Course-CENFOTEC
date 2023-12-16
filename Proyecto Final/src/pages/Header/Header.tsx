import React from 'react';
import { useAuth } from '../Login/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function Header() {
  const user = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogout();

  console.log(user)

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/'); // Redirige a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <div id='header' className='container d-flex flex-wrap'>
      <div className='container text-center mt-5'><Link to="/pelis"><img width="200px" src="../cinetiko.png" alt="CineTiko" /></Link></div>
      <h5 className='container text-center'>El cine en tus palabras</h5>
      <nav className="col-12 d-flex">
        <div className='col-8 d-flex flex-wrap justify-content-start'>
          <Link to="/pelis" className='btn btn-danger m-2'>Peliculas</Link>
          <Link to="/favoritas" className='btn btn-danger m-2'>Favoritas</Link>
          <Link to="/resenas" className='btn btn-danger m-2'>Reseñas</Link>
        </div>
        <div className='col-4 d-flex justify-content-end'>
          {user ? (
            <button className='btn btn-secondary' onClick={handleLogoutClick}>Cerrar Sesión</button>
          ) : (
            <Link to="/">Iniciar Sesión</Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
