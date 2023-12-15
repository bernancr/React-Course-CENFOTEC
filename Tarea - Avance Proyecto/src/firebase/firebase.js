// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjMEis9hddQrjU7pjayE43_2vKJT8kEBA",
  authDomain: "cinetiko-d7c4e.firebaseapp.com",
  projectId: "cinetiko-d7c4e",
  locationId: "us-central",
  storageBucket: "cinetiko-d7c4e.appspot.com",
  messagingSenderId: "656565418778",
  appId: "1:656565418778:web:608e4fc87d8d91eff28aa3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  console.log('Estado de autenticación cambiado:', user);
});

export { auth };