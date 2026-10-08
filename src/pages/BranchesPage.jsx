import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function BranchesPage({ onSelectBranch }) {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    setBranches(store.getBranches().filter(b => b.status === 'ACTIVE'));
  }, []);

  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '4rem 0 3rem',
        textAlign: 'center'
      }}>
        <div className="container-custom">
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Bengaluru Footprint</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Our 8 Bengaluru Branches
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Find your nearest Grow Up Classes academic campus equipped with smart classrooms and expert faculties.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        <div className="grid-responsive-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="glass-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img
                    src={branch.image}
                    alt={branch.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                    {branch.area}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
                    {branch.name}
                  </h3>

                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    <MapPin size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{branch.address}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.5rem' }}>
                    📞 Phone: {branch.phone}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>
                    ✉️ {branch.email}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#334155', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', marginBottom: '1rem' }}>
                    ⏰ <strong>Timings:</strong> {branch.timings}
                  </div>

                  {branch.facilities && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {branch.facilities.map((fac, idx) => (
                        <span key={idx} style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          ✓ {fac}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onSelectBranch(branch.id)}
                  className="btn-emerald"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  Enquire for Branch
                </button>
                <a
                  href={branch.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} /> Map
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
