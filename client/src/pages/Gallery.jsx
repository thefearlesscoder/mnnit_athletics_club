import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const Gallery = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedImage, setSelectedImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Choice of three years including the current year
  const years = [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/content/events`);
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to load gallery events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter and extract all photos for the selected year
  let photos = [];
  events.forEach(event => {
    if (event.year?.toString() === selectedYear) {
      if (event.images && event.images.length > 0) {
        event.images.forEach((img, idx) => {
          photos.push({
            id: `${event._id}-${idx}`,
            url: img.url,
            caption: img.caption || event.name
          });
        });
      }
    }
  });

  // If no photos exist for the selected year, populate with mock images to preview the layout
  if (photos.length === 0 && !loading) {
    photos = Array.from({ length: 6 }).map((_, i) => ({
      id: `mock-${i}`,
      url: `https://images.unsplash.com/photo-1552674605-15c2145bc118?auto=format&fit=crop&w=400&q=70&random=${i}`,
      caption: `Mock Image ${i + 1} (${selectedYear})`
    }));
  }

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
              onClick={() => setSelectedYear(year)}
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
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading gallery...</p>
      ) : photos.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No photos found for the year {selectedYear}.</p>
        </div>
      ) : (
        <motion.div 
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
        >
          {photos.map((photo) => (
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
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </motion.div>
      )}

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
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem', color: '#ffffff' }}>{selectedImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
