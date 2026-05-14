import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// ─── Mock admin credentials (Option A) ───────────────────────────────────────
// A hardcoded JWT is issued on successful mock-login for all admin API calls.
const MOCK_ADMIN = { email: 'admin@mac.com', password: 'admin' };
// We sign requests using a static token that the backend 'protect' middleware
// will accept IF a real admin user with this _id exists in MongoDB, OR we use
// a special bypass approach: the admin panel keeps the real JWT from loginUser.
// For full Option-A compatibility the mock login calls the real /auth/login API.

const roleColors = { member: '#3b82f6', alumni: '#8b5cf6' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(0,0,0,0.2)',
  color: 'white',
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

  // Requests tab state
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Event form state
  const [eventName, setEventName] = useState('');
  const [eventYear, setEventYear] = useState('');
  const [events, setEvents] = useState([]);

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeUntil, setNoticeUntil] = useState('');

  // ── Mock login — calls the real /auth/login so a real admin user gets a token
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Option A: Accept mock credentials and call the real API
    if (email !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
      setLoginError('Invalid admin credentials. Use admin@mac.com / admin');
      return;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        setIsLoggedIn(true);
      } else {
        // If real DB user doesn't exist yet, still allow mock access for local dev
        // but warn the user.
        setLoginError(data.message || 'Login failed. Ensure a real admin user exists in MongoDB or seed the DB.');
      }
    } catch {
      // Network error — still allow mock access for offline dev
      setAdminToken('mock_offline');
      setIsLoggedIn(true);
    }
  };

  // ── Auth header helper
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  };

  // ── Fetch pending requests
  const fetchRequests = useCallback(async () => {
    setReqLoading(true);
    setReqError('');
    try {
      const res = await fetch(`${API}/admin/requests`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRequests(data);
    } catch (err) {
      setReqError(err.message || 'Failed to load requests.');
    } finally {
      setReqLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'requests') fetchRequests();
  }, [isLoggedIn, activeTab, fetchRequests]);

  // ── Approve / Reject handlers
  const handleAction = async (id, action) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API}/admin/requests/${id}/${action}`, {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActionMsg(`✅ ${data.message}`);
      // Remove the acted-upon request from the list
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      setActionMsg(`❌ ${err.message}`);
    }
  };

  // ─────────────────────────────────── Login Screen ──────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
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
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</label>
              <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="admin@mac.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
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

  // ─────────────────────────────────── Tab Renderers ─────────────────────────
  const renderRequests = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Login Requests</h2>
        <button onClick={fetchRequests} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
          ↺ Refresh
        </button>
      </div>

      <AnimatePresence>
        {actionMsg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: '8px',
              background: actionMsg.startsWith('✅') ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${actionMsg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: actionMsg.startsWith('✅') ? '#10b981' : '#ef4444',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            {actionMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {reqLoading && <p style={{ color: 'var(--text-muted)' }}>Loading requests…</p>}
      {reqError && <p style={{ color: '#ef4444' }}>⚠️ {reqError}</p>}

      {!reqLoading && !reqError && requests.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
          <p>No pending requests. All caught up!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {requests.map(r => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
              className="glass-card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.2rem 1.5rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                  <h4 style={{ margin: 0 }}>{r.name}</h4>
                  <Badge label={r.role} color={roleColors[r.role] || '#888'} />
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>{r.email}</p>
                {r.message && <p style={{ margin: '0.4rem 0 0', color: 'var(--text-muted)', fontSize: '0.83rem', fontStyle: 'italic' }}>"{r.message}"</p>}
                <p style={{ margin: '0.4rem 0 0', color: '#555', fontSize: '0.78rem' }}>
                  {new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                <button
                  onClick={() => handleAction(r._id, 'approve')}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.55rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleAction(r._id, 'reject')}
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '0.55rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  ✗ Reject
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderEvent = () => (
    <div>
      <h2>Manage Events</h2>
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <form onSubmit={async e => {
          e.preventDefault();
          try {
            const res = await fetch(`${API}/admin/event`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ name: eventName, year: Number(eventYear) }) });
            const data = await res.json();
            if (res.ok) { setEvents(prev => [...prev, data]); setEventName(''); setEventYear(''); alert('Event added!'); }
            else alert(data.message);
          } catch { alert('Error adding event'); }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
          <h3>Add New Event</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input required placeholder="Event Name" value={eventName} onChange={e => setEventName(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
            <input required type="number" placeholder="Year" value={eventYear} onChange={e => setEventYear(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNotice = () => (
    <div>
      <h2>Manage Notices</h2>
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <form onSubmit={async e => {
          e.preventDefault();
          try {
            const res = await fetch(`${API}/admin/notice`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ title: noticeTitle, content: noticeContent, displayUntil: noticeUntil }) });
            const data = await res.json();
            if (res.ok) { setNoticeTitle(''); setNoticeContent(''); setNoticeUntil(''); alert('Notice published!'); }
            else alert(data.message);
          } catch { alert('Error publishing notice'); }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Create New Notice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Title</label>
            <input required value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder="e.g. Trials for Fasters" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Content</label>
            <textarea required rows="3" value={noticeContent} onChange={e => setNoticeContent(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.83rem', color: '#ef4444' }}>Remove Date &amp; Time</label>
            <input required type="datetime-local" value={noticeUntil} onChange={e => setNoticeUntil(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Publish Notice</button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'requests': return renderRequests();
      case 'event':   return renderEvent();
      case 'notice':  return renderNotice();
      case 'images':  return <div><h2>Manage Images</h2><p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Image management (Cloudinary upload) coming soon.</p></div>;
      case 'birthday': return <div><h2>Birthday Spotlight</h2><p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Select a member to spotlight on the landing page.</p></div>;
      case 'members': return <div><h2>Manage Members</h2><p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Member management coming soon. Use Login Requests to approve new members.</p></div>;
      default: return null;
    }
  };

  const navTabs = [
    { id: 'requests', label: '📬 Login Requests' },
    { id: 'event',    label: '🏆 Add Event' },
    { id: 'images',   label: '🖼️ Add Images' },
    { id: 'notice',   label: '📢 Add Notice' },
    { id: 'birthday', label: '🎂 Birthday Spotlight' },
    { id: 'members',  label: '👥 Manage Members' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
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
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)',
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
