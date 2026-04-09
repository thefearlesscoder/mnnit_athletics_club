import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'event', 'images', 'notice', 'birthday', 'members'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@mac.com' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid admin credentials (mock: use admin@mac.com / admin)');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ width: '400px', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin <span style={{ color: 'var(--accent-primary)' }}>Login</span></h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </div>
            <button type="submit" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'requests':
        return (
          <div>
            <h2>Login Requests</h2>
            <div className="glass-card" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Sarah Connor</h4>
                <p style={{ color: 'var(--text-muted)' }}>sarah@example.com (Batch 2023)</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Approve</button>
                 <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Reject</button>
              </div>
            </div>
          </div>
        );
      case 'event':
        return (
          <div>
            <h2>Manage Events</h2>
            <div className="glass-card" style={{ marginTop: '1rem' }}>
              <form onSubmit={e => { e.preventDefault(); alert('Event Added!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                 <h3>Add New Event</h3>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <input required placeholder="Event Name (e.g. Annual Athletic Meet)" style={{ flex: 2, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    <input required type="number" placeholder="Year (e.g. 2024)" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add Event</button>
                 </div>
              </form>

              <div style={{ marginTop: '2rem' }}>
                 <h3>Existing Events</h3>
                 <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                       <span>Annual Athletic Meet 2024</span>
                       <button onClick={() => alert('Removed!')} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        );
      case 'images':
        return (
          <div>
            <h2>Manage Images</h2>
            <div className="glass-card" style={{ marginTop: '1rem' }}>
               <form onSubmit={e => { e.preventDefault(); alert('Image Uploaded!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                 <h3>Upload New Image</h3>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <select required style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-dark)', color: 'white' }}>
                       <option value="">Select Event...</option>
                       <option value="AAM 2024">AAM 2024</option>
                    </select>
                    <input type="text" placeholder="Caption (optional)" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                 </div>
                 <input type="file" accept="image/*" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                 <button type="submit" style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Upload Image</button>
               </form>
               <div style={{ marginTop: '2rem' }}>
                 <h3>Gallery (Click X to remove)</h3>
                 <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                       <img src="https://images.unsplash.com/photo-1552674605-15c2145bc118?auto=format&fit=crop&w=100&q=50" alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                       <button onClick={() => alert('Image removed!')} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
                    </div>
                 </div>
               </div>
            </div>
          </div>
         );
      case 'notice':
        return (
          <div>
            <h2>Manage Notices</h2>
            <div className="glass-card" style={{ marginTop: '1rem' }}>
              <form onSubmit={e => { e.preventDefault(); alert('Notice Published!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                 <h3>Create New Notice</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem' }}>Notice Title</label>
                    <input required type="text" placeholder="e.g. Trials for Fasters" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem' }}>Description / Content</label>
                    <textarea required rows="3" placeholder="Details regarding the notice..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.85rem', color: '#10b981' }}>Publish Date & Time</label>
                       <input required type="datetime-local" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.85rem', color: '#ef4444' }}>Remove Date & Time</label>
                       <input required type="datetime-local" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>
                 </div>
                 <button type="submit" style={{ padding: '0.8rem', marginTop: '0.5rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Publish Notice</button>
              </form>

              <div style={{ marginTop: '2rem' }}>
                 <h3>Active Notices (Mock)</h3>
                 <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                       <div>
                         <span style={{ fontWeight: 'bold' }}>AAM Registration Open</span>
                         <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Scheduled Removal: 10th Oct 2024, 11:59 PM</span>
                       </div>
                       <button onClick={() => alert('Removed!')} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        );
      case 'birthday':
        return (<div><h2>Mention Birthday</h2><p>Form to select member to highlight...</p></div>);
      case 'members':
        return (
          <div>
            <h2>Manage Members</h2>
            <div className="glass-card" style={{ marginTop: '1rem' }}>
              <form onSubmit={e => { e.preventDefault(); alert('Member Setup Link Generated & Sent!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                 <h3>Add New Member</h3>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <input required placeholder="Name" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    <input required type="email" placeholder="Email Address" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <select required style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-dark)', color: 'white' }}>
                       <option value="">Role...</option>
                       <option value="member">Active Member</option>
                       <option value="alumni">Alumni</option>
                    </select>
                    <button type="submit" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Send Setup Link</button>
                 </div>
              </form>

              <div style={{ marginTop: '2rem' }}>
                 <h3>Current Members / Alumni</h3>
                 <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                       <div>
                         <span style={{ fontWeight: 'bold' }}>Sarah Connor</span>
                         <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>sarah@example.com (Batch 2023)</span>
                       </div>
                       <button onClick={() => alert('Removed Member!')} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 0' }}>
         <h2 style={{ padding: '0 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div style={{ width: '30px', height: '30px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }}>MAC</div>
           Admin
         </h2>
         <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {[
             { id: 'requests', label: 'Login Requests' },
             { id: 'event', label: 'Add Event' },
             { id: 'images', label: 'Add Images' },
             { id: 'notice', label: 'Add Notice' },
             { id: 'birthday', label: 'Birthday Spotlight' },
             { id: 'members', label: 'Manage Members' }
           ].map(tab => (
             <li 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 padding: '1rem 2rem', 
                 cursor: 'pointer', 
                 background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                 color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-light)',
                 borderRight: activeTab === tab.id ? '4px solid var(--accent-primary)' : '4px solid transparent'
               }}
             >
               {tab.label}
             </li>
           ))}
         </ul>
         <div style={{ marginTop: 'auto', padding: '2rem' }}>
           <button onClick={() => setIsLoggedIn(false)} style={{ width: '100%', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer' }}>
             Sign Out
           </button>
         </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeTab}>
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
