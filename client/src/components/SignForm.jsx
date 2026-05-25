import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SignForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // mock sign in
    alert('Sign in successful!');
    navigate('/');
  };

  const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.15)',
    background: 'rgba(0,0,0,0.05)',
    color: 'var(--text-primary)',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', margin: '0 auto' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={inputStyle} 
            placeholder="member@mac.com" 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={inputStyle} 
            placeholder="********"
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            border: 'none', 
            background: 'var(--accent-primary)', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            marginTop: '1rem',
            fontSize: '1rem'
          }}
        >
          Sign In
        </button>
      </form>
    </motion.div>
  );
};

export default SignForm;
