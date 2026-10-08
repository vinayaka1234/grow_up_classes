import React from 'react';
import { Users, Building2, Award, Calendar, ShieldCheck, GraduationCap } from 'lucide-react';

export default function TrustStats() {
  const stats = [
    {
      icon: Users,
      value: '12,500+',
      label: 'Students Taught',
      subtext: 'Across SSLC, CBSE, JEE & NEET',
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      icon: Building2,
      value: '8 Branches',
      label: 'Bengaluru Network',
      subtext: 'Jayanagar, Indiranagar, HSR & more',
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      icon: Calendar,
      value: '15+ Years',
      label: 'Academic Excellence',
      subtext: 'Established in 2010',
      color: '#D97706',
      bg: '#FEF3C7'
    },
    {
      icon: Award,
      value: '99.2%',
      label: 'Board Distinction',
      subtext: 'State 1st Rank Holder 2025',
      color: '#7C3AED',
      bg: '#F3E8FF'
    }
  ];

  return (
    <section style={{
      marginTop: '-2.5rem',
      position: 'relative',
      zIndex: 20,
      paddingBottom: '3rem'
    }}>
      <div className="container-custom">
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
          border: '1px solid #E2E8F0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${item.bg}`
                }}>
                  <Icon size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginTop: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {item.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
