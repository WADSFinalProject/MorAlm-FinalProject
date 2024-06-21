import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Login from './components/LoginPage/Login';
import Register from './components/RegisterPage/Register';
import Home from '../Moralm-XYZ-Final-main/src/Home';
import CentraApp from '../Centra-FE-Final/src/App'; // Adjust the path if needed
import HarbourApp from '../WADS-MoralmHarbor-Final/src/App';
import AdminApp from '../MoralmAdmin/src/App';

function RouterComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        if (email.includes('@admin.com')) {
            navigate('/admin');
        } else if (email.includes('@centra.com')) {
            navigate('/centra');
        } else if (email.includes('@xyz.com')) {
            navigate('/xyz');
        } else if (email.includes('@harbor.com')){
            navigate('/harbor');
        }
      }
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/centra/*" element={<CentraApp />} />
      <Route path="/xyz" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/harbor" element={<HarbourApp />}/>
      <Route path="/admin/*" element={<AdminApp />}/>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  );
}

export default App;
