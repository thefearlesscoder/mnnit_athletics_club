import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_RECORDS = {
  '2024': {
    'Annual Athletic Meet': [
      { event: '100m Sprint (M)', athlete: 'John Doe', value: '10.5s' },
      { event: 'Long Jump (M)', athlete: 'Alex Smith', value: '7.2m' },
    ],
    'Inter-NIT': [
       { event: '4x100 Relay', athlete: 'Team A', value: '42.1s' }
    ]
  },
  '2023': {
    'Annual Athletic Meet': [
      { event: '100m Sprint (F)', athlete: 'Sarah Connor', value: '12.1s' },
      { event: 'Shot Put (M)', athlete: 'Bruce Wayne', value: '14.5m' },
    ]
  }
};

const Records = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedEvent, setSelectedEvent] = useState('Annual Athletic Meet');

  const years = Object.keys(MOCK_RECORDS).sort((a,b) => b - a);
  const eventsForYear = Object.keys(MOCK_RECORDS[selectedYear] || {});
  
  const recordsToDisplay = MOCK_RECORDS[selectedYear]?.[selectedEvent] || [];

  return (
    <div className="page-content">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Official <span style={{ color: 'var(--accent-primary)' }}>Records</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>The highest standards set by our exceptional athletes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Year Select */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {years.map(year => (
            <button 
              key={year}
              onClick={() => { setSelectedYear(year); setSelectedEvent(Object.keys(MOCK_RECORDS[year])[0]); }}
              style={{
                background: selectedYear === year ? 'var(--accent-primary)' : 'transparent',
                color: selectedYear === year ? 'white' : 'var(--text-primary)',
                border: selectedYear === year ? 'none' : '1px solid rgba(0,0,0,0.2)',
                padding: '0.4rem 1.2rem',
                borderRadius: '15px',
                cursor: 'pointer'
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Event Select */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {eventsForYear.map(event => (
            <button 
              key={event}
              onClick={() => setSelectedEvent(event)}
              style={{
                background: selectedEvent === event ? 'rgba(0,0,0,0.05)' : 'transparent',
                color: selectedEvent === event ? 'var(--accent-primary)' : 'var(--text-muted)',
                padding: '0.3rem 1rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: selectedEvent === event ? 'bold' : 'normal'
              }}
            >
              # {event}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={selectedYear + selectedEvent}
        className="glass-card"
        style={{ maxWidth: '800px', margin: '0 auto', padding: '0' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--accent-glow)' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Event</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Athlete</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Record Value</th>
            </tr>
          </thead>
          <tbody>
            {recordsToDisplay.length > 0 ? recordsToDisplay.map((rec, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>{rec.event}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'var(--accent-primary)' }}>{rec.athlete}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{rec.value}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found for this selection.</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>

    </div>
  );
};

export default Records;
