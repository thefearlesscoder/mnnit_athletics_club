import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const currentYear = new Date().getFullYear();

const years = [];
for (let year = 2016; year <= currentYear + 3; year++) {
  years.push(year);
}

const FloatingRequestButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await axios.post(`${API}/request`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', batch: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || err.message || 'Something went wrong.');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStatus(null);
    setErrorMsg('');
  };

  const inputStyle = {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(0,0,0,0.25)',
    color: 'white',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
    outline: 'none',
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        <button
          id="floating-request-btn"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            padding: '1rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.45)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            fontSize: '0.95rem',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(59, 130, 246, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.45)';
          }}
        >
          <span>✍️</span> Request Profile Edit
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.82)',
              zIndex: 1001,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '430px', position: 'relative', padding: '2rem' }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}
                aria-label="Close"
              >✖</button>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '1rem 0' }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ color: '#10b981', marginBottom: '0.75rem' }}>Request Sent!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Your request has been submitted. The admin will review it and you'll receive an email once approved.
                  </p>
                  <button
                    onClick={handleClose}
                    style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 style={{ marginBottom: '0.4rem', color: 'var(--text-light)' }}>Request Profile Access</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                    Current team members &amp; alumni can request access to add or edit their profile.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Full Name *</label>
                      <input
                        id="req-name"
                        required
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Email Address *</label>
                      <input
                        id="req-email"
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>I am a...</label>
                      <select
                        id="req-role"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        style={{ ...inputStyle, background: 'rgba(0,0,0,0.35)' }}
                      >
                        <option value="member">Current Team Member</option>
                        <option value="alumni">Alumni</option>
                      </select>
                    </div> */}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                        Batch
                      </label>

                      <select
                        id="req-batch"
                        required
                        value={formData.batch}
                        onChange={(e) =>
                          setFormData({ ...formData, batch: e.target.value })
                        }
                        style={inputStyle}
                      >
                        <option value="">Select Passout Year</option>

                        {Array.from(
                          { length: new Date().getFullYear() + 2 - 2016 + 1 },
                          (_, i) => new Date().getFullYear() + 2 - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>About You/ Any message</label>
                      <textarea
                        id="req-message"
                        rows="2"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="e.g. Batch 2023, 100m sprinter"
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>

                    {status === 'error' && (
                      <p style={{ color: '#ef4444', fontSize: '0.88rem', margin: 0, padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)' }}>
                        ⚠️ {errorMsg}
                      </p>
                    )}

                    <button
                      id="req-submit"
                      type="submit"
                      disabled={status === 'loading'}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: status === 'loading' ? 'rgba(59,130,246,0.5)' : 'var(--accent-primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        marginTop: '0.25rem',
                        fontSize: '0.95rem',
                        transition: 'background 0.2s',
                      }}
                    >
                      {status === 'loading' ? 'Sending…' : 'Send Request'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingRequestButton;
