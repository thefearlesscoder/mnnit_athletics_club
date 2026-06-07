import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';



const Team = () => {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/content/members`);
        setMembers(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load team members");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const categories = ['All', 'Coordinator'];

  // Map database roles to team types/roles
  const mappedDbMembers = members.map(m => ({
    _id: m._id,
    name: m.name,
    isCaptain: m.isCaptain,
    role: m.isCaptain ? 'Coordinator' : 'Member',
    branch: m.branch || '-',
    events: m.events || [],
    type: m.isCaptain ? 'Coordinator' : 'Member',
    profilePhoto: m.profilePhoto
  }));

  const allMembers = [...mappedDbMembers];

  const displayedMembers = filter === 'All' 
    ? allMembers 
    : allMembers.filter(m => m.type === filter);

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Loading team members...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {displayedMembers.map(member => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={member._id} 
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
                <img 
                  src={member.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                  alt={member.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <h3>{member.isCaptain ? `(c) ${member.name}` : member.name}</h3>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{member.role}</p>
              {member.branch !== '-' && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{member.branch}</p>}
              
              {member.events && member.events.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {member.events.map(ev => (
                    <span key={ev} style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Team;
