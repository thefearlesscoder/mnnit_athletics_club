import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_AAM_PHOTOS = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  url: `https://images.unsplash.com/photo-1574629810360-7efbb4d615bd?auto=format&fit=crop&w=600&q=80&random=${i}`,
  caption: `AAM Iconic Moment ${i + 1}`
}));

const MOCK_SPONSORS = ['Nike', 'Puma', 'RedBull', 'Gatorade'];

const AAM = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        height: '60vh',
        background: 'linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.4)), url("https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4rem'
      }}>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}><span style={{ color: 'var(--accent-primary)' }}>Annual Athletic Meet</span> 2024</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Date: <strong>12th - 14th November 2024</strong><br/>
            Chief Guest: <strong>Mr. Usain Bolt</strong><br/>
            Participation: <strong>1200+ Athletes</strong><br/>
            Best Athlete (M): <strong>John Doe</strong> | Best Athlete (F): <strong>Sarah Connor</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
             <button style={{ padding: '0.8rem 2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>View Full Results</button>
          </div>
        </motion.div>
      </section>

      {/* Podium Finishers Description */}
      <section className="page-content" style={{ paddingBottom: '0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Podium Finishers Overview</h2>
        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
           <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: '1.8' }}>
             The 2024 meet witnessed record-breaking performances across the board. In the 100m sprint, the competition was fierce, ending with a photo finish for the Gold. The distance events showcased incredible endurance, with new records set in the 10,000m. Every athlete brought their A-game, making this AAM one of the most memorable in MNNIT's history.
           </p>
        </div>
      </section>

      {/* Iconic Photos */}
      <section className="page-content" style={{ paddingBottom: '0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Iconic Gallery</h2>
        <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {MOCK_AAM_PHOTOS.map((photo) => (
            <motion.div 
               key={photo.id}
               onClick={() => setSelectedImage(photo)}
               whileHover={{ scale: 1.05 }}
               style={{ 
                 cursor: 'zoom-in', 
                 overflow: 'hidden', 
                 borderRadius: '15px',
                 height: '250px',
                 boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                 border: '2px solid rgba(255,255,255,0.05)'
               }}
            >
              <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Sponsors Carousel (Basic Flex layout for demo) */}
      <section className="page-content" style={{ paddingBottom: '0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Proud Sponsors</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.7 }}>
           {MOCK_SPONSORS.map((spon, i) => (
              <h3 key={i} style={{ color: 'var(--text-muted)', fontSize: '2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{spon}</h3>
           ))}
        </div>
      </section>

      {/* Organizing Team */}
      <section className="page-content">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Organizing Team</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass-card" style={{ width: '250px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', margin: '0 auto 1rem auto', overflow: 'hidden' }}>
                 <img src={`https://ui-avatars.com/api/?name=Organizer+${i}&background=random`} alt="Organizer" style={{ width: '100%' }} />
              </div>
              <h3>Alex Organizer {i}</h3>
              <p style={{ color: 'var(--accent-primary)' }}>Event Head</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>3rd Year | Mech</p>
            </div>
          ))}
        </div>
      </section>

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
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
          >
            <motion.div style={{ maxWidth: '90%', maxHeight: '90%' }}>
              <img src={selectedImage.url} alt={selectedImage.caption} style={{ width: '100%', height: 'auto', maxHeight: '85vh', borderRadius: '10px' }} />
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-light)' }}>{selectedImage.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AAM;
