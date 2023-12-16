import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al cerrar sesión:', error.message);
      } else {
        // Manejar otros casos donde error no es una instancia de Error
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  return handleLogout;
};

export default useLogout;
