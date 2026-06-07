import React, { useState } from 'react';

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

const AdminEvents = ({ authHeaders }) => {
  const [eventName, setEventName] = useState('');
  const [eventYear, setEventYear] = useState('');
  const [events, setEvents] = useState([]);

  return (
    <div>
      <h2>Manage Events</h2>
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <form onSubmit={async e => {
          e.preventDefault();
          try {
            const res = await fetch(`${API}/admin/event`, { 
              method: 'POST', 
              headers: authHeaders, 
              body: JSON.stringify({ name: eventName, year: Number(eventYear) }) 
            });
            const data = await res.json();
            if (res.ok) { 
              setEvents(prev => [...prev, data]); 
              setEventName(''); 
              setEventYear(''); 
              alert('Event added!'); 
            } else {
              alert(data.message);
            }
          } catch { 
            alert('Error adding event'); 
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '2rem' }}>
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
};

export default AdminEvents;
