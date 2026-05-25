import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_TEAM = [
  { id: 1, name: "Sarah Connor", role: "Captain", branch: "Computer Science", events: ["100m Sprint"], type: "Member" },
  { id: 2, name: "Dr. Alan Grant", role: "Faculty Incharge", branch: "-", events: [], type: "Faculty" },
  { id: 3, name: "Tom", role: "Head Groundskeeper", branch: "-", events: [], type: "Ground Worker" },
  { id: 4, name: "Jane Smith", role: "Coordinator", branch: "Civil", events: ["4x100m Relay"], type: "Coordinator" }
];

const Team = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Member', 'Coordinator', 'Faculty'];

  const displayedMembers = filter === 'All' 
    ? MOCK_TEAM 
    : MOCK_TEAM.filter(m => m.type === filter);

  return (
    <div className="page-content">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Meet the <span style={{ color: 'var(--accent-primary)' }}>Team</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>The people who make the legacy possible.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? 'var(--accent-primary)' : 'transparent',
              color: filter === cat ? 'white' : 'var(--text-primary)',
              border: filter === cat ? 'none' : '1px solid rgba(0,0,0,0.2)',
              padding: '0.4rem 1.2rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {displayedMembers.map(member => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={member.id} 
            className="glass-card" 
            style={{ textAlign: 'center' }}
          >
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: '#ccc', 
              margin: '0 auto 1rem auto', 
              overflow: 'hidden',
              border: '2px solid var(--accent-primary)'
            }}>
              <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} style={{ width: '100%' }} />
            </div>
            <h3>{member.name}</h3>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{member.role}</p>
            {member.branch !== '-' && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{member.branch}</p>}
            
            {member.events.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {member.events.map(ev => <span key={ev} style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{ev}</span>)}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Team;
