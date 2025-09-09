'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Cross, Palette, Users } from 'lucide-react';

export default function ValuesSection() {
  const coreValues = [
    {
      icon: Cross,
      title: "Faith First",
      description: "Christ at the center of every design"
    },
    {
      icon: Heart,
      title: "Love & Compassion",
      description: "Treating every client as family"
    },
    {
      icon: Palette,
      title: "Sacred Artistry",
      description: "Honoring stories through ink"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building relationships that last"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-neutral-700 via-black to-neutral-800">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Our 
            <span 
              className="block italic"
              style={{ 
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #0b0b0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Foundation
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Built on faith, driven by purpose, and committed to excellence in sacred artistry.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="mb-6">
                <value.icon className="w-14 h-14 mx-auto text-red-900 group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
            <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed italic mb-6">
              &ldquo;Every tattoo begins with prayer, ensuring God&apos;s blessing on both the artwork and the journey it represents.&rdquo;
            </blockquote>
            <cite className="text-brand-red font-semibold text-lg">— Steve White, Master Artist</cite>
          </div>
        </motion.div>

        {/* Experience Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="inline-flex items-center gap-4 border border-red-900 rounded-full px-8 py-4">
            <div className="text-4xl font-bold">21+</div>
            <div className="text-left">
              <div className="text-white font-semibold">Years of</div>
              <div className="text-gray-300 text-sm">Faithful Service</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}