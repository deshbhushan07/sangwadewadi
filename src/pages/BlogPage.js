// src/pages/BlogPage.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import './BlogPage.css';

const CATEGORIES = ['all', 'events', 'news', 'stories'];

const catColors = {
  events: { bg: 'rgba(45,138,98,0.1)', color: 'var(--green-light)', label: 'कार्यक्रम' },
  news: { bg: 'rgba(201,168,76,0.12)', color: '#8a6820', label: 'बातम्या' },
  stories: { bg: 'rgba(15,61,46,0.08)', color: 'var(--green-deep)', label: 'कथा' },
};

// ─── Blog List ───
export const BlogListPage = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [cat, setCat] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const filtered = cat === 'all' ? blogs : blogs.filter(b => b.category === cat);

  return (
    <>
      <Helmet><title>ब्लॉग | सांगवडेवाडी गाव</title></Helmet>

      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <p className="tag tag-gold" style={{ marginBottom: 16 }}>ब्लॉग</p>
          <h1 className="page-hero-title">{t('blogTitle')}</h1>
          <p className="page-hero-sub">{t('blogSubtitle')}</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      <section className="section-pad blog-list-section">
        <div className="container">
          <div className="gallery-filters" style={{ marginBottom: 40 }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-btn ${cat === c ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c === 'all' ? t('all') : catColors[c]?.label || c}
              </button>
            ))}
          </div>

          <div className="blog-list-grid">
            {filtered.map((blog, i) => {
              const cfg = catColors[blog.category] || catColors.news;
              return (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="blog-list-card glass-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="blog-list-img">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} loading="lazy" />
                    ) : (
                      <div className="blog-img-placeholder">✍️</div>
                    )}
                    <span className="blog-cat-pill" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="blog-list-body">
                    <h3 className="blog-list-title">{blog.title}</h3>
                    <p className="blog-list-excerpt">{blog.excerpt}</p>
                    <div className="blog-list-footer">
                      <span className="blog-date-pill">📅 {blog.date}</span>
                      <span className="blog-read-more">वाचा →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                📝 या श्रेणीत अद्याप कोणतेही लेख नाहीत.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// ─── Blog Detail ───
export const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const snap = await getDoc(doc(db, 'blogs', id));
        if (snap.exists()) setBlog({ id: snap.id, ...snap.data() });
        else setBlog(null);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (!blog) return (
    <div className="section-pad container" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>📝 लेख सापडला नाही.</p>
      <Link to="/blog" className="btn-primary" style={{ display: 'inline-flex' }}>
        ब्लॉग यादीकडे परत जा
      </Link>
    </div>
  );

  const cfg = catColors[blog.category] || catColors.news;

  return (
    <>
      <Helmet><title>{blog.title} | सांगवडेवाडी गाव</title></Helmet>

      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <span
            className="blog-cat-pill"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--white-warm)', marginBottom: 16, display: 'inline-block' }}
          >
            {cfg.label}
          </span>
          <h1 className="page-hero-title">{blog.title}</h1>
          <p className="page-hero-sub">📅 {blog.date}</p>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--white-warm)" />
          </svg>
        </div>
      </section>

      <section className="section-pad">
        <div className="container blog-detail-container">
          {blog.image && (
            <div className="blog-detail-hero-img">
              <img src={blog.image} alt={blog.title} />
            </div>
          )}
          <div
            className="blog-detail-content glass-card"
            dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.excerpt}</p>` }}
          />
          <div style={{ marginTop: 32 }}>
            <Link to="/blog" className="btn-secondary">← ब्लॉग यादीकडे परत जा</Link>
          </div>
        </div>
      </section>
    </>
  );
};