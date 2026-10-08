import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage({ onOpenEnquiry }) {
  return (
    <div style={{ background: '#F8FAFC', paddingBottom: '4rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '4rem 0 3rem',
        textAlign: 'center'
      }}>
        <div className="container-custom">
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Reach Out To Us</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Contact & Location Directory
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Have a question about admissions, course fees, or batch timings? We are here to help!
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div className="glass-card" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: '#EFF6FF', color: '#2563EB', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Helpline Numbers</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>Speak directly with our academic coordinators:</p>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>+91 98450 12345</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>+91 98450 23456</div>
          </div>

          <div className="glass-card" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: '#ECFDF5', color: '#059669', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>WhatsApp Support</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>Instant chat for brochures & batch timings:</p>
            <a
              href="https://wa.me/919845012345?text=Hello%20Grow%20Up%20Classes,%20I%20want%20information%20about%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
            >
              Start WhatsApp Chat
            </a>
          </div>

          <div className="glass-card" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: '#FEF3C7', color: '#D97706', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>Email Desk</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem' }}>Official inquiries & career applications:</p>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>admissions@growupclasses.in</div>
          </div>

        </div>

        {/* Form Callout */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          color: '#FFFFFF',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Submit an Enquiry Form Online
          </h2>
          <p style={{ color: '#DBEAFE', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.75rem' }}>
            Fill out your details to receive instant counseling support and free demo class passes at your preferred branch.
          </p>
          <button onClick={onOpenEnquiry} className="btn-emerald" style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}>
            Open Enquiry Form
          </button>
        </div>
      </div>
    </div>
  );
}
