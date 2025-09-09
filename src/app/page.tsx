'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ValuesSection from '@/components/ValuesSection';
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import LocationCTA from '@/components/LocationCTA';
import Footer from '@/components/Footer';

export default function Home() {
  // Environment variables for future use
  // const address = process.env.NEXT_PUBLIC_ADDRESS || '4606 A Covert Ave, Evansville, IN 47714';
  // const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+1-812-555-0123';

  return (
    <div className="min-h-screen">
      <Header />
      <div id="home">
        <HeroSection />
      </div>
      <div id="values">
        <ValuesSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="gallery">
        <GallerySection />
      </div>
      <div id="visit">
        <LocationCTA />
      </div>
      <Footer />
    </div>
  );
}
