'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle } from 'lucide-react';

export default function LocationCTA() {
  return (
    <section className="relative  overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-500 to-neutral-700"></div>
      
      {/* Content */}
      <div className="relative z-10 py-20">
        {/* CTA Content - Top */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Ready to plan your tattoo?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Let&apos;s create something beautiful together. Reach out to schedule your consultation.
            </p>
            <div className="flex justify-center">
              <a
                href={process.env.NEXT_PUBLIC_MESSENGER_URL || '#'}
                className="inline-flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ color: '#dc2626' }}
              >
                <MessageCircle size={24} />
                <span style={{ color: '#dc2626' }}>Message Us</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Location Information - Center */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-8 text-white">Visit Our Studio</h3>
            <div className="flex flex-col items-center gap-4 text-xl text-gray-200">
              <div className="flex items-center gap-4">
                <MapPin className="w-8 h-8 text-white" />
                <span>4606 A Covert Ave, Evansville, IN 47714</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full Width Map - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full h-96 relative"
      >
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent('4606 A Covert Ave, Evansville, IN 47714')}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Adonai Tattoo Location"
          className="w-full h-full"
        />
        <div className="absolute inset-0 pointer-events-none border-t-4 border-white/20"></div>
      </motion.div>
    </section>
  );
}
