// src/pages/ContactPage.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('कृपया नाव आणि संदेश भरा.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'unread',
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success(t('messageSent'));
    } catch (err) {
      toast.error('संदेश पाठवताना त्रुटी झाली. पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: '📍', label: 'पत्ता', value: 'सांगवडेवाडी, करवीर तालुका, कोल्हापूर जिल्हा, महाराष्ट्र – ४१६२०२' },
    { icon: '📞', label: 'दूरध्वनी', value: '+91 XXXXX XXXXX' },
    { icon: '📧', label: 'ईमेल', value: 'sangwadewadi@gmail.com' },
    { icon: '🕐', label: 'कार्यालय वेळ', value: 'सोमवार – शनिवार: सकाळी १०:०० – संध्याकाळी ५:३०' },
  ];

  return (
    <>
      <Helmet><title>संपर्क | सांगवडेवाडी गाव</title></Helmet>

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <p className="tag tag-gold" style={{ marginBottom: 16 }}>संपर्क</p>
          <h1 className="page-hero-title">{t('contactTitle')}</h1>
          <p className="page-hero-sub">{t('contactSubtitle')}</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      <section className="section-pad contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left: info + map */}
            <div className="contact-left">
              <div className="contact-info-cards">
                {contactInfo.map((c, i) => (
                  <div key={i} className="contact-info-item glass-card">
                    <div className="contact-info-icon">{c.icon}</div>
                    <div>
                      <span className="contact-info-label">{c.label}</span>
                      <p className="contact-info-value">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-map glass-card">
                <h3>📍 गावाचे स्थान</h3>
                <div className="map-wrap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15290.542786796257!2d74.32267714848669!3d16.645042944874525!2m3!1f0!2f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0fdb54f539185%3A0x7dd4a5531e867b87!2sSangwadewadi%2C%20Maharashtra%20416202!5e0!3m2!1sen!2sin!4v1777145067424!5m2!1sen!2sin"
                    width="100%"
                    height="340"
                    style={{ border: 0, borderRadius: 'var(--radius-md)', display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sangwadewadi Map"
                  />
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="contact-right">
              <div className="contact-form-card glass-card">
                <h2 className="contact-form-title">✉️ आम्हाला संदेश पाठवा</h2>
                <p className="contact-form-sub">आपला प्रश्न, सूचना किंवा तक्रार आम्हाला कळवा. आम्ही लवकरच संपर्क करू.</p>

                {sent ? (
                  <div className="form-success">
                    <span>✅</span>
                    <h3>संदेश पाठवला!</h3>
                    <p>आपला संदेश यशस्वीरित्या पाठवण्यात आला. आम्ही लवकरच संपर्क करू.</p>
                    <button className="btn-primary" onClick={() => setSent(false)} style={{ marginTop: 16 }}>
                      नवीन संदेश पाठवा
                    </button>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">{t('name')} *</label>
                      <input
                        className="form-input"
                        type="text"
                        name="name"
                        placeholder="आपले पूर्ण नाव"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t('email')}</label>
                        <input
                          className="form-input"
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">दूरध्वनी</label>
                        <input
                          className="form-input"
                          type="tel"
                          name="phone"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('message')} *</label>
                      <textarea
                        className="form-input form-textarea"
                        name="message"
                        placeholder="आपला संदेश येथे लिहा..."
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary contact-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>⏳ पाठवत आहे...</>
                      ) : (
                        <>
                          {t('send')}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
