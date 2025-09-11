'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X, Heart, User, Image, Mail } from 'lucide-react';
import LogoBadge from './LogoBadge';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Values', href: '#values', icon: Heart },
    { name: 'About', href: '#about', icon: User },
    { name: 'Gallery', href: '#gallery', icon: Image },
    { name: 'Contact', href: '#visit', icon: Mail },
  ];



  useEffect(() => {
    const handleScroll = () => {
      // More gradual trigger point and smoother transition
      setIsScrolled(window.scrollY > 80);
    };

    // Throttle scroll events for smoother performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href) as HTMLElement;
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 80; // Account for fixed header height
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = () => {
    // If we're already at the top or close to it, scroll to the very top
    // Otherwise, scroll to the home section
    if (window.scrollY <= 100) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection('#home');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition delay-300 duration-1000 fade-in fade-out ${
        isScrolled 
          ? 'bg-gradient-to-b from-black/95 to-red-900/70 backdrop-blur-sm' 
          : 'bg-transparent opacity-100'
      }`}>
        <div className="max-w-6xl mx-auto px-2 py-4">
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between w-full relative">
            {/* Mobile Hamburger Menu Button - left side */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-700 cursor-pointer hover:scale-105 ${
                isScrolled 
                  ? 'text-white hover:bg-white/10 hover:text-yellow-300' 
                  : 'text-black hover:bg-black/10 hover:text-brand-red'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo - centered on mobile */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <LogoBadge isScrolled={isScrolled} onClick={handleLogoClick} hideTitleOnMobile={true} />
            </div>
            
            {/* Spacer for balance */}
            <div className="w-12"></div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo - far left aligned on desktop */}
            <div className="flex-shrink-0 pl-0">
              <LogoBadge isScrolled={isScrolled} onClick={handleLogoClick} hideTitleOnMobile={false} />
            </div>
            
            {/* Desktop Navigation Links - only show when scrolled */}
            {isScrolled && (
              <div className="flex-1 flex justify-end">
                <nav className="flex items-center gap-6">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.href)}
                        className="flex items-center gap-2 text-white hover:text-brand-red transition-all duration-700 font-medium cursor-pointer hover:scale-105 px-2 py-1 rounded hover:bg-white/10"
                      >
                        <IconComponent size={18} />
                        {item.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigationItems={navigationItems}
        scrollToSection={scrollToSection}
      />
    </>
  );
}

