import React from 'react';
import { AuthProvider } from './pages/Login/AuthProvider';
import RouteFile from './Routes/RouteFile';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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

const App = () => {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <RouteFile />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;