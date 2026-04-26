// src/pages/HomePage.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero/Hero';
import AboutPreview from '../components/Common/AboutPreview';
import FeaturedGallery from '../components/Gallery/FeaturedGallery';
import FeaturedBlogs from '../components/Blog/FeaturedBlogs';
import TodayInVillage from '../components/Common/TodayInVillage';
import AwardsSlider from '../components/Common/AwardsSlider';

const HomePage = () => (
  <>
    <Helmet>
      <title>सांगवडेवाडी गाव | Sangwadewadi Village</title>
      <meta name="description" content="सांगवडेवाडी गावाचे अधिकृत संकेतस्थळ - कोल्हापूर जिल्हा, महाराष्ट्र" />
    </Helmet>
    <Hero />
    <AboutPreview />
    <div className="divider" />
    <FeaturedGallery />
    <div className="divider" />
    <FeaturedBlogs />
    <div className="divider" />
    <TodayInVillage />
    <AwardsSlider />
  </>
);

export default HomePage;