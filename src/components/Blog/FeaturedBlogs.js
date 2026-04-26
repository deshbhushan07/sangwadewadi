// src/components/Blog/FeaturedBlogs.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../context/LanguageContext';
import './FeaturedBlogs.css';

const defaultBlogs = [
  {
    id: '1',
    title: 'गावातील गणेशोत्सव उत्साहात साजरा',
    category: 'events',
    excerpt: 'यंदाच्या गणेशोत्सवात गावात भव्य मिरवणूक काढण्यात आली. हजारो ग्रामस्थांनी उत्साहाने सहभाग घेतला.',
    image: null,
    date: '१५ सप्टेंबर २०२३',
  },
  {
    id: '2',
    title: 'जलसंधारण प्रकल्पास मिळाले यश',
    category: 'news',
    excerpt: 'ग्रामपंचायतीने राबवलेल्या जलसंधारण प्रकल्पामुळे गावात पाण्याची समस्या दूर होण्यास मदत झाली.',
    image: null,
    date: '२ ऑक्टोबर २०२३',
  },
  {
    id: '3',
    title: 'युवकांनी घडवला गावाचा डिजिटल चेहरा',
    category: 'stories',
    excerpt: 'गावातील तरुण मंडळाने डिजिटल महाराष्ट्र योजनेत सक्रिय सहभाग घेऊन गावाला डिजिटल युगात नेले.',
    image: null,
    date: '१८ नोव्हेंबर २०२३',
  },
];

const categoryColors = {
  events: { bg: 'rgba(45,138,98,0.1)', color: 'var(--green-light)', label: 'कार्यक्रम' },
  news: { bg: 'rgba(201,168,76,0.1)', color: '#8a6820', label: 'बातम्या' },
  stories: { bg: 'rgba(15,61,46,0.08)', color: 'var(--green-deep)', label: 'कथा' },
};

const BlogCard = ({ blog, index }) => {
  const cat = categoryColors[blog.category] || categoryColors.news;
  return (
    <Link to={`/blog/${blog.id}`} className="blog-card glass-card" style={{ animationDelay: `${index * 0.12}s` }}>
      <div className="blog-card-img">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} loading="lazy" />
        ) : (
          <div className="blog-card-placeholder">
            <span>✍️</span>
          </div>
        )}
        <span className="blog-cat-tag" style={{ background: cat.bg, color: cat.color }}>
          {cat.label}
        </span>
      </div>
      <div className="blog-card-body">
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-excerpt">{blog.excerpt}</p>
        <div className="blog-card-footer">
          <span className="blog-date">{blog.date}</span>
          <span className="read-link">वाचा →</span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedBlogs = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState(defaultBlogs);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return unsub;
  }, []);

  return (
    <section className="featured-blogs section-pad" ref={ref}>
      <div className="container">
        <div className="section-header">
          <p className="tag tag-green" style={{ marginBottom: 12 }}>ब्लॉग</p>
          <h2 className="section-title">{t('blogTitle')}</h2>
          <p className="section-subtitle">{t('blogSubtitle')}</p>
        </div>

        <div className={`blogs-grid ${inView ? 'visible' : ''}`}>
          {blogs.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/blog" className="btn-secondary">{t('viewAll')} ब्लॉग →</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
