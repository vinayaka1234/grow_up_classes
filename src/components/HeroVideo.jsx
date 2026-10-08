import React, { useEffect, useRef } from 'react';
import { Play, ArrowRight, MapPin, Award, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export default function HeroVideo({ onOpenEnquiry, onNavigate }) {
  const canvasRef = useRef(null);

  // Canvas particle background animation for background depth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #0F172A 100%)',
      color: '#FFFFFF'
    }}>
      {/* Video Background with overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          opacity: 0.38,
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-teacher-giving-a-class-to-her-students-41551-large.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-hallway-43360-large.mp4" type="video/mp4" />
      </video>

      {/* Dark & Vibrant Blue Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.85) 70%, #0F172A 100%)',
        zIndex: 1
      }} />

      {/* Particle Overlay Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
      />

      {/* Hero Content Container */}
      <div className="container-custom" style={{ position: 'relative', zIndex: 10, padding: '4rem 1.25rem' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '9999px',
            padding: '0.4rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#93C5FD',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <Sparkles size={16} color="#FBBF24" />
            <span>Bengaluru’s Premier Multi-Branch Tuition Institute</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: '800',
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Empowering Minds, Securing Board & <span className="gradient-text">Entrance Top Ranks</span>
          </h1>

          {/* Subtitle / Brand Promise */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#CBD5E1',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2.25rem',
            fontWeight: '400'
          }}>
            State-of-the-art interactive smart classrooms, IISc & IITian faculty mentors, and personalized learning across <strong style={{ color: '#60A5FA' }}>8 Bengaluru Branches</strong> for Class 6–12, SSLC, CBSE, JEE & NEET.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => onOpenEnquiry()}
              className="btn-emerald"
              style={{ padding: '0.95rem 2rem', fontSize: '1.05rem', borderRadius: '14px' }}
            >
              Enquire For Admission <ArrowRight size={20} />
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="btn-primary"
              style={{ padding: '0.95rem 1.75rem', fontSize: '1.05rem', borderRadius: '14px' }}
            >
              <BookOpen size={20} /> Explore Courses
            </button>

            <button
              onClick={() => onNavigate('branches')}
              className="btn-secondary"
              style={{
                padding: '0.95rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF'
              }}
            >
              <MapPin size={18} color="#60A5FA" /> Find Branch Near You
            </button>
          </div>

          {/* Quick Trust Highlights Strip */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.875rem',
            color: '#94A3B8',
            fontWeight: '600',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} color="#10B981" /> 100% Verified Faculty
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} color="#10B981" /> SSLC State 1st Rank Holder 2025
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} color="#10B981" /> Small Batch Sizes (Max 25)
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
