import React, { useState } from 'react';

const MemberEditProfile = () => {
  const [formData, setFormData] = useState({
    name: 'Sarah Connor',
    branch: 'Computer Science',
    batch: '2023',
    events: '100m Sprint, Long Jump',
    achievements: 'Gold in 100m AAM 2023',
    linkedIn: 'https://linkedin.com/in/sarah',
    instagram: 'https://instagram.com/sarah',
    birthday: '2001-05-10',
    profilePhoto: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Edit <span style={{ color: 'var(--accent-primary)' }}>Profile</span></h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Name</label>
               <input name="name" value={formData.name} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Batch</label>
               <input name="batch" value={formData.batch} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Branch</label>
               <input name="branch" value={formData.branch} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Birthday</label>
               <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Events (Comma separated)</label>
            <input name="events" value={formData.events} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Achievements (Comma separated)</label>
            <textarea name="achievements" rows="3" value={formData.achievements} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>LinkedIn URL</label>
               <input name="linkedIn" value={formData.linkedIn} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label>Instagram URL</label>
               <input name="instagram" value={formData.instagram} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>Profile Photo (Cloudinary upload simulated)</label>
            <input type="file" accept="image/*" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>

          <button type="submit" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
            Save Changes
          </button>
        </form>

      </div>
    </div>
  );
};

export default MemberEditProfile;
