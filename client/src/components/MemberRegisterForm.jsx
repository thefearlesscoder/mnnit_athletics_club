import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const MemberRegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', branch: '', batch: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
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

  const currentYear = new Date().getFullYear();

  const years = [];
  for (let year = 2016; year <= currentYear + 3; year++) {
    years.push(year);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', margin: '0 auto' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Join as Member
      </h2>
      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            style={inputStyle}
            placeholder="John Doe"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            style={inputStyle}
            placeholder="member@mac.com"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
            style={inputStyle}
            placeholder="********"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Branch</label>
          <input
            type="text"
            value={formData.branch}
            onChange={e => setFormData({ ...formData, branch: e.target.value })}
            style={inputStyle}
            placeholder="Civil Eng"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Batch
          </label>

          <select
            value={formData.batch}
            onChange={(e) =>
              setFormData({ ...formData, batch: e.target.value })
            }
            style={inputStyle}
          >
            <option value="">Select Passout Year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
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
          {loading ? 'Submitting...' : 'Register as Member'}
        </button>
      </form>
    </motion.div>
  );
};

export default MemberRegisterForm;
