import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram } from "react-icons/fa";
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/feedback`, formData);
      alert(response.data.message || "Feedback submitted successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Get in <span style={{ color: 'var(--accent-primary)' }}>Touch</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Feedback, queries, or just to say hi.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1000px' }}>

        {/* Contact Info */}
        <div style={{ flex: '1 1 300px' }}>
          <div
            className="glass-card"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <h3>Contact Information</h3>

            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Email:</strong>
              <p>mnnitathleticsclub@gmail.com</p>
            </div>

            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Address:</strong>
              <p>
                MNNIT Athletics Ground,
                <br />
                Motilal Nehru National Institute of Technology,
                Prayagraj, UP 211004
              </p>
            </div>

            {/* Circular Logo */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.5rem 0'
              }}
            >
              <img
                src="/logo.png"
                alt="MNNIT Athletics Club"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-primary)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              />
            </div>

            {/* Social Icons */}
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <a
                href="https://instagram.com/mnnit_athletics"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '2rem',
                  transition: '0.3s'
                }}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: '2 1 400px' }}>
          <motion.form
            onSubmit={handleSubmit}
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h3>Send a Message</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.5)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.5)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Message</label>
              <textarea
                required
                rows="5"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.5)', color: 'var(--text-primary)', resize: 'vertical' }}
              />
            </div>

            <button type="submit" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
              Submit
            </button>
          </motion.form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
