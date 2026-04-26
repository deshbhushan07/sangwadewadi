// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/gallery', label: t('gallery') },
    { to: '/blog', label: t('blog') },
    { to: '/grampanchayat', label: t('grampanchayat') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 10v16h24V10L14 2z" fill="currentColor" opacity="0.15"/>
              <path d="M14 2L2 10v16h24V10L14 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M10 26V16h8v10" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">सांगवडेवाडी</span>
            <span className="brand-sub">ग्राम संकेतस्थळ</span>
          </div>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link to="/admin" className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              ⚙ {t('admin')}
            </Link>
          )}
        </div>

        <div className="nav-right">
          <div className="lang-switcher">
            {['mr', 'hi', 'en'].map(lang => (
              <button
                key={lang}
                className={`lang-btn ${language === lang ? 'active' : ''}`}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'mr' ? 'मर' : lang === 'hi' ? 'हि' : 'EN'}
              </button>
            ))}
          </div>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
