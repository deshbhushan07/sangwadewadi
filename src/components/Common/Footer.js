// src/components/Common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/gallery', label: t('gallery') },
    { to: '/blog', label: t('blog') },
    { to: '/grampanchayat', label: t('grampanchayat') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">🏡</div>
                <div>
                  <div className="footer-logo-name">सांगवडेवाडी</div>
                  <div className="footer-logo-sub">ग्राम संकेतस्थळ</div>
                </div>
              </div>
              <p className="footer-tagline">{t('footerTagline')}</p>
              <div className="footer-address">
                <p>📍 सांगवडेवाडी, करवीर तालुका</p>
                <p>कोल्हापूर जिल्हा, महाराष्ट्र – ४१६२०२</p>
              </div>
            </div>

            {/* Quick links */}
            <div className="footer-col">
              <h4 className="footer-col-title">{t('quickLinks')}</h4>
              <ul className="footer-links">
                {links.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-link">
                      <span>→</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4 className="footer-col-title">{t('contact')}</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <span>📞</span>
                  <span>+91 XXXXX XXXXX</span>
                </div>
                <div className="footer-contact-item">
                  <span>📧</span>
                  <span>sangwadewadi@gmail.com</span>
                </div>
                <div className="footer-contact-item">
                  <span>🕐</span>
                  <span>सोम–शनि, सकाळी १०–संध्या ५</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="footer-col">
              <h4 className="footer-col-title">{t('followUs')}</h4>
              <div className="footer-social">
                {[
                  { icon: '📘', label: 'Facebook', href: '#' },
                  { icon: '📸', label: 'Instagram', href: '#' },
                  { icon: '▶️', label: 'YouTube', href: '#' },
                  { icon: '🐦', label: 'Twitter', href: '#' },
                ].map(s => (
                  <a key={s.label} href={s.href} className="social-btn" target="_blank" rel="noopener noreferrer">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>© {year} सांगवडेवाडी ग्रामपंचायत. {t('allRights')}.</p>
            <p className="footer-credit">
              <Link to="/admin" className="admin-link-footer">प्रशासन पॅनेल</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
