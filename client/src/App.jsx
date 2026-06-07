import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import FloatingRequestButton from './components/FloatingRequestButton';
import Home from './pages/Home';
import Alumni from './pages/Alumni';
import Gallery from './pages/Gallery';
import Records from './pages/Records';
import AAM from './pages/AAM';
import Team from './pages/Team';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import MemberEditProfile from './pages/MemberEditProfile';
import Login from './pages/Login';
import Register from './pages/Register';

// Placeholder Pages and Layouts for remaining
const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 MNNIT Athletics Club. All rights reserved.</p>

      <Link to="/memberLogin" className="member-login-btn">
        Member Login
      </Link>
    </footer>
  );
};


const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <FloatingRequestButton />
    <Footer />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/alumni" element={<MainLayout><Alumni /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/records" element={<MainLayout><Records /></MainLayout>} />
        <Route path="/aam" element={<MainLayout><AAM /></MainLayout>} />
        <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/memberLogin" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        {/* Admin and Member Portals */}
        <Route path="/member-portal" element={<MainLayout><MemberEditProfile /></MainLayout>} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
