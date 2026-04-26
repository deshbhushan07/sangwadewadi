// src/pages/AdminPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';
import './AdminPage.css';

// ─── Login Form ───
const AdminLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('लॉगिन यशस्वी!');
    } catch {
      toast.error('ईमेल किंवा पासवर्ड चुकीचा आहे.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card glass-card">
        <div className="admin-login-icon">🔐</div>
        <h2>प्रशासन पॅनेल</h2>
        <p>सांगवडेवाडी ग्राम संकेतस्थळ</p>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">ईमेल</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">पासवर्ड</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '⏳ लॉगिन होत आहे...' : '🔓 लॉगिन'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Blogs Manager ───
// ─── Blogs Manager ───
const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'news', excerpt: '', content: '', date: '', imageUrl: '' });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const save = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required.'); return; }
    try {
      if (editing) {
        await updateDoc(doc(db, 'blogs', editing), { ...form, updatedAt: serverTimestamp() });
        toast.success('Blog updated!');
      } else {
        await addDoc(collection(db, 'blogs'), { ...form, createdAt: serverTimestamp() });
        toast.success('Blog added!');
      }
      setForm({ title: '', category: 'news', excerpt: '', content: '', date: '', imageUrl: '' });
      setEditing(null); setShowForm(false);
    } catch { toast.error('Something went wrong.'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this blog?')) return;
    try { await deleteDoc(doc(db, 'blogs', id)); toast.success('Deleted!'); }
    catch { toast.error('Error deleting.'); }
  };

  const startEdit = blog => {
    setForm({
      title: blog.title || '',
      category: blog.category || 'news',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      date: blog.date || '',
      imageUrl: blog.imageUrl || '',
    });
    setEditing(blog.id); setShowForm(true);
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>✍️ Blog Management</h3>
        <button className="btn-primary" onClick={() => {
          setShowForm(!showForm); setEditing(null);
          setForm({ title: '', category: 'news', excerpt: '', content: '', date: '', imageUrl: '' });
        }}>
          {showForm ? '✕ Close' : '+ New Blog'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form glass-card">
          <h4 style={{ marginBottom: 24, color: 'var(--green-deep)' }}>
            {editing ? '✏️ Edit Blog' : '📝 New Blog'}
          </h4>

          {/* Row 1: Title + Category */}
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Blog title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="news">News (बातम्या)</option>
                <option value="events">Events (कार्यक्रम)</option>
                <option value="stories">Stories (कथा)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Date + Image URL */}
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                placeholder="e.g. 15 April 2024"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image URL (optional)</label>
              <input
                className="form-input"
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">Short Description / Excerpt</label>
            <input
              className="form-input"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Brief summary shown on blog list..."
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Full Content (HTML) *</label>
            <textarea
              className="form-input form-textarea"
              rows={10}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder={"<p>Write your full blog content here...</p>\n<p>You can use HTML tags like <strong>bold</strong>, <em>italic</em>, <h2>headings</h2></p>"}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 4, display: 'block' }}>
              💡 Tip: Use &lt;p&gt; for paragraphs, &lt;h2&gt; for headings, &lt;strong&gt; for bold, &lt;ul&gt;&lt;li&gt; for lists.
            </span>
          </div>

          <div className="admin-form-actions">
            <button className="btn-primary" onClick={save}>💾 Save Blog</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {blogs.length === 0 && <p className="admin-empty">No blogs yet. Add your first blog above.</p>}
        {blogs.map(b => (
          <div key={b.id} className="admin-list-item glass-card">
            <div className="admin-list-info">
              <span className="admin-list-tag">{b.category}</span>
              <strong>{b.title}</strong>
              <span className="admin-list-date">{b.date}</span>
            </div>
            <div className="admin-list-actions">
              <button className="admin-btn-edit" onClick={() => startEdit(b)}>✏️ Edit</button>
              <button className="admin-btn-delete" onClick={() => remove(b.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Gallery Manager ───
const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ caption: '', category: 'nature' });
  const fileRef = useRef();

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'sangwadewadi/gallery');
      const isVideo = file.type.startsWith('video/');
      await addDoc(collection(db, 'gallery'), {
        url: result.secure_url,
        publicId: result.public_id,
        type: isVideo ? 'video' : 'image',
        caption: form.caption,
        category: form.category,
        createdAt: serverTimestamp(),
      });
      toast.success('अपलोड यशस्वी!');
      setForm({ caption: '', category: 'nature' });
      if (fileRef.current) fileRef.current.value = '';
    } catch { toast.error('अपलोड अयशस्वी.'); }
    finally { setUploading(false); }
  };

  const remove = async item => {
    if (!window.confirm('हे चित्र हटवायचे?')) return;
    try { await deleteDoc(doc(db, 'gallery', item.id)); toast.success('हटवले!'); }
    catch { toast.error('त्रुटी झाली.'); }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>🖼️ दालन व्यवस्थापन</h3>
      </div>

      <div className="admin-form glass-card">
        <h4>नवीन चित्र / व्हिडिओ अपलोड करा</h4>
        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">मथळा</label>
            <input className="form-input" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="चित्राचे वर्णन" />
          </div>
          <div className="form-group">
            <label className="form-label">श्रेणी</label>
            <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="festivals">उत्सव</option>
              <option value="nature">निसर्ग</option>
              <option value="events">कार्यक्रम</option>
              <option value="people">लोक</option>
            </select>
          </div>
        </div>
        <div className="upload-area" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{ display: 'none' }} />
          <div className="upload-content">
            <span>{uploading ? '⏳' : '📁'}</span>
            <p>{uploading ? 'अपलोड होत आहे...' : 'येथे क्लिक करा किंवा फाइल ड्रॅग करा'}</p>
            <span className="upload-hint">JPG, PNG, MP4 – कमाल 50MB</span>
          </div>
        </div>
      </div>

      <div className="gallery-admin-grid">
        {items.map(item => (
          <div key={item.id} className="gallery-admin-item glass-card">
            {item.url ? (
              item.type === 'video' ? (
                <video src={item.url} className="gallery-admin-thumb" muted />
              ) : (
                <img src={item.url} alt={item.caption} className="gallery-admin-thumb" />
              )
            ) : (
              <div className="gallery-admin-placeholder">🖼️</div>
            )}
            <div className="gallery-admin-info">
              <span className="admin-list-tag">{item.category}</span>
              <p>{item.caption}</p>
            </div>
            <button className="admin-btn-delete" onClick={() => remove(item)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Awards Manager ───
const AwardsManager = () => {
  const [awards, setAwards] = useState([]);
  const [form, setForm] = useState({ title: '', by: '', year: '', icon: '🏆' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'awards'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setAwards(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const save = async () => {
    if (!form.title) { toast.error('शीर्षक आवश्यक!'); return; }
    try {
      await addDoc(collection(db, 'awards'), { ...form, createdAt: serverTimestamp() });
      toast.success('पुरस्कार जोडला!');
      setForm({ title: '', by: '', year: '', icon: '🏆' });
      setShowForm(false);
    } catch { toast.error('त्रुटी झाली.'); }
  };

  const remove = async id => {
    if (!window.confirm('हटवायचे?')) return;
    await deleteDoc(doc(db, 'awards', id));
    toast.success('हटवला!');
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>🏆 पुरस्कार व्यवस्थापन</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ बंद' : '+ जोडा'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form glass-card">
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">पुरस्काराचे नाव *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="पुरस्काराचे नाव" />
            </div>
            <div className="form-group">
              <label className="form-label">प्रदाता संस्था</label>
              <input className="form-input" value={form.by} onChange={e => setForm(f => ({ ...f, by: e.target.value }))} placeholder="उदा. जिल्हा परिषद, कोल्हापूर" />
            </div>
            <div className="form-group">
              <label className="form-label">वर्ष</label>
              <input className="form-input" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="उदा. २०२३" />
            </div>
            <div className="form-group">
              <label className="form-label">इमोजी आयकॉन</label>
              <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🏆" />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="btn-primary" onClick={save}>💾 जतन करा</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>रद्द</button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {awards.map(a => (
          <div key={a.id} className="admin-list-item glass-card">
            <div className="admin-list-info">
              <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
              <strong>{a.title}</strong>
              <span className="admin-list-date">{a.year} — {a.by}</span>
            </div>
            <button className="admin-btn-delete" onClick={() => remove(a.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── GP Members Manager ───
const GPManager = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'member', phone: '', ward: '', order: 10 });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'gpMembers'), orderBy('order', 'asc'));
    return onSnapshot(q, snap => setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const save = async () => {
    if (!form.name) { toast.error('नाव आवश्यक!'); return; }
    try {
      if (editing) {
        await updateDoc(doc(db, 'gpMembers', editing), form);
        toast.success('अद्यतनित!');
      } else {
        await addDoc(collection(db, 'gpMembers'), { ...form, createdAt: serverTimestamp() });
        toast.success('जोडले!');
      }
      setForm({ name: '', role: 'member', phone: '', ward: '', order: 10 });
      setEditing(null); setShowForm(false);
    } catch { toast.error('त्रुटी.'); }
  };

  const remove = async id => {
    if (!window.confirm('हटवायचे?')) return;
    await deleteDoc(doc(db, 'gpMembers', id));
    toast.success('हटवले!');
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>👥 ग्रामपंचायत सदस्य</h3>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', role: 'member', phone: '', ward: '', order: 10 }); }}>
          {showForm ? '✕ बंद' : '+ जोडा'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form glass-card">
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">नाव *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="सदस्याचे पूर्ण नाव" />
            </div>
            <div className="form-group">
              <label className="form-label">पद</label>
              <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="sarpanch">सरपंच</option>
                <option value="member">सदस्य</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">दूरध्वनी</label>
              <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">वार्ड / विभाग</label>
              <input className="form-input" value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))} placeholder="उदा. वार्ड १" />
            </div>
            <div className="form-group">
              <label className="form-label">क्रम (Order)</label>
              <input className="form-input" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="btn-primary" onClick={save}>💾 जतन करा</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>रद्द</button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {members.map(m => (
          <div key={m.id} className="admin-list-item glass-card">
            <div className="admin-list-info">
              <span className="admin-list-tag">{m.role === 'sarpanch' ? '👑 सरपंच' : '🤝 सदस्य'}</span>
              <strong>{m.name}</strong>
              <span className="admin-list-date">{m.ward} • {m.phone}</span>
            </div>
            <div className="admin-list-actions">
              <button className="admin-btn-edit" onClick={() => { setForm({ name: m.name, role: m.role, phone: m.phone || '', ward: m.ward || '', order: m.order || 10 }); setEditing(m.id); setShowForm(true); }}>✏️</button>
              <button className="admin-btn-delete" onClick={() => remove(m.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Today Updates Manager ───
const TodayManager = () => {
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', type: 'notice', time: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'todayUpdates'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const save = async () => {
    if (!form.title || !form.desc) { toast.error('शीर्षक आणि वर्णन आवश्यक!'); return; }
    try {
      await addDoc(collection(db, 'todayUpdates'), { ...form, createdAt: serverTimestamp() });
      toast.success('घडामोड जोडली!');
      setForm({ title: '', desc: '', type: 'notice', time: '' });
      setShowForm(false);
    } catch { toast.error('त्रुटी.'); }
  };

  const remove = async id => {
    if (!window.confirm('हटवायचे?')) return;
    await deleteDoc(doc(db, 'todayUpdates', id));
    toast.success('हटवले!');
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>📅 आजच्या घडामोडी</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ बंद' : '+ जोडा'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form glass-card">
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">शीर्षक *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="घडामोडीचे शीर्षक" />
            </div>
            <div className="form-group">
              <label className="form-label">प्रकार</label>
              <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="notice">सूचना</option>
                <option value="event">कार्यक्रम</option>
                <option value="achievement">उपलब्धी</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">वेळ / तारीख</label>
              <input className="form-input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="उदा. आज सकाळी ११:०० वाजता" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">वर्णन *</label>
            <textarea className="form-input form-textarea" rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="घडामोडीचे वर्णन..." />
          </div>
          <div className="admin-form-actions">
            <button className="btn-primary" onClick={save}>💾 जतन करा</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>रद्द</button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {updates.map(u => (
          <div key={u.id} className="admin-list-item glass-card">
            <div className="admin-list-info">
              <span className="admin-list-tag">{u.type}</span>
              <strong>{u.title}</strong>
              <span className="admin-list-date">{u.desc?.slice(0, 60)}...</span>
            </div>
            <button className="admin-btn-delete" onClick={() => remove(u.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Messages Viewer ───
const MessagesViewer = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>📬 संपर्क संदेश ({messages.length})</h3>
      </div>
      <div className="admin-list">
        {messages.length === 0 && <p className="admin-empty">अद्याप कोणताही संदेश नाही.</p>}
        {messages.map(m => (
          <div key={m.id} className="admin-list-item glass-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <strong>{m.name}</strong>
              <span className="admin-list-date">{m.email}</span>
              <span className="admin-list-date">{m.phone}</span>
              <span className="admin-list-date" style={{ marginLeft: 'auto' }}>
                {m.createdAt?.toDate?.()?.toLocaleDateString?.('mr-IN') || ''}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Admin Page ───
const TABS = [
  { id: 'blogs', label: '✍️ ब्लॉग', Component: BlogsManager },
  { id: 'gallery', label: '🖼️ दालन', Component: GalleryManager },
  { id: 'awards', label: '🏆 पुरस्कार', Component: AwardsManager },
  { id: 'gp', label: '👥 ग्रामपंचायत', Component: GPManager },
  { id: 'today', label: '📅 आजच्या घडामोडी', Component: TodayManager },
  { id: 'messages', label: '📬 संदेश', Component: MessagesViewer },
];

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('blogs');

  if (!user) return <AdminLogin />;

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component || BlogsManager;

  return (
    <>
      <Helmet><title>प्रशासन पॅनेल | सांगवडेवाडी</title></Helmet>
      <div className="admin-page">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span>🏡</span>
            <div>
              <p className="admin-brand-name">सांगवडेवाडी</p>
              <p className="admin-brand-sub">प्रशासन पॅनेल</p>
            </div>
          </div>

          <nav className="admin-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-info">
              <span>👤</span>
              <span>{user.email}</span>
            </div>
            <button className="admin-logout-btn" onClick={() => { logout(); toast.success('लॉगआउट यशस्वी!'); }}>
              🚪 लॉगआउट
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <div className="admin-topbar">
            <h1>{TABS.find(t => t.id === activeTab)?.label}</h1>
            <span className="admin-live-badge">🔴 Live</span>
          </div>
          <div className="admin-content">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
