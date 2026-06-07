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

const AdminHighlights = ({ authHeaders }) => {
  const [activeSubTab, setActiveSubTab] = useState('add');
  const [highlights, setHighlights] = useState([]);
  
  // Add State
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [description, setDescription] = useState('');

  // Edit State
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchHighlights = useCallback(async () => {
    try {
      const res = await fetch(`${API}/content/highlights`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setHighlights(data);
    } catch (err) {
      console.error("Failed to fetch highlights:", err);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (activeSubTab === 'edit' || activeSubTab === 'remove') {
      fetchHighlights();
    }
  }, [activeSubTab, fetchHighlights]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/admin/highlight`, { 
        method: 'POST', 
        headers: authHeaders, 
        body: JSON.stringify({ title, youtubeUrl, description }) 
      });
      const data = await res.json();
      if (res.ok) { 
        setTitle(''); 
        setYoutubeUrl(''); 
        setDescription(''); 
        alert('Highlight added!'); 
      } else {
        alert(data.message);
      }
    } catch { 
      alert('Error adding highlight'); 
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const res = await fetch(`${API}/admin/highlight/edit/${editId}`, { 
        method: 'PUT', 
        headers: authHeaders, 
        body: JSON.stringify({ title: editTitle, youtubeUrl: editYoutubeUrl, description: editDescription }) 
      });
      const data = await res.json();
      if (res.ok) { 
        setEditId('');
        setEditTitle('');
        setEditYoutubeUrl('');
        setEditDescription('');
        alert('Highlight updated!');
        fetchHighlights();
      } else {
        alert(data.message);
      }
    } catch { 
      alert('Error updating highlight'); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this highlight?")) return;
    try {
      const res = await fetch(`${API}/admin/highlight/delete/${id}`, { 
        method: 'POST', 
        headers: authHeaders 
      });
      if (res.ok) {
        alert('Highlight deleted!');
        fetchHighlights();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch {
      alert('Error deleting highlight');
    }
  };

  const selectForEdit = (highlight) => {
    setEditId(highlight._id);
    setEditTitle(highlight.title);
    setEditYoutubeUrl(highlight.youtubeUrl);
    setEditDescription(highlight.description || '');
  };

  return (
    <div>
      <h2>Manage Highlights (YouTube Videos)</h2>
      
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
            {tab} Highlight
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '1rem' }}>
        
        {activeSubTab === 'add' && (
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Add New YouTube Highlight</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. MNNIT Athletics Meet Highlights" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>YouTube URL</label>
              <input required type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="e.g. https://www.youtube.com/watch?v=..." style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Description (Optional)</label>
              <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add Highlight</button>
          </form>
        )}

        {activeSubTab === 'edit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Select a Highlight to Edit</h3>
            {!editId ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {highlights.map(highlight => (
                  <li key={highlight._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{highlight.title}</strong><br/>
                      <a href={highlight.youtubeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{highlight.youtubeUrl}</a>
                    </div>
                    <button onClick={() => selectForEdit(highlight)} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                  </li>
                ))}
                {highlights.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No highlights found.</p>}
              </ul>
            ) : (
              <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>Editing Highlight</h4>
                  <button type="button" onClick={() => setEditId('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Title</label>
                  <input required value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>YouTube URL</label>
                  <input required type="url" value={editYoutubeUrl} onChange={e => setEditYoutubeUrl(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Description (Optional)</label>
                  <textarea rows="3" value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" style={{ padding: '0.85rem', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
              </form>
            )}
          </div>
        )}

        {activeSubTab === 'remove' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Delete Highlight</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {highlights.map(highlight => (
                <li key={highlight._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{highlight.title}</strong><br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{highlight.youtubeUrl}</span>
                  </div>
                  <button onClick={() => handleDelete(highlight._id)} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </li>
              ))}
              {highlights.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No highlights found.</p>}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminHighlights;
