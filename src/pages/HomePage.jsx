import React, { useState, useEffect } from 'react';
import HeroVideo from '../components/HeroVideo';
import TrustStats from '../components/TrustStats';
import { store } from '../services/store';
import {
  BookOpen, MapPin, Users, Award, CheckCircle2, ArrowRight, Star, 
  Sparkles, ShieldCheck, HeartHandshake, Zap, Target, HelpCircle, PhoneCall
} from 'lucide-react';

export default function HomePage({ onOpenEnquiry, onNavigate, onSelectCourse, onSelectBranch }) {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [founders, setFounders] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    setCourses(store.getCourses().filter(c => c.status === 'ACTIVE'));
    setBranches(store.getBranches().filter(b => b.status === 'ACTIVE'));
    setTeachers(store.getTeachers().filter(t => t.status === 'ACTIVE'));
    setFounders(store.getFounders());
    setAchievements(store.getAchievements());
    setTestimonials(store.getTestimonials());
    setGallery(store.getGallery());
  }, []);

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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
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

      {/* TOP COURSES SHOWCASE */}
      <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <span className="badge-green" style={{ marginBottom: '0.5rem' }}>
                Academic Programs
              </span>
              <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
                Top Offered Courses
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Tailored for State Board, CBSE, ICSE, KCET, JEE Main & NEET Medical aspirants.
              </p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              View All Courses <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-responsive-3">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 2
                  }}>
                    <span className="badge-gold">{course.badge}</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {course.level}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.75rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
                      {course.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {course.subjects.slice(0, 3).map((sub, idx) => (
                        <span key={idx} style={{
                          background: '#F1F5F9',
                          color: '#334155',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                  >
                    Enquire for this Course <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENGALURU BRANCHES PREVIEW */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>
              Multi-Location Network
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
              Our Bengaluru Branches
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Conveniently located learning centers across key residential and education hubs in Bengaluru.
            </p>
          </div>

          <div className="grid-responsive-3">
            {branches.slice(0, 3).map((branch) => (
              <div
                key={branch.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} /> {branch.area}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
                    {branch.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {branch.address}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: '600', marginBottom: '1.25rem' }}>
                    📞 {branch.phone}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onSelectBranch(branch.id)}
                    className="btn-emerald"
                    style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem' }}
                  >
                    Enquire Branch
                  </button>
                  <a
                    href={branch.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', fontSize: '0.85rem' }}
                  >
                    Map
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={() => onNavigate('branches')} className="btn-secondary" style={{ padding: '0.8rem 1.75rem' }}>
              Explore All 8 Bengaluru Branches <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* TOPPERS & ACHIEVEMENTS HIGHLIGHT */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>
              Hall of Fame 2025
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', fontWeight: '800' }}>
              Proven Academic Results & Toppers
            </h2>
            <p style={{ color: '#93C5FD', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Celebrating our stellar students who secured top ranks in SSLC, CBSE, JEE & NEET.
            </p>
          </div>

          <div className="grid-responsive-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#FBBF24',
                  marginBottom: '0.25rem'
                }}>
                  {ach.statistic}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.25rem' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#60A5FA', fontWeight: '600', marginBottom: '0.75rem' }}>
                  {ach.studentName}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET OUR FACULTY PREVIEW */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF' }}>
        <div className="container-custom">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <span className="badge-blue" style={{ marginBottom: '0.5rem' }}>
                Master Educators
              </span>
              <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
                Meet Our Lead Teachers
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Distinguished faculty from IISc, IITs, and leading universities.
              </p>
            </div>
            <button onClick={() => onNavigate('teachers')} className="btn-secondary">
              View All Faculty <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-responsive-4">
            {teachers.map((tch) => (
              <div
                key={tch.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  paddingBottom: '1.25rem'
                }}
              >
                <img
                  src={tch.image}
                  alt={tch.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem 1rem 0' }}>
                  <span className="badge-gold" style={{ marginBottom: '0.4rem', fontSize: '0.7rem' }}>
                    {tch.rating}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {tch.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: '700', marginBottom: '0.4rem' }}>
                    {tch.qualification}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>
                    {tch.subject}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENT & STUDENT TESTIMONIALS */}
      <section style={{ padding: '4rem 0', background: '#F8FAFC' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge-green" style={{ marginBottom: '0.5rem' }}>
              Real Feedback
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#0F172A', fontWeight: '800' }}>
              What Parents & Students Say
            </h2>
          </div>

          <div className="grid-responsive-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.75rem', color: '#F59E0B' }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    "{t.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>{t.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL HIGH-CONVERSION ENQUIRY CTA BANNER */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', color: '#FFFFFF' }}>
        <div className="container-custom" style={{ textAlign: 'center', maxWidth: '760px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#FFFFFF' }}>
            Ready to Accelerate Your Academic Journey?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#DBEAFE', marginBottom: '2rem', lineHeight: '1.6' }}>
            Join over 12,500+ successful students across Bengaluru. Book a free diagnostic counseling session at your nearest branch today.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => onOpenEnquiry()} className="btn-emerald" style={{ padding: '1rem 2.25rem', fontSize: '1.1rem' }}>
              <PhoneCall size={20} /> Enquire Now For Admission
            </button>
            <button onClick={() => onNavigate('branches')} className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Locate Nearest Branch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
