'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  scrollToSection: (href: string) => void;
}

export default function MobileMenu({ isOpen, onClose, navigationItems, scrollToSection }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed top-[72px] left-0 right-0 z-40 bg-brand-black/90 backdrop-blur-md border-b border-black shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Navigation Links - Centered on Mobile */}
          <nav className="flex flex-col items-center gap-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.href);
                    onClose();
                  }}
                  className="w-full py-3 px-4 text-white hover:text-brand-red hover:bg-white/10 rounded-lg transition-colors text-lg font-medium text-center flex items-center justify-center gap-3"
                >
                  <IconComponent size={20} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Backdrop overlay when menu is open */}
      <div 
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
    </>
  );
}
