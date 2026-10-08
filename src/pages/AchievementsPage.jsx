import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Trophy, Award, Star, CheckCircle2 } from 'lucide-react';

export default function AchievementsPage({ onOpenEnquiry }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setAchievements(store.getAchievements());
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
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Track Record of Excellence</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Academic Achievements & Toppers
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Karnataka State Board, CBSE, JEE & NEET stellar result milestones.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        <div className="grid-responsive-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
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
                  src={ach.image}
                  alt={ach.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>
                    🏆 {ach.statistic}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.35rem' }}>
                    {ach.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563EB', marginBottom: '0.75rem' }}>
                    {ach.studentName} ({ach.year})
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.6' }}>
                    {ach.description}
                  </p>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <button onClick={onOpenEnquiry} className="btn-emerald" style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}>
                  Join Next Batch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
