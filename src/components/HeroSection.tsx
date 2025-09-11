'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParallaxBackground } from '../hooks/useParallax';

export default function HeroSection() {
  const parallaxRef = useParallaxBackground({ 
    speed: 0.7, // Increased for more noticeable effect
    disabled: false // Enable on mobile too
  });

  return (
    <section 
      ref={parallaxRef}
      className="relative h-screen flex items-start justify-end overflow-hidden parallax-container"
    >
      {/* Background Image with Parallax */}
      <div className="parallax-bg z-0">
        <Image
          src="/Hero_Jesus_Tat.jpg"
          alt="Adonai Tattoo - Professional Christian Tattoo Artistry"
          fill
          className="object-cover"
          priority
          quality={95}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>
      
      {/* Content - Positioned to Top Right, Moved Slightly Left */}
      <div className="relative z-20 text-right px-6 md:px-12 py-24 max-w-2xl mr-4 md:mr-8 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-2xl"
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform',
            background: 'linear-gradient(135deg, #0b0b0b 0%, #991b1b 50%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Adonai
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 drop-shadow-2xl"
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform',
            background: 'linear-gradient(135deg, #0b0b0b 0%, #991b1b 50%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Tattoo
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="text-xl md:text-2xl lg:text-3xl mb-8 text-white drop-shadow-lg font-light tracking-wide"
          style={{ 
            transform: 'translateZ(0)',
            willChange: 'transform',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          Sacred Art • Divine Inspiration
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed drop-shadow-lg">
            &ldquo;He has filled them with skill to do all kinds of work as engravers, 
            designers, embroiderers... and weavers—all of them skilled workers and designers.&rdquo;
          </p>
          <p className="text-sm md:text-base text-white/70 mt-2 italic drop-shadow-lg">
            — Exodus 35:35
          </p>
        </motion.div>
      </div>
      
      {/* Scripture Quote - Centered at Bottom, Fully Visible */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center"
        style={{ 
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <blockquote className="text-lg md:text-xl lg:text-2xl text-white italic max-w-2xl mx-auto leading-relaxed drop-shadow-2xl">
          &ldquo;I can do all things through Christ who strengthens me.&rdquo;
          <br />
          <span className="text-sm md:text-base text-gray-200 mt-2 block">— Philippians 4:13</span>
        </blockquote>
      </motion.div>
      
     
    </section>
  );
}
