// src/components/Common/AboutPreview.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../context/LanguageContext';
import './AboutPreview.css';

const AboutPreview = () => {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const features = [
    { icon: '🌾', label: 'शेती व निसर्ग', sub: 'Agricultural Heritage' },
    { icon: '🏛️', label: 'समृद्ध इतिहास', sub: 'Rich History' },
    { icon: '🎉', label: 'सांस्कृतिक उत्सव', sub: 'Cultural Festivals' },
    { icon: '🤝', label: 'एकात्मता', sub: 'Community Unity' },
  ];

  return (
    <section className="about-preview section-pad pattern-bg" ref={ref}>
      <div className="container">
        <div className={`about-grid ${inView ? 'visible' : ''}`}>
          {/* Visual side */}
          <div className="about-visual">
            <div className="about-main-card glass-card">
              <div className="about-icon-large">🏡</div>
              <h3>सांगवडेवाडी</h3>
              <p>Sangwadewadi</p>
              <div className="about-detail-row">
                <span>📍 करवीर, कोल्हापूर</span>
              </div>
              <div className="about-detail-row">
                <span>📮 PIN: 416202</span>
              </div>
              <div className="about-detail-row">
                <span>👥 ~4000 लोकसंख्या</span>
              </div>
            </div>
            <div className="about-feature-grid">
              {features.map((f, i) => (
                <div key={i} className="about-feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="feature-emoji">{f.icon}</span>
                  <span className="feature-label">{f.label}</span>
                  <span className="feature-sub">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text side */}
          <div className="about-text-side">
            <div className="section-header" style={{ textAlign: 'left' }}>
              <p className="tag tag-green" style={{ marginBottom: 12 }}>आमच्याबद्दल</p>
              <h2 className="section-title">{t('aboutTitle')}</h2>
              <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--green-light))', borderRadius: 2, marginTop: 16, marginBottom: 0 }} />
            </div>

            <p className="about-main-text">{t('aboutText')}</p>

            <p className="about-extra-text">
              हे गाव महाराष्ट्राच्या पश्चिम घाटाच्या कुशीत वसलेले आहे. येथील शेतकरी, महिला, युवा आणि ज्येष्ठ नागरिक एकमेकांच्या सहाय्याने गावाच्या विकासासाठी सदैव तत्पर असतात. ग्रामपंचायतीच्या नेतृत्वाखाली अनेक विकास कामे यशस्वीपणे पार पाडली गेली आहेत.
            </p>

            <div className="about-highlights">
              {[
                { num: '५०+', text: 'वर्षांचा इतिहास' },
                { num: '१२+', text: 'पुरस्कार' },
                { num: '१००%', text: 'साक्षरता लक्ष्य' },
              ].map((h, i) => (
                <div key={i} className="highlight-item">
                  <span className="highlight-num">{h.num}</span>
                  <span className="highlight-text">{h.text}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-primary" style={{ marginTop: 8 }}>
              {t('readMore')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
