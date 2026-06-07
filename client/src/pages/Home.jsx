import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const Home = () => {
  const [eventImages, setEventImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/content/events`);
        const currentYear = new Date().getFullYear();
        // Filter events for current year (fallback to previous year if none exist yet)
        let recentEvents = response.data.filter(event => event.year === currentYear);
        if (recentEvents.length === 0) {
            recentEvents = response.data.filter(event => event.year === currentYear - 1);
        }
        
        let allImages = [];
        recentEvents.forEach(event => {
          if (event.images && event.images.length > 0) {
            allImages = [...allImages, ...event.images];
          }
        });
        
        if (allImages.length === 0) {
            // Fallback generic sports images
            allImages = [
                { url: "https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&q=80", },
                { url: "https://images.unsplash.com/photo-1552674605-15c3705e9705?auto=format&fit=crop&q=80",  },
                { url: "https://images.unsplash.com/photo-1532009877282-3340270e0529?auto=format&fit=crop&q=80",}
            ];
        }

        setEventImages(allImages);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventImages([
            { url: "https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&q=80", },
            { url: "https://images.unsplash.com/photo-1552674605-15c3705e9705?auto=format&fit=crop&q=80", }
        ]);
      }
    };
    
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % eventImages.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [eventImages]);

  return (
    <div className="page-content" style={{ padding: '0' }}>
      {/* Hero Section */}
      <section className="hero" style={{ 
        height: '90vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AnimatePresence>
          {eventImages.length > 0 && (
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255, 255, 255, 0.6)), url("${eventImages[currentImageIndex].url}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            />
          )}
        </AnimatePresence>

        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.4)', zIndex: 1 }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '800px', padding: '2rem' }}
        >
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <span style={{ color: 'var(--accent-primary)' }}>Faster.</span> Stronger. Higher.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Welcome to the official legacy of the MNNIT Athletics Club. Discover our achievements, 
            meet the team, and witness the glory of our Annual Athletic Meets.
          </p>
          {eventImages.length > 0 && eventImages[currentImageIndex].caption && (
             <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: '500', marginBottom: '2rem' }}>
                📸 {eventImages[currentImageIndex].caption}
             </p>
          )}
          <button style={{ 
            background: 'var(--accent-primary)', 
            color: 'white', 
            border: 'none', 
            padding: '1rem 2rem', 
            fontSize: '1.1rem', 
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px var(--accent-glow)',
            transition: 'transform 0.3s ease'
          }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
            Explore Achievements
          </button>
        </motion.div>
      </section>

      {/* Dynamic Content Section */}
      <section style={{ padding: '4rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Notice Board */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>📢</span> Announcements
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Trials for Fasters</strong><br/>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Posted: Oct 12, 2024</span>
            </li>
            <li style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>AAM Registration Open</strong><br/>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Posted: Oct 10, 2024</span>
            </li>
          </ul>
        </div>

        {/* Birthday Spotlight */}
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎉 Birthday Spotlight</h2>
          <div style={{ display: 'inline-block', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, #f59e0b, #ef4444)', padding: '3px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150" alt="Birthday Boy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <h3 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>Alex Johnson</h3>
          <p style={{ color: 'var(--text-muted)' }}>Sprinter (Batch 2025)</p>
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"Wishing you a fantastic year ahead!"</p>
        </div>

        {/* Coordinator Note */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '1rem' }}>✍️ Our Moto</h2>
          <blockquote style={{ fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-primary)', paddingLeft: '1rem' }}>
            "Athletics is not just about moving fast, it's about pushing boundaries and realizing what you are truly capable of. Our legacy is built on the sweat of our alumni, and we aim to carry it forward with pride. #PUSH #YOUR # LIMITS"
          </blockquote>
          <p style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}> MAC </p>
        </div>

      </section>
    </div>
  );
};

export default Home;
