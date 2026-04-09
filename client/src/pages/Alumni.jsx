import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_ALUMNI = [
  { id: 1, name: "Sarah Connor", role: "Captain", batch: "2023", branch: "Computer Science", events: ["100m Sprint", "Long Jump"], achievements: ["Gold in 100m AAM 2023"], linkedIn: "#", instagram: "#" },
  { id: 2, name: "John Doe", role: "Vice Captain", batch: "2023", branch: "Mechanical", events: ["Shot Put"], achievements: ["Silver in Shot Put"], linkedIn: "#", instagram: "#" },
  { id: 3, name: "Jane Smith", role: "Member", batch: "2022", branch: "Civil", events: ["400m hurdles"], achievements: ["Participant AAM 2022"], linkedIn: "#", instagram: "#" }
];

const Alumni = () => {
  const [selectedBatch, setSelectedBatch] = useState('Default');

  const batches = ['Default', '2023', '2022', '2021'];
  
  const displayedAlumni = selectedBatch === 'Default' 
    ? MOCK_ALUMNI.filter(a => a.role === 'Captain')
    : MOCK_ALUMNI.filter(a => a.batch === selectedBatch);

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Our Legacy: <span style={{ color: 'var(--accent-primary)' }}>The Alumni</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Honoring the pillars of the MNNIT Athletics Club.</p>
        </div>

        {/* Batch Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          {batches.map(batch => (
            <button 
              key={batch}
              onClick={() => setSelectedBatch(batch)}
              style={{
                background: selectedBatch === batch ? 'var(--accent-primary)' : 'transparent',
                color: selectedBatch === batch ? 'white' : 'var(--text-light)',
                border: '1px solid var(--accent-primary)',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {batch === 'Default' ? 'Captains' : `Batch '${batch.slice(2)}`}
            </button>
          ))}
        </div>

        {/* Major Achievements (Optional display if batch selected) */}
        {selectedBatch !== 'Default' && (
          <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
            <h3>Batch {selectedBatch} Major Achievements</h3>
            <p style={{ color: 'var(--text-muted)' }}>Secured overall Top 3 finish in Inter-NIT Sports Meet {selectedBatch}.</p>
          </div>
        )}

        {/* Alumni Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {displayedAlumni.map(alump => (
            <motion.div 
              key={alump.id} 
              className="glass-card" 
              whileHover={{ y: -5 }}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ 
                height: '100px', 
                background: 'linear-gradient(45deg, var(--bg-darker), var(--accent-primary))',
                margin: '-1.5rem -1.5rem 1.5rem -1.5rem'
              }}></div>
              
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#ccc', 
                marginTop: '-55px', 
                border: '4px solid var(--bg-dark)',
                marginBottom: '1rem'
              }}>
                <img src={`https://ui-avatars.com/api/?name=${alump.name}&background=random`} alt={alump.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              </div>

              <h3>{alump.name}</h3>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{alump.role}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{alump.branch} | Bath {alump.batch}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>Events:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                  {alump.events.map(ev => <span key={ev} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>{ev}</span>)}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>Achievements:</strong>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {alump.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
                 <a href={alump.linkedIn} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>LinkedIn</a>
                 <a href={alump.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Instagram</a>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default Alumni;
