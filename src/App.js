// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Common/Footer';
import './index.css';
import './pages/AboutPage.css';

// Lazy load pages for performance
const HomePage   = lazy(() => import('./pages/HomePage'));
const AboutPage  = lazy(() => import('./pages/AboutPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const { BlogListPage, BlogDetailPage } = require('./pages/BlogPage');
const GrampanchayatPage = lazy(() => import('./pages/GrampanchayatPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage  = lazy(() => import('./pages/AdminPage'));

const PageLoader = () => (
  <div className="page-loader" style={{ minHeight: '100vh' }}>
    <div className="spinner" />
  </div>
);

// Layout wrapper — hides Navbar/Footer on admin page
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      <main style={{ paddingTop: isAdmin ? 0 : 0 }}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"                  element={<HomePage />} />
                  <Route path="/about"             element={<AboutPage />} />
                  <Route path="/gallery"           element={<GalleryPage />} />
                  <Route path="/blog"              element={<BlogListPage />} />
                  <Route path="/blog/:id"          element={<BlogDetailPage />} />
                  <Route path="/grampanchayat"     element={<GrampanchayatPage />} />
                  <Route path="/contact"           element={<ContactPage />} />
                  <Route path="/admin"             element={<AdminPage />} />
                  <Route path="/admin/*"           element={<AdminPage />} />
                  <Route path="*" element={
                    <div className="section-pad container" style={{ textAlign:'center', minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
                      <h1 style={{ fontSize:'4rem', color:'var(--green-pale)' }}>404</h1>
                      <p style={{ color:'var(--text-light)' }}>पान सापडले नाही.</p>
                      <a href="/" className="btn-primary" style={{ display:'inline-flex' }}>मुखपृष्ठावर जा</a>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </Layout>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: 'Mukta, Hind, sans-serif',
                  background: 'var(--white-pure)',
                  color: 'var(--text-dark)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid rgba(15,61,46,0.1)',
                  padding: '14px 20px',
                },
                success: { iconTheme: { primary: 'var(--green-mid)', secondary: 'white' } },
              }}
            />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
