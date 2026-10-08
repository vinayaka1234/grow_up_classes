import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { X, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setGallery(store.getGallery());
  }, []);

  const categories = ['ALL', 'Classrooms', 'Labs', 'Events', 'Campus'];

  const filteredGallery = activeCategory === 'ALL'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '4rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '4rem 0 3rem',
        textAlign: 'center'
      }}>
        <div className="container-custom">
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Visual Campus Experience</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Campus & Activity Gallery
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            A glimpse into smart classrooms, practical labs, and toppers celebrations across Bengaluru.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '2.5rem' }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                border: activeCategory === cat ? '1px solid #2563EB' : '1px solid #CBD5E1',
                background: activeCategory === cat ? '#2563EB' : '#FFFFFF',
                color: activeCategory === cat ? '#FFFFFF' : '#334155',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid-responsive-3">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="glass-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <span className="badge-blue" style={{ fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="modal-overlay" onClick={() => setActiveImage(null)}>
          <div className="glass-card" style={{ maxWidth: '800px', width: '100%', background: '#FFFFFF', padding: '1.5rem', borderRadius: '24px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveImage(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <img src={activeImage.image} alt={activeImage.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>{activeImage.title}</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>{activeImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
