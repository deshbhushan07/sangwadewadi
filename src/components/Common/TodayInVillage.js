// src/components/Common/TodayInVillage.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../context/LanguageContext';
import './TodayInVillage.css';

const defaultUpdates = [
  { type: 'event', title: 'ग्रामसभा बैठक', desc: 'दि. ३० एप्रिल रोजी ग्रामसभेची बैठक आयोजित करण्यात आली आहे.', time: 'आज सकाळी ११:०० वाजता' },
  { type: 'notice', title: 'पाणीपुरवठा सूचना', desc: 'उद्या सकाळी ९ ते ११ दरम्यान पाणीपुरवठा बंद राहणार आहे.', time: 'काल प्रकाशित' },
  { type: 'achievement', title: 'स्वच्छता मोहीम यशस्वी', desc: 'गावातील स्वच्छता मोहीम यशस्वीरित्या पार पडली. सर्व ग्रामस्थांचे आभार.', time: '२ दिवसांपूर्वी' },
];

const typeConfig = {
  event: { icon: '📅', color: '#2d8a62', bg: 'rgba(45,138,98,0.08)', label: 'कार्यक्रम' },
  notice: { icon: '📢', color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', label: 'सूचना' },
  achievement: { icon: '🏆', color: '#0F3D2E', bg: 'rgba(15,61,46,0.06)', label: 'उपलब्धी' },
};

const TodayInVillage = () => {
  const { t } = useLanguage();
  const [updates, setUpdates] = useState(defaultUpdates);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const q = query(collection(db, 'todayUpdates'), orderBy('createdAt', 'desc'), limit(6));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return unsub;
  }, []);

  return (
    <section className="today-section section-pad" ref={ref}>
      <div className="container">
        <div className="section-header">
          <p className="tag tag-green" style={{ marginBottom: 12 }}>Live Updates</p>
          <h2 className="section-title">{t('todayTitle')}</h2>
          <p className="section-subtitle">{t('todaySubtitle')}</p>
        </div>

        <div className={`today-grid ${inView ? 'visible' : ''}`}>
          {updates.length === 0 ? (
            <div className="no-updates glass-card">
              <span>📭</span>
              <p>{t('noUpdates')}</p>
            </div>
          ) : (
            updates.map((u, i) => {
              const cfg = typeConfig[u.type] || typeConfig.notice;
              return (
                <div
                  key={u.id || i}
                  className="today-card glass-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="today-card-header" style={{ background: cfg.bg }}>
                    <span className="today-icon">{cfg.icon}</span>
                    <span className="today-type-label" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="today-time">{u.time || u.createdAt?.toDate?.()?.toLocaleDateString?.('mr-IN') || ''}</span>
                  </div>
                  <div className="today-card-body">
                    <h4 className="today-title">{u.title}</h4>
                    <p className="today-desc">{u.desc}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default TodayInVillage;
