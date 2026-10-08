import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Award, Star, BookOpen } from 'lucide-react';

export default function TeachersPage({ onOpenEnquiry }) {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    setTeachers(store.getTeachers().filter(t => t.status === 'ACTIVE'));
  }, []);

  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '4rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '4rem 0 3rem',
        textAlign: 'center'
      }}>
        <div className="container-custom">
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Academic Pillars</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Meet Our Expert Faculty
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            IITians, IISc Gold Medalists, and Ph.D. authors dedicated to student mentorship.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        <div className="grid-responsive-3">
          {teachers.map((tch) => (
            <div
              key={tch.id}
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
                <img
                  src={tch.image}
                  alt={tch.name}
                  style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge-gold">{tch.rating} Student Rating</span>
                    <span className="badge-blue" style={{ fontSize: '0.72rem' }}>{tch.experience}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.25rem' }}>
                    {tch.name}
                  </h3>

                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563EB', marginBottom: '0.5rem' }}>
                    {tch.qualification}
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>
                    📚 {tch.subject}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>
                    {tch.bio}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <button
                  onClick={onOpenEnquiry}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  Book Demo Class with Faculty
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
