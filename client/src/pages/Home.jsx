import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Home = () => {
  const [eventImages, setEventImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [notices, setNotices] = useState([]);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      // Fetch Gallery Images for Hero Slideshow
      try {
        const response = await axios.get(`${API}/content/gallery`);
        const currentYear = new Date().getFullYear();
        let recentImages = response.data.filter(img => img.event && img.event.year === currentYear);
        if (recentImages.length === 0) {
            recentImages = response.data.filter(img => img.event && img.event.year === currentYear - 1);
        }
        
        let allImages = recentImages.map(img => ({ url: img.image }));
        
        if (allImages.length === 0) {
            allImages = [
                { url: "https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&q=80", },
                { url: "https://images.unsplash.com/photo-1552674605-15c3705e9705?auto=format&fit=crop&q=80",  },
                { url: "https://images.unsplash.com/photo-1532009877282-3340270e0529?auto=format&fit=crop&q=80",}
            ];
        }

        setEventImages(allImages);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setEventImages([
            { url: "https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&q=80", },
            { url: "https://images.unsplash.com/photo-1552674605-15c3705e9705?auto=format&fit=crop&q=80", }
        ]);
      }

      // Fetch Notices
      try {
        const noticeRes = await axios.get(`${API}/content/notices`);
        setNotices(noticeRes.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }

      // Fetch Highlights
      try {
        const highlightRes = await axios.get(`${API}/content/highlights`);
        setHighlights(highlightRes.data);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };
    
    fetchContent();
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
          {notices.length === 0 ? (
             <p style={{ color: 'var(--text-muted)' }}>No active announcements.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notices.map((notice) => (
                <li key={notice._id} style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{notice.title}</strong><br/>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{notice.content}</span><br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
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

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <section style={{ padding: '2rem 3rem 4rem', background: 'var(--bg-secondary)', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--accent-primary)' }}>Event</span> Highlights
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Relive the best moments of MAC</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {highlights.map(highlight => {
              const videoId = getYouTubeVideoId(highlight.youtubeUrl);
              return (
                <div key={highlight._id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                  {videoId ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                      <iframe 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title={highlight.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', background: '#e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                      <p>Invalid Video Link</p>
                      <a href={highlight.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Open Link</a>
                    </div>
                  )}
                  <h3 style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{highlight.title}</h3>
                  {highlight.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', flex: 1 }}>{highlight.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
