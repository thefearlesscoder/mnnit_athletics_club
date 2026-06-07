import React, { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

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

const AdminNotices = ({ authHeaders }) => {
  const [activeSubTab, setActiveSubTab] = useState('add');
  const [notices, setNotices] = useState([]);
  
  // Add Notice State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeUntil, setNoticeUntil] = useState('');

  // Edit Notice State
  const [editNoticeId, setEditNoticeId] = useState('');
  const [editNoticeTitle, setEditNoticeTitle] = useState('');
  const [editNoticeContent, setEditNoticeContent] = useState('');
  const [editNoticeUntil, setEditNoticeUntil] = useState('');

  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/notices`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (activeSubTab === 'edit' || activeSubTab === 'remove') {
      fetchNotices();
    }
  }, [activeSubTab, fetchNotices]);

  const handleAddNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/admin/notice`, { 
        method: 'POST', 
        headers: authHeaders, 
        body: JSON.stringify({ title: noticeTitle, content: noticeContent, displayUntil: noticeUntil }) 
      });
      const data = await res.json();
      if (res.ok) { 
        setNoticeTitle(''); 
        setNoticeContent(''); 
        setNoticeUntil(''); 
        alert('Notice published!'); 
      } else {
        alert(data.message);
      }
    } catch { 
      alert('Error publishing notice'); 
    }
  };

  const handleEditNotice = async (e) => {
    e.preventDefault();
    if (!editNoticeId) return;
    try {
      const res = await fetch(`${API}/admin/notice/edit/${editNoticeId}`, { 
        method: 'PUT', 
        headers: authHeaders, 
        body: JSON.stringify({ title: editNoticeTitle, content: editNoticeContent, displayUntil: editNoticeUntil }) 
      });
      const data = await res.json();
      if (res.ok) { 
        setEditNoticeId('');
        setEditNoticeTitle('');
        setEditNoticeContent('');
        setEditNoticeUntil('');
        alert('Notice updated!');
        fetchNotices();
      } else {
        alert(data.message);
      }
    } catch { 
      alert('Error updating notice'); 
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`${API}/admin/notice/delete/${id}`, { 
        method: 'POST', 
        headers: authHeaders 
      });
      if (res.ok) {
        alert('Notice deleted!');
        fetchNotices();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch {
      alert('Error deleting notice');
    }
  };

  const selectNoticeForEdit = (notice) => {
    setEditNoticeId(notice._id);
    setEditNoticeTitle(notice.title);
    setEditNoticeContent(notice.content);
    if (notice.displayUntil) {
      const dateObj = new Date(notice.displayUntil);
      const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
      const localISOTime = (new Date(dateObj - tzoffset)).toISOString().slice(0, 16);
      setEditNoticeUntil(localISOTime);
    }
  };

  return (
    <div>
      <h2>Manage Notices</h2>
      
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
        {['add', 'edit', 'remove'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              border: activeSubTab === tab ? 'none' : '1px solid rgba(0,0,0,0.15)',
              background: activeSubTab === tab ? 'var(--accent-primary)' : 'transparent',
              color: activeSubTab === tab ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === tab ? 'bold' : 'normal',
              textTransform: 'capitalize'
            }}
          >
            {tab} Notice
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '1rem' }}>
        
        {activeSubTab === 'add' && (
          <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Create New Notice</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Title</label>
              <input required value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder="e.g. Trials for Fasters" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Content</label>
              <textarea required rows="3" value={noticeContent} onChange={e => setNoticeContent(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: '#ef4444' }}>Remove Date &amp; Time</label>
              <input required type="datetime-local" value={noticeUntil} onChange={e => setNoticeUntil(e.target.value)} style={inputStyle} />
            </div>
            <button type="submit" style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Publish Notice</button>
          </form>
        )}

        {activeSubTab === 'edit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Select a Notice to Edit</h3>
            {!editNoticeId ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notices.map(notice => (
                  <li key={notice._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{notice.title}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Until: {new Date(notice.displayUntil).toLocaleString()}</span>
                    </div>
                    <button onClick={() => selectNoticeForEdit(notice)} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                  </li>
                ))}
                {notices.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No notices found.</p>}
              </ul>
            ) : (
              <form onSubmit={handleEditNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Editing Notice</h4>
                  <button type="button" onClick={() => setEditNoticeId('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Title</label>
                  <input required value={editNoticeTitle} onChange={e => setEditNoticeTitle(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Content</label>
                  <textarea required rows="3" value={editNoticeContent} onChange={e => setEditNoticeContent(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: '#ef4444' }}>Remove Date &amp; Time</label>
                  <input required type="datetime-local" value={editNoticeUntil} onChange={e => setEditNoticeUntil(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" style={{ padding: '0.85rem', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
              </form>
            )}
          </div>
        )}

        {activeSubTab === 'remove' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Delete Notice</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notices.map(notice => (
                <li key={notice._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{notice.title}</strong><br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notice.content}</span>
                  </div>
                  <button onClick={() => handleDeleteNotice(notice._id)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </li>
              ))}
              {notices.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No notices found.</p>}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminNotices;
