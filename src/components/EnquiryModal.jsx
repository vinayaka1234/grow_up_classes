import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, User, Phone, Mail, BookOpen, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { store } from '../services/store';

export default function EnquiryModal({ isOpen, onClose, initialCourseId, initialBranchId }) {
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10 SSLC / CBSE');
  const [courseId, setCourseId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const bList = store.getBranches().filter(b => b.status === 'ACTIVE');
      const cList = store.getCourses().filter(c => c.status === 'ACTIVE');
      setBranches(bList);
      setCourses(cList);

      if (initialBranchId) setBranchId(initialBranchId);
      else if (bList.length > 0) setBranchId(bList[0].id);

      if (initialCourseId) setCourseId(initialCourseId);
      else if (cList.length > 0) setCourseId(cList[0].id);

      // Auto-fill from customer session if available
      const sess = store.getCustomerSession();
      if (sess) {
        if (sess.mobile) setMobile(sess.mobile);
        if (sess.name) setStudentName(sess.name);
        if (sess.email) setEmail(sess.email);
      }
    }
  }, [isOpen, initialCourseId, initialBranchId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!studentName.trim()) {
      setError('Please enter Student Name.');
      return;
    }
    if (!parentName.trim()) {
      setError('Please enter Parent / Guardian Name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!consent) {
      setError('Please accept communication consent to receive admission updates.');
      return;
    }

    const selectedBranch = branches.find(b => b.id === branchId);
    const selectedCourse = courses.find(c => c.id === courseId);

    const newLead = store.addEnquiry({
      studentName,
      parentName,
      mobile,
      email,
      classLevel,
      courseId,
      courseTitle: selectedCourse ? selectedCourse.title : 'General Enquiry',
      branchId,
      branchName: selectedBranch ? selectedBranch.name : 'All Branches',
      message
    });

    setSubmittedRef(newLead.id);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
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
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: '#ECFDF5',
              border: '2px solid #6EE7B7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#0F172A', fontWeight: '800' }}>
              Enquiry Submitted Successfully!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', margin: '0.5rem 0 1.25rem' }}>
              Thank you, <strong>{studentName}</strong>. Your enquiry reference number is <span className="badge-blue" style={{ fontSize: '0.9rem' }}>#{submittedRef}</span>.
            </p>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1rem',
              fontSize: '0.85rem',
              color: '#334155',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}>
              <p><strong>Next Steps:</strong></p>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', lineHeight: '1.6' }}>
                <li>Our branch academic counselor will contact you via WhatsApp / Phone within 2 hours.</li>
                <li>Free demo class & diagnostic test schedule will be shared.</li>
              </ul>
            </div>

            <button onClick={handleResetAndClose} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Done / Return to Website
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>
                ⚡ Direct Admission Enquiry
              </span>
              <h2 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: '800' }}>
                Book Free Counseling & Seat Reservation
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Fill out the details below to receive batch timings, fee concessions & demo class passes.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Row 1: Student Name & Parent Name */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Student Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="text"
                      placeholder="Student full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Parent full name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Verified Mobile Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Email Address (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Class / Grade */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Current Class / Academic Level *
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Class 6 - 8 Foundation">Class 6 - 8 Foundation</option>
                  <option value="Class 9 Board & Olympiad">Class 9 Board & Olympiad</option>
                  <option value="Class 10 SSLC / CBSE Board">Class 10 SSLC / CBSE Board</option>
                  <option value="Class 11 Science (PCMB/PCMC)">Class 11 Science (PCMB/PCMC)</option>
                  <option value="Class 12 Science + KCET/JEE">Class 12 Science + KCET/JEE</option>
                  <option value="Class 11-12 Commerce">Class 11-12 Commerce</option>
                  <option value="NEET Medical Achievers Batch">NEET Medical Achievers Batch</option>
                  <option value="JEE Main & Advanced Integrated">JEE Main & Advanced Integrated</option>
                </select>
              </div>

              {/* Row 4: Course & Preferred Branch */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Interested Course *
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      background: '#FFFFFF'
                    }}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Preferred Bengaluru Branch *
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      background: '#FFFFFF'
                    }}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.area})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Additional Requirements / Specific Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Preferred batch timings, fee structure query, transport facility..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Consent Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#64748B' }}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '2px', cursor: 'pointer' }}
                />
                <label htmlFor="consent" style={{ cursor: 'pointer' }}>
                  I authorize Grow Up Classes to send admission counseling details, test notifications & fee brochures via WhatsApp, SMS, and Call.
                </label>
              </div>

              <button type="submit" className="btn-emerald" style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                Submit Admission Enquiry <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
