import React, { useState, useEffect } from 'react';
import HeroVideo from '../components/HeroVideo';
import TrustStats from '../components/TrustStats';
import { store } from '../services/store';
import {
  BookOpen, MapPin, Users, Award, CheckCircle2, ArrowRight, Star, 
  Sparkles, ShieldCheck, HeartHandshake, Zap, Target, HelpCircle, PhoneCall
} from 'lucide-react';

export default function HomePage({ onOpenEnquiry, onNavigate, onSelectCourse, onSelectBranch, session }) {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [founders, setFounders] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [customerSession, setCustomerSession] = useState(null);

  useEffect(() => {
    setCustomerSession(session || store.getCustomerSession());
    setCourses(store.getCourses().filter(c => c.status === 'ACTIVE'));
    setBranches(store.getBranches().filter(b => b.status === 'ACTIVE'));
    setTeachers(store.getTeachers().filter(t => t.status === 'ACTIVE'));
    setFounders(store.getFounders());
    setAchievements(store.getAchievements());
    setTestimonials(store.getTestimonials());
    setGallery(store.getGallery());
  }, [session]);

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Small Batch Size (Max 25)',
      description: 'Guarantees 1-on-1 personal attention to every student so no doubt goes unaddressed.',
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      icon: Award,
      title: 'IISc & IITian Lead Faculty',
      description: 'Experienced master educators with proven 15+ years track record of producing top rankers.',
      color: '#059669',
      bg: '#ECFDF5'
    },
    {
      icon: Target,
      title: 'Weekly OMR & Board Tests',
      description: 'Continuous evaluation with instant performance analytics sent to parents via WhatsApp.',
      color: '#D97706',
      bg: '#FEF3C7'
    },
    {
      icon: Sparkles,
      title: 'Smart Air-Conditioned Labs',
      description: 'Digital projector classrooms and equipped science labs for practical concept clarity.',
      color: '#7C3AED',
      bg: '#F3E8FF'
    }
  ];

  return (
    <div style={{ background: '#F8FAFC' }}>

      {/* Personalized Welcome Banner with Quote */}
      {customerSession && (
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderBottom: '2px solid #3B82F6',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.25)'
        }}>
          <div className="container-custom" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                👋
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: '800', margin: 0 }}>
                  Welcome, <span style={{ color: '#60A5FA' }}>{customerSession.name}</span>!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: '0.25rem 0 0 0', fontStyle: 'italic', fontWeight: '500' }}>
                  "Education is the most powerful weapon which you can use to change the world." — Nelson Mandela
                </p>
              </div>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: '700',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <Sparkles size={15} color="#FDE047" /> Student Access Granted
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Muted Video Background */}
      <HeroVideo onOpenEnquiry={onOpenEnquiry} onNavigate={onNavigate} />

      {/* Floating Trust / Statistics Strip */}
      <TrustStats />

      {/* WHY CHOOSE US SECTION */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge-blue" style={{ marginBottom: '0.5rem' }}>
              Why Grow Up Classes?
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
              The Gold Standard in Bengaluru Coaching
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              We combine structured academic discipline with innovative teaching methodologies to unlock your maximum potential.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {whyChooseUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}>
                    <Icon size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge-blue" style={{ marginBottom: '0.5rem' }}>
                Academic Programs
              </span>
              <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
                Courses Crafted for Ranks
              </h2>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              View All Courses <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {courses.slice(0, 3).map((course) => {
              const subjArr = typeof course.subjects === 'string'
                ? (course.subjects.startsWith('[') ? JSON.parse(course.subjects) : course.subjects.split(','))
                : (course.subjects || []);

              return (
                <div
                  key={course.id}
                  className="glass-card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {course.image_url && (
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={course.image_url}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {course.badge && (
                        <span style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                          {course.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="badge-blue" style={{ fontSize: '0.75rem' }}>{course.category}</span>
                      <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                        {course.level}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: '800', marginBottom: '0.5rem' }}>
                      {course.title}
                    </h3>
                    
                    <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.25rem', flex: 1 }}>
                      {course.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {subjArr.slice(0, 4).map((s, idx) => (
                        <span key={idx} style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          ✓ {typeof s === 'string' ? s.trim() : s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '0.65rem', fontSize: '0.875rem' }}
                      >
                        Enroll / Enquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENGALURU BRANCHES SECTION */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge-blue" style={{ marginBottom: '0.5rem' }}>
              Our Campuses
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
              State-of-the-Art Learning Centres
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              Located conveniently across Bengaluru with high-tech classrooms, library facilities, and safe security.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)'
                }}
              >
                {branch.image_url && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={branch.image_url}
                      alt={branch.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {branch.name}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                    <MapPin size={18} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
                    {branch.address}
                  </p>
                  <p style={{ color: '#475569', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                    <PhoneCall size={16} style={{ color: '#059669', flexShrink: 0 }} />
                    <strong>{branch.phone}</strong>
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => onSelectBranch(branch.id)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
                    >
                      Visit Campus / Enquire
                    </button>
                    {branch.map_link && (
                      <a
                        href={branch.map_link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline"
                        style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                      >
                        Map
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPPERS & RESULTS BANNER */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FDE047', fontSize: '0.8rem', fontWeight: '800', padding: '0.35rem 0.85rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Proven Track Record
            </span>
            <h2 style={{ fontSize: '2.5rem', color: '#FFFFFF', fontWeight: '800', marginTop: '0.75rem' }}>
              Our Shining Stars & Board Toppers
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '0.5rem' }}>
              Consistency is our strength. Over 98% of Grow Up Classes students score above 90% in Board & Competitive Exams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {achievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FDE047', marginBottom: '0.25rem' }}>
                  {ach.statistic}
                </div>
                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: '700', marginBottom: '0.25rem' }}>
                  {ach.title}
                </h4>
                {ach.student_name && (
                  <p style={{ color: '#60A5FA', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Student: {ach.student_name}
                  </p>
                )}
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            borderRadius: '28px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 20px 50px rgba(37, 99, 235, 0.3)'
          }}>
            <h2 style={{ fontSize: '2.3rem', fontWeight: '800', marginBottom: '1rem', color: '#FFFFFF' }}>
              Ready to Accelerate Your Academic Career?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#DBEAFE', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
              Book a Free Demo Class or Campus Visit today and interact directly with our IITian & IISc Master Faculty.
            </p>
            <button
              onClick={onOpenEnquiry}
              style={{
                background: '#FFFFFF',
                color: '#1E40AF',
                border: 'none',
                padding: '1rem 2.2rem',
                fontSize: '1.1rem',
                borderRadius: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.2s'
              }}
            >
              Book Free Demo Class Now <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
