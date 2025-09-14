import React from 'react';
import Image from 'next/image';

interface LogoBadgeProps {
  isScrolled?: boolean;
  onClick?: () => void;
  hideTitleOnMobile?: boolean;
}

export default function LogoBadge({ isScrolled = false, onClick, hideTitleOnMobile = false }: LogoBadgeProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none rounded-lg p-1"
    >
      {/* Adonai Tattoo Logo */}
      <div className="w-16 h-16 relative">
        <Image
          src="/AdonaiTattooLogo.png"
          alt="Adonai Tattoo Logo"
          fill
          className="object-cover rounded-lg transition-all duration-300 hover:brightness-110"
          priority
          sizes="64px"
        />
      </div>
      <div className={hideTitleOnMobile ? 'hidden md:block' : ''}>
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          isScrolled ? 'text-white hover:text-red-900' : 'text-white hover:text-red-900'
        }`}>Adonai</h1>
        <p className={`text-sm transition-colors duration-300 ${
          isScrolled ? 'text-white' : 'text-white'
        }`}>Tattoo</p>
      </div>
    </button>
  );
}

