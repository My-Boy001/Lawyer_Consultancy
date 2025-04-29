
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LegalBookPage from './pages/LegalBookPage.jsx';
import ScheduleMeetPage from './pages/ScheduleMeetPage.jsx';
import ConsultationPage from './pages/ConsultationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
// import './App.css'; // We'll create this file for global theme styles

function App() {
  return (
    <div className="app navy-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal-book" element={<LegalBookPage />} />
            <Route path="/schedule-meet" element={<ScheduleMeetPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/chat" element={<ChatPage />} />
            
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App