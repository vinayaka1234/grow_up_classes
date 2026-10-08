import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Award, Target, Eye, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage({ onOpenEnquiry }) {
  const [founders, setFounders] = useState([]);

  useEffect(() => {
    setFounders(store.getFounders());
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
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Our Heritage & Vision</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            About Grow Up Classes
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Nurturing academic discipline, conceptual clarity, and rank distinctions across Bengaluru since 2010.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        {/* Story Section */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginBottom: '3rem',
          border: '1px solid #E2E8F0'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0F172A', fontWeight: '800', marginBottom: '1rem' }}>
            The Grow Up Classes Story
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1rem' }}>
            Founded in 2010 in Bengaluru, <strong>Grow Up Classes</strong> was built on a singular founding principle: <em>"Quality education should not just impart answers, but cultivate deep conceptual understanding and scientific problem-solving."</em> What started as a single batch in Jayanagar has grown into a premier network of <strong>8 state-of-the-art learning campuses</strong> across Bengaluru.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem' }}>
            Over the past 15+ years, we have guided more than 12,500 students to secure top ranks in SSLC, CBSE 10th & 12th Board Exams, KCET, JEE Main, and NEET Medical entrances.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EFF6FF', color: '#2563EB', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Our Mission</h3>
            <p style={{ color: '#64748B', lineHeight: '1.6', fontSize: '0.95rem' }}>
              To empower every student with rigorous conceptual foundations, personalized mentorship, and exam strategies that turn potential into top distinction.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#ECFDF5', color: '#059669', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Eye size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Our Vision</h3>
            <p style={{ color: '#64748B', lineHeight: '1.6', fontSize: '0.95rem' }}>
              To be recognized as Karnataka’s most trusted education brand, setting global standards in tuition pedagogy, technology-enabled smart learning, and holistic student well-being.
            </p>
          </div>
        </div>

        {/* Founders / Leadership Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Founding Leadership</span>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: '800' }}>
              Leadership & Academic Directors
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {founders.map((fnd) => (
              <div
                key={fnd.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <img
                  src={fnd.image}
                  alt={fnd.name}
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.25rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>{fnd.name}</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563EB', marginBottom: '1rem' }}>{fnd.designation}</div>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1rem' }}>{fnd.bio}</p>
                <blockquote style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#334155', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #2563EB' }}>
                  {fnd.message}
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', background: '#FFFFFF', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
            Experience the Grow Up Classes Difference
          </h3>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
            Visit any of our 8 Bengaluru branches or speak to our senior academic counselor today.
          </p>
          <button onClick={onOpenEnquiry} className="btn-emerald" style={{ padding: '0.85rem 2rem' }}>
            Book Free Diagnostic Test & Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
