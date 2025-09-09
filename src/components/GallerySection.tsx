'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  description: string;
  height?: number;
  uniqueKey?: string;
}

// Using Picsum Photos for reliable random image generation

export default function GallerySection() {
  const [displayedItems, setDisplayedItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);


  // Generate random image data using Picsum Photos
  const generateRandomImage = useCallback((id: number): GalleryItem => {
    const randomHeight = Math.floor(Math.random() * 200) + 300;
    const width = 400;
    
    // Using Picsum Photos for reliable image loading
    const imageUrl = `https://picsum.photos/${width}/${randomHeight}?random=${id}`;
    
    return {
      id,
      title: `Artwork ${id}`,
      image: imageUrl,
      description: "Professional tattoo artistry and sacred design",
      height: randomHeight,
      uniqueKey: `img-${id}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`
    };
  }, []);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;
    
    const currentLength = displayedItems.length;
    
    // Stop at 30 images total
    if (currentLength >= 30) {
      setHasMore(false);
      setAllLoaded(true);
      return;
    }
    
    setLoading(true);
    
    // Generate and add 8 new images directly
    setTimeout(() => {
      const newItems = Array.from({ length: 8 }, (_, index) => 
        generateRandomImage(currentLength + index + 1)
      );
      
      setDisplayedItems(prev => [...prev, ...newItems]);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, displayedItems.length, generateRandomImage]);

  // Load initial items
  useEffect(() => {
    const initialItems = Array.from({ length: 9 }, (_, index) => 
      generateRandomImage(index + 1)
    );
    setDisplayedItems(initialItems);
  }, [generateRandomImage]);


  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-black"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
        >
          Our Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-center mb-12 md:mb-16 max-w-2xl mx-auto px-4 text-base md:text-lg"
        >
          Each piece tells a story of faith, hope, and personal journey. Browse our collection of Christian-inspired artwork.
        </motion.p>
        
        {/* Masonry Grid Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.uniqueKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
              className="gallery-item group relative bg-neutral-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl border border-white/10 hover:border-brand-red/30 break-inside-avoid mb-4"
              style={{ height: `${item.height}px` }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={index < 9}
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Image failed to load:', item.image, e);
                    // Fallback to a different Picsum image
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('picsum.photos')) {
                      target.src = `https://picsum.photos/400/${item.height}?random=${item.id + 1000}`;
                    }
                  }}
                />
              </div>
              
              {/* Enhanced Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-4 text-center">
                <h3 className="text-white font-semibold mb-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">{item.title}</h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  {item.description}
                </p>
              </div>
              
              {/* Enhanced Border Effect */}
              <div className="absolute inset-0 border border-transparent group-hover:border-brand-red/50 rounded-lg transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && !allLoaded && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreItems}
              disabled={loading}
              className="bg-brand-red hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <span>Load More Artwork</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}


        {/* End Message */}
        {allLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-12 mb-8"
          >
            <div className="bg-gradient-to-r from-brand-red/20 via-black/50 to-brand-red/20 backdrop-blur-sm rounded-2xl p-8 border border-brand-red/20">
              <h3 className="text-2xl font-bold text-white mb-3">
                You&apos;ve Seen It All!
              </h3>
              <p className="text-gray-300 mb-4">
                That&apos;s our complete featured collection. Each piece represents years of passion and faith-driven artistry.
              </p>
              <p className="text-brand-red text-sm font-medium">
                Ready to create your own masterpiece? Get in touch below.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
