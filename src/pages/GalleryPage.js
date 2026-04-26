// src/pages/GalleryPage.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './GalleryPage.css';

const FILTERS = ['all', 'festivals', 'nature', 'events', 'people'];

const defaultGallery = [
  { id: '1', category: 'festivals', caption: 'गणेशोत्सव', url: null, type: 'image' },
  { id: '2', category: 'nature', caption: 'हिरवा निसर्ग', url: null, type: 'image' },
  { id: '3', category: 'events', caption: 'स्वातंत्र्यदिन', url: null, type: 'image' },
  { id: '4', category: 'people', caption: 'ग्रामसभा', url: null, type: 'image' },
  { id: '5', category: 'festivals', caption: 'दीपावली', url: null, type: 'image' },
  { id: '6', category: 'nature', caption: 'शेत', url: null, type: 'image' },
  { id: '7', category: 'events', caption: 'events', caption: 'पुरस्कार सोहळा', url: null, type: 'image' },
  { id: '8', category: 'people', caption: 'महिला बचत गट', url: null, type: 'image' },
  { id: '9', category: 'nature', caption: 'गावाचे सौंदर्य', url: null, type: 'image' },
];

const emojiMap = { festivals: '🎉', nature: '🌿', events: '📅', people: '👥' };

const GalleryPage = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState(defaultGallery);
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const slides = filtered.filter(i => i.url).map(i => ({ src: i.url }));

  const handleClick = (index) => {
    const realIdx = filtered.slice(0, index + 1).filter(i => i.url).length - 1;
    if (realIdx >= 0) {
      setLightboxIndex(realIdx);
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>छायाचित्र दालन | सांगवडेवाडी गाव</title>
      </Helmet>

      {/* Hero */}
      <section className="page-hero gallery-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <p className="tag tag-gold" style={{ marginBottom: 16 }}>दालन</p>
          <h1 className="page-hero-title">{t('galleryTitle')}</h1>
          <p className="page-hero-sub">{t('gallerySubtitle')}</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      {/* Filter */}
      <section className="section-pad gallery-page-section">
        <div className="container">
          <div className="gallery-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? t('all') : t(f)}
              </button>
            ))}
          </div>

          <div className="gallery-page-grid">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="gallery-page-item"
                onClick={() => handleClick(i)}
                style={{ animationDelay: `${(i % 9) * 0.06}s` }}
              >
                {item.url ? (
                  <img src={item.url} alt={item.caption} loading="lazy" />
                ) : (
                  <div className="gallery-page-placeholder">
                    <span>{emojiMap[item.category] || '🖼️'}</span>
                    <p>{item.caption}</p>
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="video-badge">▶ Video</div>
                )}
                <div className="gallery-page-overlay">
                  <span className="gallery-page-zoom">🔍</span>
                  <p>{item.caption}</p>
                  <span className="gal-cat-pill">{t(item.category) || item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="gallery-empty glass-card">
              <span>🖼️</span>
              <p>या श्रेणीत अद्याप कोणतेही चित्र नाहीत.</p>
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && slides.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
        />
      )}
    </>
  );
};

export default GalleryPage;
