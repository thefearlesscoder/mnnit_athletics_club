import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('2016');
  const [viewMode, setViewMode] = useState('batch'); // 'batch' | 'captains'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const [alumniRes, membersRes] = await Promise.all([
          axios.get(`${API}/content/alumni`),
          axios.get(`${API}/content/members`)
        ]);
        setAlumni(alumniRes.data);
        setMembers(membersRes.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load alumni data");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumniData();
  }, []);

  // Generate batch dropdown options (2016 up to year before current)
  const batchOptions = [];
  for (let year = currentYear - 1; year >= 2016; year--) {
    batchOptions.push(year.toString());
  }

  const allUsers = [...alumni, ...members];

  // Filtering:
  // - Batch mode: only alumni whose batch matches selectedBatch
  // - Captains mode: all captains (from both alumni and active members) from 2016 to currentYear
  const displayedAlumni = viewMode === 'batch'
    ? alumni.filter(a => a.batch === selectedBatch)
    : allUsers.filter(u => u.isCaptain && u.batch && Number(u.batch) >= 2016 && Number(u.batch) <= currentYear);

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Our Legacy: <span style={{ color: 'var(--accent-primary)' }}>The Alumni</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Honoring the pillars of the MNNIT Athletics Club.</p>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setViewMode('batch')}
            style={{
              background: viewMode === 'batch' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'batch' ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--accent-primary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            By Batch
          </button>
          <button 
            onClick={() => setViewMode('captains')}
            style={{
              background: viewMode === 'captains' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'captains' ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--accent-primary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Captains
          </button>
        </div>

        {/* Batch Selector Dropdown */}
        {viewMode === 'batch' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Select Batch:</label>
            <select 
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {batchOptions.map(batch => (
                <option key={batch} value={batch} style={{ background: 'var(--bg-primary)' }}>Batch {batch}</option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Achievements Banner */}
        {viewMode === 'batch' && displayedAlumni.length > 0 && (
          <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
            <h3>Batch {selectedBatch} Legacy</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Champions and pathbreakers who represented MNNIT in the {selectedBatch} seasons.
            </p>
          </div>
        )}

        {/* Loading / Error States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>Loading alumni database...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
            <p>⚠️ {error}</p>
          </div>
        ) : displayedAlumni.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>No records found for this selection.</p>
          </div>
        ) : (
          /* Alumni / Captains Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {displayedAlumni.map(alump => (
              <motion.div 
                key={alump._id} 
                className="glass-card" 
                whileHover={{ y: -5 }}
                style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ 
                  height: '100px', 
                  background: 'linear-gradient(45deg, var(--bg-secondary), var(--accent-primary))',
                  margin: '-1.5rem -1.5rem 1.5rem -1.5rem'
                }}></div>
                
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: '#ccc', 
                  marginTop: '-55px', 
                  border: '4px solid var(--bg-primary)',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={alump.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(alump.name)}&background=random`} 
                    alt={alump.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                <h3>{alump.isCaptain ? `(c) ${alump.name}` : alump.name}</h3>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {alump.isCaptain ? 'Captain' : (alump.role === 'admin' ? 'Coordinator' : 'Member')}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {alump.branch || '-'} | Batch {alump.batch || '-'}
                </p>
                
                {alump.events && alump.events.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Events:</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      {alump.events.map(ev => (
                        <span key={ev} style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {alump.achievements && alump.achievements.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Achievements:</strong>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.3rem 0' }}>
                      {alump.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
                  {alump.linkedIn && (
                    <a href={alump.linkedIn} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      LinkedIn
                    </a>
                  )}
                  {alump.instagram && (
                    <a href={alump.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                      Instagram
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default Alumni;
