import React, { useState, useEffect } from 'react';
import { Menu, X, UserCheck, PhoneCall, LogOut, Lock, LayoutDashboard } from 'lucide-react';
import { store } from '../services/store';

export default function Navbar({ activeSection, onNavigate, onOpenEnquiry, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerSession, setCustomerSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

  const updateCount = () => {
    try {
      const enquiries = store.getEnquiries();
      const count = enquiries.filter(e => e.status === 'NEW').length;
      setNewEnquiriesCount(count);
    } catch (e) {
      setNewEnquiriesCount(0);
    }
  };

  useEffect(() => {
    setCustomerSession(store.getCustomerSession());
    setIsAdmin(store.isAdminLoggedIn());
    updateCount();

    // Poll every 2 seconds to update new enquiry count automatically
    const interval = setInterval(() => {
      updateCount();
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSection]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'branches', label: 'Branches' },
    { id: 'teachers', label: 'Faculty' },
    { id: 'achievements', label: 'Toppers & Results' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'about', label: 'About Us' }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleLogoutCustomer = () => {
    store.clearCustomerSession();
    setCustomerSession(null);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Official Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <img
            src="/logo.png"
            alt="Grow Up Classes Official Logo"
            style={{
              height: '56px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: activeSection === link.id ? '700' : '600',
                color: activeSection === link.id ? '#2563EB' : '#475569',
                cursor: 'pointer',
                padding: '0.5rem 0.25rem',
                borderBottom: activeSection === link.id ? '2px solid #2563EB' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons & Session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* User Session Badge if logged in */}
          {customerSession && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '0.4rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: '#065F46',
                fontWeight: '700'
              }}
              title={`Registered Visitor: ${customerSession.name}`}
            >
              <UserCheck size={16} color="#059669" />
              <span className="hide-mobile">{customerSession.name}</span>
              <button
                onClick={handleLogoutCustomer}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#047857', paddingLeft: '4px' }}
                title="Log out session"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Admin Panel Toggle Button with New Applications Indicator Badge */}
          <button
            onClick={onOpenAdmin}
            style={{
              background: isAdmin ? '#FEF3C7' : '#F1F5F9',
              border: isAdmin ? '1px solid #FCD34D' : '1px solid #CBD5E1',
              color: isAdmin ? '#92400E' : '#334155',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              position: 'relative'
            }}
            title="Access Admin Management System"
          >
            {isAdmin ? <LayoutDashboard size={15} /> : <Lock size={15} />}
            <span className="hide-mobile">{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>

            {/* Red Notification Badge showing number of NEW Enquiries */}
            {newEnquiriesCount > 0 && (
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '1',
                  minWidth: '18px'
                }}
                title={`${newEnquiriesCount} New Applications / Enquiries Recieved`}
              >
                {newEnquiriesCount}
              </span>
            )}
          </button>

          {/* Enquire CTA Button */}
          <button
            onClick={() => onOpenEnquiry()}
            className="btn-primary hide-mobile"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem' }}
          >
            <PhoneCall size={16} /> Enquire Now
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '10px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-trigger"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '1rem 1.25rem 1.5rem',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  textAlign: 'left',
                  background: activeSection === link.id ? '#EFF6FF' : 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: activeSection === link.id ? '700' : '600',
                  color: activeSection === link.id ? '#2563EB' : '#334155',
                  cursor: 'pointer'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Lock size={16} /> Admin Login
              {newEnquiriesCount > 0 && (
                <span style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  {newEnquiriesCount} New
                </span>
              )}
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenEnquiry(); }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <PhoneCall size={18} /> Submit Admission Enquiry
            </button>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS overrides */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-trigger { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
