import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const roleColors = { member: '#3b82f6', alumni: '#8b5cf6' };

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

const AdminRequests = ({ authHeaders }) => {
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

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
  }, [authHeaders]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      setActionMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Login Requests</h2>
        <button onClick={fetchRequests} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>
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

      {reqLoading && <p style={{ color: 'var(--text-secondary)' }}>Loading requests…</p>}
      {reqError && <p style={{ color: '#ef4444' }}>⚠️ {reqError}</p>}

      {!reqLoading && !reqError && requests.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
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
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{r.email}</p>
                {r.message && <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.83rem', fontStyle: 'italic' }}>"{r.message}"</p>}
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
};

export default AdminRequests;
