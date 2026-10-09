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
            Our Academic Campuses & Branches
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Explore Grow Up Classes learning centres equipped with smart classrooms, laboratories, and expert faculties.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        <div className="grid-responsive-3">
          {branches.map((branch) => {
            const mapUrl = branch.map_link || branch.mapLink || 'https://maps.google.com';
            const imgUrl = branch.image_url || branch.image || 'https://images.unsplash.com/photo-1562774053-701939374585';
            
            let facilitiesArr = [];
            if (Array.isArray(branch.facilities)) {
              facilitiesArr = branch.facilities;
            } else if (typeof branch.facilities === 'string' && branch.facilities) {
              if (branch.facilities.startsWith('[')) {
                try { facilitiesArr = JSON.parse(branch.facilities); } catch(e) {}
              } else {
                facilitiesArr = branch.facilities.split(',').map(f => f.trim());
              }
            }

            return (
              <div
                key={branch.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={imgUrl}
                      alt={branch.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      {branch.area}
                    </span>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.6rem' }}>
                      {branch.name}
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.88rem', color: '#475569', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                      <MapPin size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{branch.address}</span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={15} color="#059669" />
                      <span>{branch.phone}</span>
                    </div>

                    {branch.email && (
                      <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={15} color="#2563EB" />
                        <span>{branch.email}</span>
                      </div>
                    )}

                    {branch.timings && (
                      <div style={{ fontSize: '0.8rem', color: '#334155', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={15} color="#D97706" />
                        <span><strong>Timings:</strong> {branch.timings}</span>
                      </div>
                    )}

                    {facilitiesArr.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {facilitiesArr.map((fac, idx) => (
                          <span key={idx} style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={() => onSelectBranch(branch.id)}
                    className="btn-emerald"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    Visit Campus / Enquire
                  </button>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    title="Click to view exact branch location on Google Maps"
                  >
                    <ExternalLink size={15} /> Map Location
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
