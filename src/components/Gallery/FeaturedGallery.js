// src/components/Gallery/FeaturedGallery.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../context/LanguageContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './FeaturedGallery.css';

const placeholderItems = [
  { id: '1', type: 'image', url: null, category: 'festivals', caption: 'गणेशोत्सव सोहळा' },
  { id: '2', type: 'image', url: null, category: 'nature', caption: 'गावाचे निसर्गसौंदर्य' },
  { id: '3', type: 'image', url: null, category: 'events', caption: 'स्वातंत्र्यदिन कार्यक्रम' },
  { id: '4', type: 'image', url: null, category: 'people', caption: 'ग्रामस्थांची भेट' },
  { id: '5', type: 'image', url: null, category: 'festivals', caption: 'दीपावली उत्सव' },
  { id: '6', type: 'image', url: null, category: 'nature', caption: 'शेत परिसर' },
];

const emojiMap = {
  festivals: '🎉',
  nature: '🌿',
  events: '📅',
  people: '👥',
};

const FeaturedGallery = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState(placeholderItems);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(6));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return unsub;
  }, []);

  const realImages = items.filter(i => i.url).map(i => ({ src: i.url }));

  const handleClick = (index) => {
    if (realImages.length > 0) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <section className="featured-gallery section-pad" ref={ref}>
      <div className="gallery-bg-accent" />
      <div className="container">
        <div className="section-header">
          <p className="tag tag-green" style={{ marginBottom: 12 }}>दालन</p>
          <h2 className="section-title">{t('galleryTitle')}</h2>
          <p className="section-subtitle">{t('gallerySubtitle')}</p>
        </div>

        <div className={`gallery-masonry ${inView ? 'visible' : ''}`}>
          {items.slice(0, 6).map((item, i) => (
            <div
              key={item.id}
              className={`gallery-item gallery-item-${(i % 3) + 1}`}
              onClick={() => handleClick(i)}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {item.url ? (
                <img src={item.url} alt={item.caption} loading="lazy" />
              ) : (
                <div className="gallery-placeholder">
                  <span>{emojiMap[item.category] || '🖼️'}</span>
                  <p>{item.caption}</p>
                </div>
              )}
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <span className="gallery-zoom-icon">🔍</span>
                  <p>{item.caption}</p>
                  <span className="gallery-cat-badge">{t(item.category) || item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/gallery" className="btn-primary">
            {t('viewAll')} दालन
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {lightboxOpen && realImages.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={realImages}
        />
      )}
    </section>
  );
};

export default FeaturedGallery;
