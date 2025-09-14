import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, doc, getDoc } from 'firebase/firestore';

// GET - Fetch gallery images for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const lastImageId = searchParams.get('lastImageId');
    
    const limitNumber = limitParam ? parseInt(limitParam, 10) : 9;

    const galleryRef = collection(db, 'gallery');
    
    let q = query(
      galleryRef,
      orderBy('createdAt', 'desc'),
      limit(limitNumber + 1) // Get one extra to check if there are more
    );

    // If we have a lastImageId, start after that document
    if (lastImageId) {
      const lastDocRef = doc(db, 'gallery', lastImageId);
      const lastDocSnap = await getDoc(lastDocRef);
      
      if (lastDocSnap.exists()) {
        q = query(
          galleryRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDocSnap),
          limit(limitNumber + 1)
        );
      }
    }
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    
    // Check if there are more images
    const hasMore = docs.length > limitNumber;
    const imagesToReturn = hasMore ? docs.slice(0, limitNumber) : docs;
    
    const images = imagesToReturn.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Sacred Art',
        imageUrl: data.imageUrl,
        description: data.description || 'Professional Christian tattoo artistry',
        tags: data.tags || ['tattoo', 'art'],
        order: data.order || 0,
        createdAt: data.createdAt,
      };
    });

    const newLastImageId = images.length > 0 ? images[images.length - 1].id : null;

    console.log(`Gallery API: Returning ${images.length} images, hasMore: ${hasMore}, lastImageId: ${newLastImageId}`);

    return NextResponse.json({ 
      images,
      hasMore,
      lastImageId: newLastImageId
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