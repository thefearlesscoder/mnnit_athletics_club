import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminImageUpload from '../components/AdminImageUpload';
import AdminRequests from '../components/admin/AdminRequests';
import AdminEvents from '../components/admin/AdminEvents';
import AdminNotices from '../components/admin/AdminNotices';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';



const roleColors = { member: '#3b82f6', alumni: '#8b5cf6' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.12)',
  background: 'rgba(0,0,0,0.05)',
  color: 'var(--text-primary)',
  width: '100%',
  boxSizing: 'border-box',
  fontSize: '0.9rem',
};

const Badge = ({ label, color }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: `${color}22`,
    color,
    border: `1px solid ${color}55`,
    textTransform: 'capitalize',
  }}>
    {label}
  </span>
);

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [activeTab, setActiveTab] = useState('requests');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch(`${API}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || 'Login failed. Ensure a real admin user exists in MongoDB.');
      }
    } catch {
      setLoginError('Network error — Failed to connect to server.');
    }
  };

  // Auth header helper
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ width: '400px', padding: '2.5rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>M</div>
            <h2>Admin <span style={{ color: 'var(--accent-primary)' }}>Login</span></h2>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
              <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="admin@example.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
              <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            {loginError && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', margin: 0 }}>
                {loginError}
              </p>
            )}
            <button id="admin-login-btn" type="submit" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'requests': return <AdminRequests authHeaders={authHeaders} />;
      case 'event':   return <AdminEvents authHeaders={authHeaders} />;
      case 'notice':  return <AdminNotices authHeaders={authHeaders} />;
      case 'images':  return <AdminImageUpload adminToken={adminToken} />;
      case 'birthday': return <div><h2>Birthday Spotlight</h2><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Select a member to spotlight on the landing page.</p></div>;
      case 'members': return <div><h2>Manage Members</h2><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Member management coming soon. Use Login Requests to approve new members.</p></div>;
      default: return null;
    }
  };

  const navTabs = [
    { id: 'requests', label: '📬 Login Requests' },
    { id: 'event',    label: '🏆 Add Event' },
    { id: 'images',   label: '🖼️ Add Images' },
    { id: 'notice',   label: '📢 Add Notice' },
    { id: 'birthday', label: '🎂 Birthday Spotlight' },
    { id: 'feedback', label: 'Feedbacks'},
    { id: 'members',  label: '👥 Manage Members' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: 'rgba(0,0,0,0.02)', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ padding: '0 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>MAC</div>
          Admin Panel
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {navTabs.map(tab => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.85rem 1.5rem',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--accent-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderRight: activeTab === tab.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </li>
          ))}
        </ul>
        <div style={{ padding: '1.5rem' }}>
          <button onClick={() => { setIsLoggedIn(false); setAdminToken(''); }} style={{ width: '100%', padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeTab}>
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
