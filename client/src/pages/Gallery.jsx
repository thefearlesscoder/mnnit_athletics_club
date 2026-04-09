import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_EVENTS = {
  '2024': ['Annual Athletic Meet', 'Inter-NIT Prep', 'Marathon'],
  '2023': ['Annual Athletic Meet', 'Cross Country'],
  '2022': ['Annual Athletic Meet']
};

const MOCK_PHOTOS = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  url: `https://images.unsplash.com/photo-1552674605-15c2145bc118?auto=format&fit=crop&w=400&q=70&random=${i}`,
  caption: `Event Snapshot ${i + 1}`
}));

const Gallery = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedEvent, setSelectedEvent] = useState('Annual Athletic Meet');
  const [selectedImage, setSelectedImage] = useState(null);

  const years = Object.keys(MOCK_EVENTS).sort((a,b) => b - a);

  return (
    <div className="page-content">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Moments in <span style={{ color: 'var(--accent-primary)' }}>Motion</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Capturing the sweat, the glory, and the spirit.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Year Select */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {years.map(year => (
            <button 
              key={year}
              onClick={() => { setSelectedYear(year); setSelectedEvent(MOCK_EVENTS[year][0]); }}
              style={{
                background: selectedYear === year ? 'var(--accent-primary)' : 'transparent',
                color: selectedYear === year ? 'white' : 'var(--text-light)',
                border: selectedYear === year ? 'none' : '1px solid rgba(255,255,255,0.2)',
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
          {MOCK_EVENTS[selectedYear].map(event => (
            <button 
              key={event}
              onClick={() => setSelectedEvent(event)}
              style={{
                background: selectedEvent === event ? 'rgba(255,255,255,0.1)' : 'transparent',
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

      {/* Grid */}
      <motion.div 
        layout
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
      >
        {MOCK_PHOTOS.map((photo) => (
          <motion.div 
             key={photo.id}
             layoutId={`photo-${photo.id}`}
             onClick={() => setSelectedImage(photo)}
             whileHover={{ scale: 1.05 }}
             style={{ 
               cursor: 'zoom-in', 
               overflow: 'hidden', 
               borderRadius: '10px',
               height: '200px',
               boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
             }}
          >
            <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
          >
            <motion.div 
              layoutId={`photo-${selectedImage.id}`}
              style={{ maxWidth: '90%', maxHeight: '90%' }}
            >
              <img src={selectedImage.url} alt={selectedImage.caption} style={{ width: '100%', height: 'auto', maxHeight: '80vh', borderRadius: '10px' }} />
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem' }}>{selectedImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
