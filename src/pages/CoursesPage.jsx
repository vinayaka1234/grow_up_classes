import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { BookOpen, CheckCircle2, Clock, Calendar, ArrowRight, Sparkles, Filter, X } from 'lucide-react';

export default function CoursesPage({ onOpenEnquiry, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedModalCourse, setSelectedModalCourse] = useState(null);

  useEffect(() => {
    setCourses(store.getCourses().filter(c => c.status === 'ACTIVE'));
  }, []);

  const filterCategories = [
    { id: 'ALL', label: 'All Programs' },
    { id: 'Class 10', label: 'Class 10 SSLC & CBSE' },
    { id: 'Class 11-12 Science', label: '11th & 12th Science' },
    { id: 'Entrance Exams', label: 'JEE & NEET Integrated' },
    { id: 'Class 6-9 Foundation', label: 'Class 6-9 Foundation' },
    { id: 'Class 11-12 Commerce', label: '11th & 12th Commerce' }
  ];

  const filteredCourses = activeFilter === 'ALL' 
    ? courses 
    : courses.filter(c => c.category === activeFilter);

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
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Academic Offerings</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Comprehensive Tuition Programs
          </h1>
          <p style={{ color: '#93C5FD', fontSize: '1.05rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Explore state-aligned board coaching and top competitive entrance prep across our Bengaluru branches.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '2.5rem' }}>
        
        {/* Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          marginBottom: '2.5rem'
        }}>
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: activeFilter === cat.id ? '1px solid #2563EB' : '1px solid #CBD5E1',
                background: activeFilter === cat.id ? '#2563EB' : '#FFFFFF',
                color: activeFilter === cat.id ? '#FFFFFF' : '#334155',
                fontWeight: activeFilter === cat.id ? '700' : '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeFilter === cat.id ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid-responsive-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="glass-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge-gold" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                    {course.badge}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <span className="badge-blue" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                    {course.level}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {course.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#334155', background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', marginBottom: '1rem' }}>
                    <div><strong>Duration:</strong> {course.duration}</div>
                    <div><strong>Batches:</strong> {course.batchTimings}</div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>Key Subjects Covered:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {course.subjects.map((sub, idx) => (
                        <span key={idx} style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedModalCourse(course)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  View Details
                </button>
                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="btn-emerald"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  Enquire Course
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Course Details Modal */}
      {selectedModalCourse && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px', position: 'relative' }}>
            <button
              onClick={() => setSelectedModalCourse(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>{selectedModalCourse.badge}</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>{selectedModalCourse.title}</h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '1.25rem' }}>{selectedModalCourse.description}</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div style={{ marginBottom: '0.4rem' }}><strong>Target Level:</strong> {selectedModalCourse.level}</div>
              <div style={{ marginBottom: '0.4rem' }}><strong>Course Duration:</strong> {selectedModalCourse.duration}</div>
              <div><strong>Timings & Schedules:</strong> {selectedModalCourse.batchTimings}</div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>Program Features & Highlights:</h4>
            <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {selectedModalCourse.features.map((feat, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>{feat}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                const cid = selectedModalCourse.id;
                setSelectedModalCourse(null);
                onSelectCourse(cid);
              }}
              className="btn-emerald"
              style={{ width: '100%', padding: '0.9rem' }}
            >
              Enquire for Admission in this Course <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
