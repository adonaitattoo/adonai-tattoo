'use client';

import { useEffect } from 'react';

// Google Analytics component
export function GoogleAnalytics() {
  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    
    if (!GA_ID) return;

    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return null;
}

// Web Vitals tracking
export function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(() => {});
        onINP(() => {});
        onFCP(() => {});
        onLCP(() => {});
        onTTFB(() => {});
      });
    }
  }, []);

  return null;
}

// Error boundary and tracking
export class ErrorBoundary extends Error {
  constructor(message: string, info?: Record<string, unknown>) {
    super(message);
    
    // Send to error tracking service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry would be initialized here
      console.error('Error tracked:', message, info);
    }
  }
}

// Performance monitoring
export function performanceMonitor() {
  if (typeof window !== 'undefined') {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      
      // Send to analytics if configured
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          custom_parameter: loadTime,
        });
      }
    });
  }
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
