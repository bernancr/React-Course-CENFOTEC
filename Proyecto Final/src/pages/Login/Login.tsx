// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      console.log('Inicio de sesión exitoso');
      // Manejar el éxito del inicio de sesión, redirigir, etc.
      navigate('/pelis'); // Utiliza navigate en lugar de history.push
    } catch (error) {
      if (error instanceof Error) {
        // Aquí puedes manejar errores específicos de autenticación
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('user not found')) {
          setError('Usuario no encontrado. Verifica tu dirección de correo electrónico.');
        } else if (errorMessage.includes('wrong password')) {
          setError('Contraseña incorrecta. Verifica tu contraseña.');
        } else {
          setError(`Error de inicio de sesión: ${errorMessage} Revisa que tu usuario y email sean correctos`);
        }
      } else {
        // Maneja otros tipos de errores
        setError(`Otro tipo de error: ${error}`);
      }
    }
  };

  return (
    <div className='col-10 col-lg-3 col-md-6 m-auto mt-5 d-flex flex-wrap align-items-center'>
      <div className='container text-center mt-5'><img width="200px" src="../cinetiko.png" alt="CineTiko" /></div>
      <p className='container text-center'>Bienvenido a CineTiko</p>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className='col-12' onSubmit={handleLogin}>
        <label className='col-12'>
          Correo Electrónico:
          <input className='col-12 form-control mb-2'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label className='col-12'>
          Contraseña:
          <input className='col-12 form-control mb2'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className='btn btn-danger mt-4 col-12' type="submit">Iniciar Sesión</button>
      </form>
      <p className='mt-2'>No tienes cuenta registrada en CineTiKo. <a href='/register'>Regístrate</a></p>
    </div>
  );
};

export default Login;
