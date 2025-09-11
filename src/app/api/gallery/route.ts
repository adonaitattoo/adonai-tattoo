import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// GET - Fetch gallery images for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    
    const limitNumber = limitParam ? parseInt(limitParam, 10) : 9;

    const galleryRef = collection(db, 'gallery');
    const q = query(
      galleryRef,
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc'),
      limit(limitNumber)
    );
    
    const snapshot = await getDocs(q);
    
    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Artwork',
        imageUrl: data.imageUrl,
        description: data.description || 'Professional tattoo artistry',
        tags: data.tags || [],
        order: data.order || 0,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json({ 
      images,
      hasMore: images.length === limitNumber,
      lastImageId: images.length > 0 ? images[images.length - 1].id : null
    });
  } catch (error) {
    console.error('Error fetching public gallery:', error);
    
    // Return fallback data in case of error
    return NextResponse.json({ 
      images: [],
      hasMore: false,
      lastImageId: null,
      error: 'Unable to load gallery at this time'
    });
  }
}