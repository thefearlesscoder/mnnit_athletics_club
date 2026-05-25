import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

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

const MemberEditProfile = () => {
  const [tokenStatus, setTokenStatus] = useState('verifying'); // 'verifying' | 'valid' | 'invalid'
  const [sessionToken, setSessionToken] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const [saveMsg, setSaveMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    batch: '',
    events: '',
    achievements: '',
    linkedIn: '',
    instagram: '',
    birthday: '',
    profilePhoto: '',
  });

  const hasFetched = useRef(false);

  // ── On mount: read ?token= from URL and verify it ─────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get('token');

    if (!rawToken) {
      setTokenStatus('invalid');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verify = async () => {
      try {
        const res = await fetch(`${API}/member/verify-token?token=${rawToken}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setSessionToken(data.token);
        // Pre-fill form with existing profile data
        const u = data.user;
        setFormData({
          name: u.name || '',
          branch: u.branch || '',
          batch: u.batch || '',
          events: Array.isArray(u.events) ? u.events.join(', ') : (u.events || ''),
          achievements: Array.isArray(u.achievements) ? u.achievements.join(', ') : (u.achievements || ''),
          linkedIn: u.linkedIn || '',
          instagram: u.instagram || '',
          birthday: u.birthday || '',
          profilePhoto: u.profilePhoto || '',
        });
        setTokenStatus('valid');

        // Clean token from URL without page reload
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (err) {
        console.error('[verify-token]', err.message);
        setTokenStatus('invalid');
      }
    };

    verify();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveMsg('');
    try {
      const res = await fetch(`${API}/member/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSaveStatus('saved');
      setSaveMsg('Your profile has been updated successfully! 🎉');
    } catch (err) {
      setSaveStatus('error');
      setSaveMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (tokenStatus === 'verifying') {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
          <p style={{ color: 'var(--text-secondary)' }}>Verifying your access link…</p>
        </motion.div>
      </div>
    );
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ textAlign: 'center', maxWidth: '440px', padding: '2.5rem' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h3 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>Link Expired or Invalid</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            This access link has either expired (links are valid for 2 hours) or is not valid.
            Please request a new link from the homepage.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.8rem',
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            ← Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  if (saveStatus === 'saved') {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ textAlign: 'center', maxWidth: '440px', padding: '2.5rem' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ color: '#10b981', marginBottom: '0.75rem' }}>Profile Updated!</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{saveMsg}</p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 1.8rem',
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            ← Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  // ── Edit Form ─────────────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '620px', padding: '2.5rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
          Edit <span style={{ color: 'var(--accent-primary)' }}>Profile</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          All fields except Name are optional. Your profile will be visible on the website.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {/* Row: Name + Batch */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Full Name *</label>
              <input id="edit-name" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Batch (Year)</label>
              <input id="edit-batch" name="batch" placeholder="e.g. 2024" value={formData.batch} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Row: Branch + Birthday */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Branch / Department</label>
              <input id="edit-branch" name="branch" placeholder="e.g. Computer Science" value={formData.branch} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Birthday</label>
              <input id="edit-birthday" type="date" name="birthday" value={formData.birthday} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Events Participated (comma separated)</label>
            <input id="edit-events" name="events" placeholder="e.g. 100m Sprint, Long Jump, 4×100m Relay" value={formData.events} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Achievements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Achievements (comma separated)</label>
            <textarea
              id="edit-achievements"
              name="achievements"
              rows="3"
              placeholder="e.g. Gold in 100m AAM 2023, Inter-NIT Silver 2022"
              value={formData.achievements}
              onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Row: LinkedIn + Instagram */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>LinkedIn URL</label>
              <input id="edit-linkedin" name="linkedIn" type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedIn} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Instagram URL</label>
              <input id="edit-instagram" name="instagram" type="url" placeholder="https://instagram.com/..." value={formData.instagram} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Save Error */}
          {saveStatus === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.88rem', background: 'rgba(239,68,68,0.1)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', margin: 0 }}>
              ⚠️ {saveMsg}
            </p>
          )}

          <button
            id="edit-save-btn"
            type="submit"
            disabled={saveStatus === 'saving'}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: saveStatus === 'saving' ? 'var(--accent-glow)' : 'var(--accent-primary)',
              color: 'white',
              fontWeight: 'bold',
              cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              fontSize: '1rem',
              transition: 'background 0.2s',
            }}
          >
            {saveStatus === 'saving' ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default MemberEditProfile;
