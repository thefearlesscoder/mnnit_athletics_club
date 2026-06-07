import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminImageUpload = ({ adminToken }) => {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/content/events`);
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
          if (data.length > 0) setEventId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, [API]);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  // Helper to add files with basic validation
  const addFiles = (newFiles) => {
    setUploadSuccess(false);
    setErrorMessage('');
    
    // Filter only images
    const imageFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        setErrorMessage('Only image files are allowed.');
      }
      return isImage;
    });

    setFiles(prev => {
      // Prevent duplicates by checking name and size
      const uniqueFiles = [...prev];
      imageFiles.forEach(file => {
        if (!uniqueFiles.some(f => f.name === file.name && f.size === file.size)) {
          uniqueFiles.push(file);
        }
      });
      return uniqueFiles;
    });
  };

  // Remove individual file from upload list
  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setUploadSuccess(false);

    if (!eventId) {
      setErrorMessage('Please select an event. You may need to create an event first.');
      return;
    }

    if (files.length === 0) {
      setErrorMessage('Please select or drop at least one image to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('eventId', eventId);
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploadProgress(50);
      const res = await fetch(`${API}/admin/gallery/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken || 'mock_offline'}`
        },
        body: formData
      });

      setUploadProgress(80);
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response (not JSON). Please check server logs.");
      }
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Image upload failed.');
      }

      setUploadProgress(100);
      setUploading(false);
      setUploadSuccess(true);
      setFiles([]); // Clear upload queue upon success
    } catch (err) {
      console.error('Image Upload Error:', err);
      setUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'Error occurred during image upload.');
    }
  };

  const dragAreaStyle = {
    border: isDragActive ? '2px dashed var(--accent-primary)' : '2px dashed rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    background: isDragActive ? 'var(--accent-glow)' : 'rgba(0, 0, 0, 0.02)',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    boxShadow: isDragActive ? '0 0 15px var(--accent-glow)' : 'none',
  };

  const labelStyle = {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
    display: 'block',
  };

  const inputStyle = {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.12)',
    background: 'rgba(0,0,0,0.04)',
    color: 'var(--text-primary)',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div style={{ maxWidth: '750px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Upload Images to <span style={{ color: 'var(--accent-primary)' }}>Cloudinary</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Configure event details and upload multiple files directly into the gallery</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Event Selection */}
          <div>
            <label style={labelStyle}>Select Event (You must create an event first)</label>
            <select 
              id="event-select"
              value={eventId} 
              onChange={(e) => {
                setEventId(e.target.value);
                setErrorMessage('');
              }} 
              style={inputStyle}
            >
              {events.length === 0 ? (
                <option value="">No events found...</option>
              ) : (
                events.map(ev => (
                  <option key={ev._id} value={ev._id}>{ev.name} ({ev.year})</option>
                ))
              )}
            </select>
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label style={labelStyle}>Upload Images</label>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={dragAreaStyle}
              className="dropzone"
            >
              <input 
                id="file-upload-input"
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileSelect} 
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '2.5rem', color: isDragActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                📥
              </div>
              <div>
                <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.2rem' }}>
                  {isDragActive ? 'Drop your images here!' : 'Drag & drop your images here'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  or <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>browse files</span> from your computer
                </p>
              </div>
            </div>
          </div>

          {/* Selected File Previews */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Selected Images ({files.length})
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => setFiles([])}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Clear All
                  </button>
                </div>

                {/* Grid of File Previews */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                  gap: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '4px'
                }}>
                  {files.map((file, idx) => (
                    <motion.div
                      key={`${file.name}-${idx}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        aspectRatio: '1',
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Image Thumbnail */}
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="preview" 
                        style={{ 
                          width: '100%', 
                          height: '75%', 
                          objectFit: 'cover' 
                        }} 
                      />

                      {/* File Details overlay/section */}
                      <div style={{ 
                        height: '25%', 
                        padding: '2px 6px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        background: '#f8fafc',
                        borderTop: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          margin: 0, 
                          color: 'var(--text-primary)', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}>
                          {file.name}
                        </p>
                        <p style={{ fontSize: '0.62rem', margin: 0, color: 'var(--text-secondary)' }}>
                          {formatSize(file.size)}
                        </p>
                      </div>

                      {/* Remove Button overlay */}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.9)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                      >
                        ✖
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Messages */}
          {errorMessage && (
            <div style={{
              padding: '0.8rem 1rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '0.88rem'
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {uploadSuccess && (
            <div style={{
              padding: '0.8rem 1rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              color: '#10b981',
              fontSize: '0.88rem'
            }}>
              ✅ Gallery images uploaded to Cloudinary successfully! Check the console logs for payload details.
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Uploading files to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${uploadProgress}%`, 
                  height: '100%', 
                  background: 'var(--accent-primary)', 
                  borderRadius: '10px',
                  transition: 'width 0.2s ease-out'
                }} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="cloudinary-upload-btn"
            type="submit"
            disabled={uploading}
            style={{
              padding: '0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: uploading ? 'rgba(0,0,0,0.15)' : 'var(--accent-primary)',
              color: uploading ? 'var(--text-secondary)' : 'white',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px var(--accent-glow)';
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading) {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {uploading ? (
              <>
                <span className="spinner" style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'var(--accent-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Uploading...
              </>
            ) : (
              '📤 Upload to Cloudinary'
            )}
          </button>

        </form>
      </div>

      {/* Embedded CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminImageUpload;
