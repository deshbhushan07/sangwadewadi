// src/pages/GrampanchayatPage.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../context/LanguageContext';
import './GrampanchayatPage.css';

const roleConfig = {
  sarpanch:        { label: 'सरपंच',     color: 'var(--gold)',      bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.3)',  icon: '👑' },
  deputy_sarpanch: { label: 'उप-सरपंच', color: '#7b5ea7',          bg: 'rgba(123,94,167,0.1)',  border: 'rgba(123,94,167,0.25)', icon: '⭐' },
  member:          { label: 'सदस्य',     color: 'var(--green-mid)', bg: 'rgba(45,138,98,0.08)', border: 'rgba(45,138,98,0.2)',   icon: '🤝' },
};

const noticeTypeConfig = {
  notice: { icon: '📢', color: 'var(--green-deep)', bg: 'rgba(15,61,46,0.06)' },
  tax:    { icon: '💰', color: '#c9a84c',           bg: 'rgba(201,168,76,0.08)' },
  scheme: { icon: '📋', color: 'var(--green-light)', bg: 'rgba(45,138,98,0.06)' },
};

// ─── Avatar component: shows photo or emoji fallback ───
const MemberAvatar = ({ photo, name, size = 90, borderColor, bg, fallbackIcon }) => {
  if (photo) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: `3px solid ${borderColor}`,
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img src={photo} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${borderColor}`,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, flexShrink: 0,
    }}>
      {fallbackIcon}
    </div>
  );
};

const GrampanchayatPage = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: notRef, inView: notIn } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const mq = query(collection(db, 'gpMembers'), orderBy('order', 'asc'));
    const nq = query(collection(db, 'gpNotices'), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(mq, snap => setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsub2 = onSnapshot(nq, snap => setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsub1(); unsub2(); };
  }, []);

  const sarpanch       = members.find(m => m.role === 'sarpanch');
  const deputySarpanch = members.find(m => m.role === 'deputy_sarpanch');
  const membersList    = members.filter(m => m.role === 'member');

  return (
    <>
      <Helmet><title>ग्रामपंचायत | सांगवडेवाडी गाव</title></Helmet>

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <p className="tag tag-gold" style={{ marginBottom: 16 }}>शासन</p>
          <h1 className="page-hero-title">{t('gpTitle')}</h1>
          <p className="page-hero-sub">{t('gpSubtitle')}</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      {/* Sarpanch + Deputy side by side */}
      <section className="section-pad gp-sarpanch-section">
        <div className="container">
          {(sarpanch || deputySarpanch) ? (
            <div className="gp-leaders-row">

              {/* Sarpanch card */}
              {sarpanch && (
                <div className="sarpanch-card glass-card">
                  <div className="sarpanch-avatar">
                    <MemberAvatar
                      photo={sarpanch.photo}
                      name={sarpanch.name}
                      size={160}
                      borderColor="rgba(201,168,76,0.5)"
                      bg="linear-gradient(135deg, var(--green-mist), rgba(201,168,76,0.1))"
                      fallbackIcon="👑"
                    />
                    <div className="sarpanch-crown">👑</div>
                  </div>
                  <div className="sarpanch-info">
                    <span className="sarpanch-role-badge">सरपंच</span>
                    <h2 className="sarpanch-name">{sarpanch.name}</h2>
                    <p className="sarpanch-ward">सांगवडेवाडी ग्रामपंचायत</p>
                    {sarpanch.phone && (
                      <a href={`tel:${sarpanch.phone}`} className="sarpanch-phone">
                        📞 {sarpanch.phone}
                      </a>
                    )}
                    <p className="sarpanch-message">
                      "{sarpanch.message || 'आपल्या गावाचा सर्वांगीण विकास हेच आपले ध्येय आहे. ग्रामस्थांच्या सहकार्याने आपण आपल्या गावाला नवीन उंचीवर नेण्यास सक्षम आहोत.'}"
                    </p>
                  </div>
                </div>
              )}

              {/* Deputy Sarpanch card */}
              {deputySarpanch && (
                <div className="sarpanch-card glass-card deputy-card">
                  <div className="sarpanch-avatar">
                    <MemberAvatar
                      photo={deputySarpanch.photo}
                      name={deputySarpanch.name}
                      size={140}
                      borderColor="rgba(123,94,167,0.4)"
                      bg="linear-gradient(135deg, rgba(123,94,167,0.08), rgba(123,94,167,0.04))"
                      fallbackIcon="⭐"
                    />
                    <div className="sarpanch-crown" style={{ fontSize: '1.4rem' }}>⭐</div>
                  </div>
                  <div className="sarpanch-info">
                    <span className="sarpanch-role-badge deputy-badge">उप-सरपंच</span>
                    <h2 className="sarpanch-name" style={{ fontSize: '1.6rem' }}>{deputySarpanch.name}</h2>
                    <p className="sarpanch-ward">सांगवडेवाडी ग्रामपंचायत</p>
                    {deputySarpanch.phone && (
                      <a href={`tel:${deputySarpanch.phone}`} className="sarpanch-phone">
                        📞 {deputySarpanch.phone}
                      </a>
                    )}
                    {deputySarpanch.message && (
                      <p className="sarpanch-message">"{deputySarpanch.message}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-light)' }}>👑 सरपंच माहिती लवकरच उपलब्ध होईल.</p>
            </div>
          )}
        </div>
      </section>

      {/* Members */}
      <section className="section-pad gp-members-section" ref={ref}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">ग्रामपंचायत सदस्य</h2>
            <p className="section-subtitle">आपले लोकप्रतिनिधी</p>
          </div>

          {membersList.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-light)' }}>🤝 सदस्य माहिती लवकरच उपलब्ध होईल.</p>
            </div>
          ) : (
            <div className={`gp-members-grid ${inView ? 'visible' : ''}`}>
              {membersList.map((m, i) => {
                const cfg = roleConfig[m.role] || roleConfig.member;
                return (
                  <div key={m.id} className="member-card glass-card"
                    style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="member-avatar" style={{ borderColor: cfg.border }}>
                      <MemberAvatar
                        photo={m.photo}
                        name={m.name}
                        size={90}
                        borderColor={cfg.border}
                        bg={cfg.bg}
                        fallbackIcon={cfg.icon}
                      />
                    </div>
                    <div className="member-info">
                      <span className="member-role-badge"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {m.ward || cfg.label}
                      </span>
                      <h4 className="member-name">{m.name}</h4>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="member-phone">📞 {m.phone}</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Notices */}
      <section className="section-pad gp-notices-section" ref={notRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('notices')}</h2>
            <p className="section-subtitle">ग्रामपंचायतीच्या महत्त्वाच्या सूचना</p>
          </div>
          {notices.length === 0 ? (
            <div className="glass-card"
              style={{ textAlign: 'center', padding: 40, maxWidth: 860, margin: '0 auto' }}>
              <p style={{ color: 'var(--text-light)' }}>📢 अद्याप कोणत्याही सूचना नाहीत.</p>
            </div>
          ) : (
            <div className={`notices-list ${notIn ? 'visible' : ''}`}>
              {notices.map((n, i) => {
                const cfg = noticeTypeConfig[n.type] || noticeTypeConfig.notice;
                return (
                  <div key={n.id} className="notice-item glass-card"
                    style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="notice-icon-wrap" style={{ background: cfg.bg }}>
                      <span>{cfg.icon}</span>
                    </div>
                    <div className="notice-content">
                      <div className="notice-header">
                        <h4 className="notice-title" style={{ color: cfg.color }}>{n.title}</h4>
                        <span className="notice-date">📅 {n.date}</span>
                      </div>
                      <p className="notice-body">{n.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* GP Info */}
      <section className="section-pad gp-info-section">
        <div className="container">
          <div className="gp-info-grid">
            <div className="gp-info-card glass-card">
              <h3>🏛️ ग्रामपंचायत कार्यालय</h3>
              <div className="gp-info-details">
                <p>📍 सांगवडेवाडी, करवीर, कोल्हापूर – ४१६२०२</p>
                <p>📞 +91 77209 57999</p>
                <p>🕐 सोमवार ते शनिवार: सकाळी १०:०० – संध्याकाळी ५:३०</p>
                <p>📧 gp.sangwadewadi@maharashtra.gov.in</p>
              </div>
            </div>
            <div className="gp-info-card glass-card">
              <h3>📋 उपलब्ध सेवा</h3>
              <ul className="gp-services-list">
                {['जन्म / मृत्यू प्रमाणपत्र','रहिवासी प्रमाणपत्र','उत्पन्न दाखला',
                  'मालमत्ता कर भरणे','बांधकाम परवानगी','पाणी जोडणी',
                  'स्वच्छता सुविधा','नरेगा कामे'].map((s, i) => (
                  <li key={i}>✅ {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GrampanchayatPage;