import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    try {
      if (!isEmailValid(email)) {
        setErrorMessage('Por favor, ingresa una dirección de correo electrónico válida.');
        return;
      }

      if (!isPasswordValid(password)) {
        setErrorMessage(
          'La contraseña debe tener al menos 6 caracteres y contener al menos una letra y un número.'
        );
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('La contraseña y la confirmación de la contraseña no coinciden.');
        return;
      }

      const auth = getAuth();

      // Crea el usuario en Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      setSuccessMessage('Registro exitoso, Ya puedes ingresar a CineTiKo. Redirigiendo al Login Page...');
      setTimeout(() => {
        navigate('/'); // Redirige a la raíz del proyecto después del registro exitoso
      }, 3000); // Espera 2 segundos antes de redirigir
    } catch (error: any) {
      setErrorMessage('Error al registrar usuario: ' + error.message);
    }
  };

  return (
    <div className='col-2 m-auto mt-5'>
      <h2 className='mb-2'>Registro</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form>
        <label className='col-12 mb-2'>
          Correo electrónico (Nombre de usuario):
          <input className='col-12 form-control mb-2'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label className='col-12 mb-2'>
          Contraseña:
          <input className='col-12 form-control mb-2'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label className='col-12'>
          Confirmar Contraseña:
          <input  className='col-12 form-control mb-2'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        <button className='btn btn-danger mt-4 col-12' type="button" onClick={handleRegister}>
          Registrar
        </button>
      </form>
      <p className='mt-2'>Ya tienes cuenta?. Inicia Sesión <a href='/'>Login</a></p>
    </div>
  );
};

export default RegisterPage;
