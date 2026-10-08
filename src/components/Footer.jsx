import React from 'react';
import { MapPin, Phone, Mail, Lock, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate, onOpenAdmin, onOpenEnquiry }) {
  return (
    <footer style={{
      background: '#0F172A',
      color: '#CBD5E1',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid #1E293B',
      position: 'relative'
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '12px', display: 'inline-block' }}>
                <img src="/logo.png" alt="Grow Up Classes Logo" style={{ height: '44px', width: 'auto', display: 'block' }} />
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94A3B8', marginBottom: '1.25rem' }}>
              Bengaluru’s premier multi-branch tuition & competitive learning platform. Dedicated to concept mastery, academic distinction, and top rank outcomes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E2E8F0' }}>
                <Phone size={15} color="#60A5FA" /> +91 98450 12345 / 98450 23456
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E2E8F0' }}>
                <Mail size={15} color="#60A5FA" /> admissions@growupclasses.in
              </div>
            </div>
          </div>

          {/* Column 2: Bengaluru Branches */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
              Bengaluru Branches
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              {['Jayanagar 4th Block', 'Indiranagar 100ft Road', 'HSR Layout Sector 1', 'Koramangala 5th Block', 'Whitefield ITPL Road', 'Malleshwaram 8th Main'].map((branch, i) => (
                <li key={i}>
                  <button
                    onClick={() => onNavigate('branches')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      textAlign: 'left'
                    }}
                  >
                    <MapPin size={13} color="#38BDF8" /> {branch}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
              Popular Courses
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              {['Class 10 SSLC & CBSE Board', '1st & 2nd PU Science (PCMB/PCMC)', 'JEE Main & Advanced Integrated', 'NEET Medical Entrance Masterclass', 'Class 6-9 Foundation & Olympiad', '11th & 12th Commerce Coaching'].map((crs, i) => (
                <li key={i}>
                  <button
                    onClick={() => onNavigate('courses')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    • {crs}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Action & Admin Login */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => onOpenEnquiry()}
                className="btn-emerald"
                style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
              >
                Book Free Counseling
              </button>

              <button
                onClick={onOpenAdmin}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Lock size={14} color="#FBBF24" /> Admin Portal Access
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Grow Up Classes Tuition & Learning Institute. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Customer mobile numbers verified via OTP are stored securely and never shared with third parties.'); }} style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Grow Up Classes provides multi-branch classroom coaching and academic assessment tools across Bengaluru.'); }} style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</a>
            <button onClick={onOpenAdmin} style={{ background: 'none', border: 'none', color: '#FBBF24', cursor: 'pointer', fontSize: '0.8rem' }}>Admin Dashboard</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
