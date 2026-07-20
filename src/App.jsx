import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './utils/firebase';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Chatbot from './components/Chatbot';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loaded, setLoaded] = useState(false);
  const handleFinish = React.useCallback(() => setLoaded(true), []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!loaded && <LoadingScreen onFinish={handleFinish} />}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Chatbot />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
