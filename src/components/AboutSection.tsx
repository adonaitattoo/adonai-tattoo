'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Calendar, Users, Heart, Star, Quote } from 'lucide-react';
import { useParallaxBackground } from '../hooks/useParallax';

export default function AboutSection() {
  const parallaxRef = useParallaxBackground({ 
    speed: 0.3, // Reduced speed for better mobile performance
    disabled: false
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Calendar, label: "Years of Experience", value: "21+" },
    { icon: Users, label: "Happy Clients", value: "1000+" },
    { icon: Award, label: "Awards Won", value: "15+" },
    { icon: Heart, label: "Five Star Reviews", value: "200+" }
  ];

  return (
    <section ref={parallaxRef} className="relative py-24 overflow-hidden parallax-container">
      {/* Background Image with Parallax */}
      <div className="parallax-bg z-0">
        <div className="relative w-full h-full">
          <Image
            src="/Gallery_background.png"
            alt="Adonai Tattoo Gallery Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Professional Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20 px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/20 rounded-full mb-6">
            <Star className="w-4 h-4 text-brand-red" />
            <span className="text-brand-red text-xs md:text-sm font-semibold tracking-wide uppercase">About Our Studio</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Crafting Stories Through
            <span className="block bg-gradient-to-r from-brand-red to-red-400 bg-clip-text text-transparent">
              Sacred Art
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Where faith meets artistry, and every tattoo becomes a meaningful expression of your personal journey with purpose, precision, and prayer.
          </p>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            {/* Quote Section */}
            <div className="relative px-4 lg:px-0">
              <Quote className="absolute -top-2 -left-2 lg:-left-2 w-6 md:w-8 h-6 md:h-8 text-brand-red/30" />
              <blockquote className="pl-6 md:pl-8 text-lg md:text-2xl lg:text-3xl font-light text-white leading-relaxed italic">
                &ldquo;Every tattoo is a sacred expression, honoring both the client&apos;s story and God&apos;s creative spirit.&rdquo;
              </blockquote>
              <cite className="block mt-3 md:mt-4 text-brand-red font-semibold text-sm md:text-base">— Steve White, Master Artist</cite>
            </div>

            {/* Mission Statement */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                For over two decades, I&apos;ve dedicated my life to creating meaningful art that tells stories of faith, hope, and personal transformation. At Adonai Tattoo, every piece is crafted with purpose, precision, and prayer.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                My passion extends beyond tattooing—it&apos;s about building lasting relationships, sharing meaningful conversations, and creating something beautiful that honors both the client and our Creator.
              </p>
            </div>

            {/* Professional Credentials */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Professional Excellence</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-brand-red" />
                  <span className="text-gray-300">Licensed & Certified Artist</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-brand-red" />
                  <span className="text-gray-300">Specializing in Christian & Memorial Art</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand-red" />
                  <span className="text-gray-300">Trusted by Faith Community</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-first lg:order-last"
          >
            {/* Professional Portrait Frame */}
            <div className="relative mx-auto max-w-md mb-8 lg:mb-0">
              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-red/20 via-neutral-800 to-black border border-brand-red/20">
                {/* Profile Image */}
                <Image
                  src="/adonai_tattoo_profile.jpg"
                  alt="Steve White - Master Tattoo Artist and Owner of Adonai Tattoo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              
              {/* Professional Info Overlay - Fixed for mobile */}
              <div className="relative lg:absolute lg:-bottom-6 lg:-right-6 mt-6 lg:mt-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-xl border border-white/20 max-w-sm mx-auto lg:max-w-none">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Steve White</h3>
                <p className="text-red-900 font-semibold mb-1 text-sm lg:text-base">Master Artist & Owner</p>
                <p className="text-slate-600 text-sm">Est. 2003</p>
              </div>
              
              {/* Decorative elements - hidden on mobile */}
              <div className="hidden lg:block absolute -top-4 -left-4 w-24 h-24 bg-brand-red/10 rounded-full blur-xl"></div>
              <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Professional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-2xl mb-4 group-hover:bg-brand-red/20 transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-brand-red" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scripture Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent p-8 rounded-3xl border border-white/10">
            <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed italic mb-4">
              &ldquo;She is clothed with strength and dignity; she can laugh at the days to come.&rdquo;
            </blockquote>
            <cite className="text-brand-red font-semibold text-lg">Proverbs 31:25</cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
