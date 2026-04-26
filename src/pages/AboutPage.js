// src/pages/AboutPage.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../context/LanguageContext';
import './AboutPage.css';

const milestones = [
  { year: '१९५०', event: 'ग्रामपंचायतीची स्थापना', icon: '🏛️' },
  { year: '१९७०', event: 'प्राथमिक शाळेची स्थापना', icon: '🏫' },
  { year: '१९८५', event: 'पाणीपुरवठा योजना सुरू', icon: '💧' },
  { year: '२०००', event: 'विद्युत जोडणी संपूर्ण गावात', icon: '⚡' },
  { year: '२०१०', event: 'डिजिटल ग्राम योजना सुरू', icon: '💻' },
  { year: '२०२०', event: 'उत्कृष्ट ग्रामपंचायत पुरस्कार', icon: '🏆' },
  { year: '२०२३', event: 'ग्राम संकेतस्थळ सुरू', icon: '🌐' },
];

const facts = [
  { label: 'लोकसंख्या', value: '~४०००', icon: '👥' },
  { label: 'पिन कोड', value: '४१६२०२', icon: '📮' },
  { label: 'तालुका', value: 'करवीर', icon: '🗺️' },
  { label: 'जिल्हा', value: 'कोल्हापूर', icon: '📍' },
  { label: 'राज्य', value: 'महाराष्ट्र', icon: '🇮🇳' },
  { label: 'ग्रामपंचायत स्थापना', value: '१९५०', icon: '🏛️' },
];

const AboutPage = () => {
  const { t } = useLanguage();
  const { ref: heroRef } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: timeRef, inView: timeIn } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <>
      <Helmet>
        <title>आमच्याबद्दल | सांगवडेवाडी गाव</title>
      </Helmet>

      {/* Page Hero */}
      <section className="page-hero about-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content" ref={heroRef}>
          <p className="tag tag-gold" style={{ marginBottom: 16 }}>आमच्याबद्दल</p>
          <h1 className="page-hero-title">{t('aboutTitle')}</h1>
          <p className="page-hero-sub">करवीर तालुका • कोल्हापूर • महाराष्ट्र</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      {/* Main About */}
      <section className="section-pad">
        <div className="container">
          <div className="about-full-grid">
            <div className="about-full-text">
              <h2 className="section-title">सांगवडेवाडीची ओळख</h2>
              <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg,var(--gold),var(--green-light))', borderRadius: 2, margin: '16px 0 24px' }} />
              <p>सांगवडेवाडी हे कोल्हापूर जिल्ह्यातील करवीर तालुक्यात वसलेले एक सुंदर व समृद्ध गाव आहे. सुमारे ४००० लोकसंख्या असलेले हे गाव महाराष्ट्राच्या पश्चिम घाटाच्या नैसर्गिक सौंदर्याने नटलेले आहे.</p>
              <p>येथील शेती हाच मुख्य व्यवसाय असून ऊस, भाजीपाला, आणि फुलशेती हे प्रमुख पिके आहेत. गावातील शेतकरी आधुनिक शेती तंत्रज्ञान वापरून आपल्या उत्पादनात वाढ करत आहेत.</p>
              <p>गावातील शिक्षणाची पातळी उंचावण्यासाठी प्राथमिक व माध्यमिक शाळांमध्ये दर्जेदार शिक्षण दिले जाते. युवा पिढी उच्चशिक्षण घेऊन गावाच्या विकासात योगदान देत आहे.</p>
              <p>ग्रामपंचायतीच्या नेतृत्वाखाली रस्ते, पाणी, वीज, आणि स्वच्छतेच्या क्षेत्रात अनेक विकासकामे यशस्वीपणे पार पाडण्यात आली आहेत. गाव शहराशी जोडणाऱ्या रस्त्यांचे डांबरीकरण, गटारयोजना, आणि सोलर दिव्यांची व्यवस्था या सुविधा गावात उपलब्ध आहेत.</p>
            </div>

            <div className="about-facts-panel">
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ color: 'var(--green-deep)', marginBottom: 24, fontSize: '1.2rem' }}>📋 गावाची माहिती</h3>
                <div className="facts-grid">
                  {facts.map((f, i) => (
                    <div key={i} className="fact-item">
                      <span className="fact-icon">{f.icon}</span>
                      <div>
                        <span className="fact-label">{f.label}</span>
                        <span className="fact-value">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Village highlights */}
      <section className="section-pad about-highlights-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">गावाची वैशिष्ट्ये</h2>
            <p className="section-subtitle">आमच्या गावाचा अभिमान</p>
          </div>
          <div className="highlights-cards">
            {[
              { icon: '🌾', title: 'शेती व कृषी', desc: 'ऊस, भाजीपाला व फुलशेतीसाठी प्रसिद्ध. आधुनिक शेती तंत्रज्ञानाचा वापर.' },
              { icon: '🎭', title: 'संस्कृती व उत्सव', desc: 'गणेशोत्सव, दीपावली, होळी हे उत्सव मोठ्या उत्साहाने साजरे केले जातात.' },
              { icon: '📚', title: 'शिक्षण', desc: 'प्राथमिक व माध्यमिक शाळा. युवा पिढी उच्चशिक्षणाकडे वळत आहे.' },
              { icon: '🏥', title: 'आरोग्य सुविधा', desc: 'प्राथमिक आरोग्य केंद्र उपलब्ध. नियमित आरोग्य तपासणी शिबिरे.' },
              { icon: '🌿', title: 'पर्यावरण', desc: 'वृक्षारोपण मोहीम, जलसंधारण प्रकल्प व स्वच्छ गाव योजना.' },
              { icon: '🤝', title: 'सामाजिक एकता', desc: 'जातिभेद विरहित समाज. महिला, युवा व ज्येष्ठांचा सक्रिय सहभाग.' },
            ].map((h, i) => (
              <div key={i} className="highlight-card glass-card">
                <span className="highlight-card-icon">{h.icon}</span>
                <h4>{h.title}</h4>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad timeline-section" ref={timeRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">गावाचा इतिहास</h2>
            <p className="section-subtitle">महत्त्वाचे टप्पे</p>
          </div>
          <div className={`timeline ${timeIn ? 'visible' : ''}`}>
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="timeline-dot">{m.icon}</div>
                <div className="timeline-content glass-card">
                  <span className="timeline-year">{m.year}</span>
                  <p className="timeline-event">{m.event}</p>
                </div>
              </div>
            ))}
            <div className="timeline-line" />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
