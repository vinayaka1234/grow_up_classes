import React from 'react';
import { Phone, MessageSquare, Send } from 'lucide-react';

export default function QuickContactBar({ onOpenEnquiry }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 90,
      width: 'calc(100% - 2rem)',
      maxWidth: '480px',
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '9999px',
      padding: '0.5rem 0.75rem',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem'
    }} className="show-mobile-bar">
      <a
        href="tel:+919845012345"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          padding: '0.65rem 0.5rem',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: '700'
        }}
      >
        <Phone size={16} color="#60A5FA" /> Call Institute
      </a>

      <a
        href="https://wa.me/919845012345?text=Hello%20Grow%20Up%20Classes,%20I%20want%20information%20about%20admissions."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          background: '#25D366',
          color: '#FFFFFF',
          padding: '0.65rem 0.5rem',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
        }}
      >
        <MessageSquare size={16} /> WhatsApp
      </a>

      <button
        onClick={onOpenEnquiry}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          border: 'none',
          padding: '0.65rem 0.5rem',
          borderRadius: '9999px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
        }}
      >
        <Send size={15} /> Quick Form
      </button>

      <style>{`
        @media (min-width: 768px) {
          .show-mobile-bar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
