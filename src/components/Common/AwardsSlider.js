// src/components/Common/AwardsSlider.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useLanguage } from '../../context/LanguageContext';
import './AwardsSlider.css';

const AwardsSlider = () => {
  const { t } = useLanguage();
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'awards'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setAwards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  if (awards.length === 0) return null;

  const doubled = [...awards, ...awards];

  return (
    <section className="awards-section">
      <div className="awards-bg" />
      <div className="container">
        <div className="section-header">
          <p className="tag tag-gold" style={{ marginBottom: 12 }}>गौरव</p>
          <h2 className="section-title" style={{ color: 'var(--white-warm)' }}>{t('awardsTitle')}</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('awardsSubtitle')}</p>
        </div>
      </div>

      <div className="awards-track-wrap">
        <div className="awards-track">
          {doubled.map((award, i) => (
            <div key={i} className="award-card">
              <div className="award-icon">{award.icon || '🏆'}</div>
              <div className="award-info">
                <h4 className="award-title">{award.title}</h4>
                <p className="award-by">{award.by}</p>
                <span className="award-year">{award.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="awards-fade-left" />
      <div className="awards-fade-right" />
    </section>
  );
};

export default AwardsSlider;