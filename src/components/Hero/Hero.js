// src/components/Hero/Hero.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const slides = [
  {
    bg: 'linear-gradient(135deg, #0a2d20 0%, #1a5c44 40%, #2d8a62 100%)',
    overlay: 'rgba(10,30,20,0.45)',
    pattern: '🌿',
  },
  {
    bg: 'linear-gradient(135deg, #0F3D2E 0%, #1e6b4a 50%, #0a2d20 100%)',
    overlay: 'rgba(10,25,18,0.5)',
    pattern: '🏡',
  },
  {
    bg: 'linear-gradient(135deg, #1a2e1a 0%, #2d5a2d 50%, #0F3D2E 100%)',
    overlay: 'rgba(15,35,15,0.5)',
    pattern: '🌾',
  },
];

const stats = [
  { value: '२,५३३', labelMr: 'लोकसंख्या (२०११)' },
  { value: '५२९', labelMr: 'एकूण घरे' },
  { value: '२६२ हे.', labelMr: 'क्षेत्रफळ' },
  { value: '१५ किमी', labelMr: 'कोल्हापूरपासून' },
];

const Hero = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {/* Background slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ background: slide.bg }}
        >
          <div className="hero-pattern">
            {Array.from({ length: 20 }, (_, j) => (
              <span key={j} className="leaf-icon" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                fontSize: `${0.8 + Math.random() * 1.2}rem`,
                opacity: 0.06 + Math.random() * 0.06,
              }}>
                {['🌿', '🍃', '🌾', '☘'][Math.floor(Math.random() * 4)]}
              </span>
            ))}
          </div>
          <div className="hero-overlay" style={{ background: slide.overlay }} />
        </div>
      ))}

      {/* SVG Landscape */}
      <div className="hero-landscape">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 C200,60 400,160 600,100 C800,40 1000,140 1200,80 L1440,100 L1440,200 L0,200 Z"
            fill="rgba(15,61,46,0.3)" />
          <path d="M0,150 C300,90 600,170 900,120 C1100,85 1300,150 1440,130 L1440,200 L0,200 Z"
            fill="rgba(10,30,20,0.4)" />
          {/* Houses silhouette */}
          <g fill="rgba(255,255,255,0.08)">
            <rect x="100" y="140" width="30" height="40" />
            <polygon points="85,140 115,115 145,140" />
            <rect x="200" y="145" width="25" height="35" />
            <polygon points="187,145 212,122 237,145" />
            <rect x="1250" y="138" width="35" height="42" />
            <polygon points="1232,138 1267,112 1302,138" />
            <rect x="1330" y="145" width="28" height="35" />
            <polygon points="1316,145 1344,120 1372,145" />
          </g>
          {/* Trees */}
          <g fill="rgba(255,255,255,0.06)">
            <ellipse cx="350" cy="135" rx="18" ry="28" />
            <rect x="347" y="155" width="6" height="20" />
            <ellipse cx="1080" cy="130" rx="22" ry="32" />
            <rect x="1077" y="152" width="6" height="22" />
          </g>
        </svg>
      </div>

      {/* Main content */}
      <div className={`hero-content ${animating ? 'fade-exit' : 'fade-enter'}`}>
        <div className="hero-badge">
          <span>📍</span>
          <span>महाराष्ट्र • कोल्हापूर • करवीर</span>
        </div>

        <h1 className="hero-title">{t('welcome')}</h1>
        <p className="hero-subtitle">{t('subtitle')}</p>

        <div className="hero-actions">
          <Link to="/about" className="btn-primary hero-btn">
            {t('heroBtn1')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/gallery" className="btn-secondary hero-btn-outline">
            {t('heroBtn2')}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="hero-stats">
          {stats.map((s, i) => (
 				 	<div key={i} className="hero-stat">
    				<span className="hero-stat-val">{s.value}</span>
    				<span className="hero-stat-label">{s.labelMr}</span>
  				</div>
					))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>स्क्रोल करा</span>
      </div>

      {/* Wave bottom */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
            fill="var(--white-warm)" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
