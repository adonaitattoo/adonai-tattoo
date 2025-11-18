'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  tags: string[];
  order: number;
  createdAt: string;
  height?: number;
  uniqueKey?: string;
}

// Gallery component that fetches images from Firebase admin CMS

export default function GallerySection() {
  const [displayedItems, setDisplayedItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastImageId, setLastImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch images from Firebase
  const fetchGalleryImages = useCallback(async (isLoadMore = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        limit: '9',
      });
      
      if (isLoadMore && lastImageId) {
        params.append('lastImageId', lastImageId);
      }
      
      console.log(`Fetching gallery: isLoadMore=${isLoadMore}, lastImageId=${lastImageId}`);
      
      const response = await fetch(`/api/gallery?${params}`);
      const data = await response.json();
      
      console.log('Gallery response:', data);
      
      if (response.ok) {
        const newItems = data.images.map((item: GalleryItem) => ({
          ...item,
          height: Math.floor(Math.random() * 200) + 300, // Random height for masonry layout
          uniqueKey: `img-${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        console.log(`Processing ${newItems.length} new items`);
        
        if (isLoadMore) {
          // Prevent duplicates by checking if items already exist
          setDisplayedItems(prev => {
            const existingIds = new Set(prev.map((item: GalleryItem) => item.id));
            const uniqueNewItems = newItems.filter((item: GalleryItem) => !existingIds.has(item.id));
            console.log(`Adding ${uniqueNewItems.length} unique new items`);
            return [...prev, ...uniqueNewItems];
          });
        } else {
          setDisplayedItems(newItems);
        }
        
        setHasMore(data.hasMore);
        setLastImageId(data.lastImageId);
        
        if (!data.hasMore) {
          setAllLoaded(true);
        }
      } else {
        setError(data.error || 'Failed to load gallery');
        // Fall back to showing no images rather than random ones
        if (!isLoadMore) {
          setDisplayedItems([]);
        }
        setHasMore(false);
        setAllLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Unable to load gallery');
      if (!isLoadMore) {
        setDisplayedItems([]);
      }
      setHasMore(false);
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loading, lastImageId]);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    fetchGalleryImages(true);
  }, [fetchGalleryImages]);

  // Load initial items
  useEffect(() => {
    fetchGalleryImages(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
        
        {/* Error Message */}
        {error && (
          <div className="text-center mb-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-red-300 mb-2">Unable to load gallery</p>
              <p className="text-gray-400 text-sm">{error}</p>
              <button 
                onClick={() => fetchGalleryImages(false)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-neutral-800/50 rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Gallery Coming Soon</h3>
              <p className="text-gray-400">We&apos;re currently updating our gallery with amazing new artwork.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon to see our latest creations!</p>
            </div>
          </div>
        )}

        {/* Masonry Grid Layout */}
        {displayedItems.length > 0 && (
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
                  <div className="relative w-full h-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={index < 9}
                      unoptimized={true}
                      onError={() => {
                      }}
                    />
                  </div>
                </div>
              
              {/* Simple hover overlay for visual effect only */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Enhanced Border Effect */}
              <div className="absolute inset-0 border border-transparent group-hover:border-brand-red/50 rounded-lg transition-colors duration-300"></div>
            </motion.div>
          ))}
          </div>
        )}

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
