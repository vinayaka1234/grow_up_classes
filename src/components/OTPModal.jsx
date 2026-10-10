import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, User, Phone, Database } from 'lucide-react';
import { store } from '../services/store';

export default function OTPModal({ isOpen, onClose, onVerified, isMandatory }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const sess = store.getCustomerSession();
      if (sess) {
        if (sess.name) setName(sess.name);
        if (sess.mobile) setMobile(sess.mobile);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full Name.');
      return;
    }

    const cleanedMobile = mobile.replace(/\D/g, '');
    if (cleanedMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save directly to customer database & lead enquiry engine
      const session = await store.registerVisitorCustomer({
        name: name.trim(),
        mobile: cleanedMobile
      });

      setSuccessMsg(`Welcome ${name}! Your registration has been saved directly to MySQL Database.`);

      setTimeout(() => {
        setIsSubmitting(false);
        if (onVerified) onVerified(session);
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error saving registration.');
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.88)', zIndex: 9999 }}>
      <div 
        className="glass-card" 
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem 2rem',
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)'
        }}
      >
        {!isMandatory && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            ✕
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
            borderRadius: '20px',
            color: '#FFFFFF',
            marginBottom: '0.85rem',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#0F172A', fontWeight: '800' }}>
            Welcome to Grow Up Classes
          </h2>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.35rem', lineHeight: '1.5' }}>
            Please enter your <strong>Full Name</strong> and <strong>10-Digit Mobile Number</strong> to access our programs and materials.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#EFF6FF',
            color: '#1E40AF',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            marginTop: '0.75rem'
          }}>
            <Database size={13} /> Direct MySQL Database Saved Access
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Student / Visitor Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Enter your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontWeight: '600',
                  color: '#0F172A'
                }}
                required
                autoFocus
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              10-Digit Mobile Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#1E3A8A', fontSize: '0.95rem' }}>
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 3.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '1rem',
                  outline: 'none',
                  fontWeight: '700',
                  color: '#0F172A'
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-emerald"
            style={{
              width: '100%',
              padding: '0.95rem',
              fontSize: '1.05rem',
              borderRadius: '14px',
              fontWeight: '700'
            }}
          >
            {isSubmitting ? 'Saving to Database...' : 'Submit & Access Website'} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
