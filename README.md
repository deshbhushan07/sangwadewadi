# 🏡 सांगवडेवाडी गाव — Village Website

> **सांगवडेवाडी, करवीर तालुका, कोल्हापूर जिल्हा, महाराष्ट्र — ४१६२०२**

A premium, multilingual, fully responsive village website built with React.js, Firebase, and Cloudinary.

---

## ✨ Features

- 🌐 **Trilingual** — Marathi (default), Hindi, English (toggle in navbar)
- 📱 **Fully Responsive** — Mobile-first, works on all screen sizes
- 🔥 **Real-time Data** — Firebase Firestore live updates
- 🖼️ **Cloudinary Media** — Optimized image & video hosting
- 🔐 **Secure Admin Panel** — Firebase Auth protected dashboard
- ♾️ **Awards Slider** — Infinite auto-scrolling achievements
- 🗺️ **Google Maps** — Embedded village location map
- ✉️ **Contact Form** — Messages stored in Firestore
- 🎨 **Glassmorphism UI** — Premium green & gold design theme
- ⚡ **Lazy Loading** — Fast performance with code splitting

---

## 🏗️ Project Structure

```
sangwadewadi/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar/          # Sticky navbar + language switcher
│   │   ├── Hero/            # Full-screen hero with slider
│   │   ├── Gallery/         # Featured gallery component
│   │   ├── Blog/            # Featured blogs component
│   │   └── Common/          # About, Footer, AwardsSlider, TodayInVillage
│   ├── pages/
│   │   ├── HomePage.js      # Landing page
│   │   ├── AboutPage.js     # Village history & info
│   │   ├── GalleryPage.js   # Full gallery with filters
│   │   ├── BlogPage.js      # Blog list + detail
│   │   ├── GrampanchayatPage.js  # GP members + notices
│   │   ├── ContactPage.js   # Contact form + map
│   │   └── AdminPage.js     # Full admin dashboard
│   ├── context/
│   │   ├── LanguageContext.js   # Trilingual translations
│   │   └── AuthContext.js       # Firebase auth state
│   ├── utils/
│   │   └── cloudinary.js        # Cloudinary upload helper
│   ├── firebase.js              # Firebase initialization
│   ├── App.js                   # Router + layout
│   └── index.css                # Global CSS variables & styles
├── .env.example                 # Environment variables template
├── firebase.json                # Firebase hosting config
├── firestore.rules              # Firestore security rules
├── deploy.sh                    # Deployment script
└── package.json
```

---

## 🚀 Quick Start

### Step 1 — Clone & Setup

```bash
chmod +x deploy.sh
./deploy.sh setup
```

### Step 2 — Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `sangwadewadi-village`)
3. Enable **Firestore Database** (start in test mode)
4. Enable **Authentication** → Email/Password
5. Enable **Hosting**
6. Get your config from Project Settings → Web App

### Step 3 — Configure Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. Go to Settings → Upload → Add upload preset
3. Name it `sangwadewadi`, set to **Unsigned**
4. Note your **Cloud Name**

### Step 4 — Add Credentials

Edit your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=sangwadewadi.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=sangwadewadi
REACT_APP_FIREBASE_STORAGE_BUCKET=sangwadewadi.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc...

REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=sangwadewadi
```

### Step 5 — Create Admin User

In Firebase Console → Authentication → Users → Add User:
- Email: `admin@sangwadewadi.in`
- Password: (choose a strong password)

### Step 6 — Deploy Firestore Rules

```bash
firebase login
firebase deploy --only firestore:rules
```

### Step 7 — Run Locally

```bash
./deploy.sh dev
# Opens at http://localhost:3000
```

### Step 8 — Deploy to Firebase

```bash
./deploy.sh deploy
```

---

## 📱 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, Gallery preview, Blogs, Today's Updates, Awards |
| About | `/about` | Village info, history timeline, highlights |
| Gallery | `/gallery` | Full gallery with category filters + lightbox |
| Blog | `/blog` | Blog list with category filter |
| Blog Detail | `/blog/:id` | Full blog article |
| Grampanchayat | `/grampanchayat` | Members, notices, GP info |
| Contact | `/contact` | Contact form + Google Map |
| Admin | `/admin` | Protected dashboard |

---

## 🔐 Admin Panel Features

Login at `/admin` with your Firebase credentials.

| Section | Capabilities |
|---------|-------------|
| ✍️ Blogs | Create, edit, delete blog posts (HTML content) |
| 🖼️ Gallery | Upload images/videos via Cloudinary, delete |
| 🏆 Awards | Add/remove village awards (shown in slider) |
| 👥 Grampanchayat | Manage members, roles, contact info |
| 📅 Today's Updates | Add/remove live village updates |
| 📬 Messages | View contact form submissions |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--green-deep` | `#0F3D2E` |
| `--green-mid` | `#1a5c44` |
| `--green-light` | `#2d8a62` |
| `--gold` | `#c9a84c` |
| `--white-warm` | `#F8F6F2` |
| Font | Mukta + Hind (Marathi/Hindi) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router 6 |
| Styling | Pure CSS with CSS Variables |
| Animation | CSS animations + Intersection Observer |
| Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication |
| Media | Cloudinary |
| Hosting | Firebase Hosting |
| Lightbox | yet-another-react-lightbox |
| Notifications | react-hot-toast |
| SEO | react-helmet-async |

---

## 📞 Support

- **Website**: सांगवडेवाडी, करवीर, कोल्हापूर – ४१६२०२
- **Email**: sangwadewadi@gmail.com

---

© 2024 सांगवडेवाडी ग्रामपंचायत. सर्व हक्क राखीव.
