'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface CTAButtonsProps {
  isScrolled?: boolean;
}

export default function CTAButtons({ isScrolled = false }: CTAButtonsProps) {
  const messengerUrl = process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://m.me/steve.m.white.3';
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+1-812-555-0123';

  const handleMessage = () => {
    window.open(messengerUrl, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Message Button - Simple border */}
      <button
        onClick={handleMessage}
        className={`flex items-center justify-center gap-2 bg-transparent border-2 border-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-w-[120px] ${
          isScrolled ? 'text-white hover:bg-brand-red' : 'text-black hover:bg-brand-red hover:text-white'
        }`}
        aria-label="Send message via Messenger"
      >
        <MessageCircle className="w-5 h-5" />
        Message
      </button>
      
      {/* Call Button - Simple border */}
      <button
        onClick={handleCall}
        className={`flex items-center justify-center gap-2 bg-transparent border-2 border-brand-red px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-w-[120px] ${
          isScrolled ? 'text-white hover:bg-brand-red' : 'text-black hover:bg-brand-red hover:text-white'
        }`}
        aria-label="Call us"
      >
        <Phone className="w-5 h-5" />
        Call
      </button>
    </div>
  );
}

