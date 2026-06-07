import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const SignForm = () => {
  const [role, setRole] = useState('normal user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      if (role === 'normal user') {
        endpoint = `${API}/auth/normal_user/login`;
      } else {
        endpoint = `${API}/auth/login`;
      }

      const response = await axios.post(endpoint, { email, password });
      
      let userData = null;
      let token = null;

      if (role === 'normal user') {
        userData = response.data.user;
        token = response.data.token;
      } else {
        // member response has user data spread out
        userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          batch: response.data.batch,
          branch: response.data.branch,
          registrationNumber: response.data.registrationNumber,
          phoneNumber: response.data.phoneNumber,
        };
        token = response.data.token;
      }

      dispatch(loginSuccess({ user: userData, token}));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setRole('normal user')}
          style={{
            background: role === 'normal user' ? 'var(--accent-primary)' : 'transparent',
            color: role === 'normal user' ? 'white' : 'var(--text-primary)',
            border: role === 'normal user' ? 'none' : '1px solid rgba(0,0,0,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            flex: 1
          }}
        >
          Normal User
        </button>
        <button
          type="button"
          onClick={() => setRole('member')}
          style={{
            background: role === 'member' ? 'var(--accent-primary)' : 'transparent',
            color: role === 'member' ? 'white' : 'var(--text-primary)',
            border: role === 'member' ? 'none' : '1px solid rgba(0,0,0,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            flex: 1
          }}
        >
          Member
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={inputStyle} 
            placeholder={role === 'member' ? 'member@mac.com' : 'user@example.com'} 
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
          disabled={loading}
          style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            border: 'none', 
            background: loading ? '#ccc' : 'var(--accent-primary)', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            marginTop: '1rem',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </motion.div>
  );
};

export default SignForm;
