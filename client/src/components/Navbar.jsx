import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>MAC</div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '1px' }}>MNNIT Athletics</span>
        </Link>
      </div>
      <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/alumni" className="nav-item">Alumni</Link>
        <Link to="/gallery" className="nav-item">Gallery</Link>
        <Link to="/records" className="nav-item">Records</Link>
        <Link to="/team" className="nav-item">Our Team</Link>
        <Link to="/aam" className="nav-item" style={{ 
          background: 'var(--accent-glow)', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          border: '1px solid var(--accent-primary)',
          color: 'var(--accent-primary)'
        }}>AAM 2024</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
        <Link to="/login" className="nav-item">Login</Link>
        <Link to="/register" className="nav-item">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
