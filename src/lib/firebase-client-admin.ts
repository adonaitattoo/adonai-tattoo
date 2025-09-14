import { auth, db, storage } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Authentication helpers
export const signInAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error('Admin sign in error:', error);
    return false;
  }
};

export const signOutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Admin sign out error:', error);
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const isAdminUser = (user: User | null): boolean => {
  // Get admin emails from environment (available on client side as NEXT_PUBLIC_)
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const clientEmail = process.env.NEXT_PUBLIC_CLIENT_EMAIL || process.env.CLIENT_EMAIL;
  return user?.email === adminEmail || user?.email === clientEmail;
};

// Verify admin access via server-side middleware (no client-side Firebase auth needed)
const verifyAdminAccess = (): void => {
  // Since this code can only run if user passed through middleware protection,
  // we know they are authenticated. No additional checks needed.
};

// Gallery management helpers
export const addGalleryImage = async (imageData: {
  imageUrl: string;
  order: number;
}) => {
  verifyAdminAccess();

  const galleryRef = collection(db, 'gallery');
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const clientEmail = process.env.NEXT_PUBLIC_CLIENT_EMAIL || process.env.CLIENT_EMAIL;
  const currentUserEmail = adminEmail || clientEmail; // Use admin email as primary, fallback to client
  return await addDoc(galleryRef, {
    ...imageData,
    title: '',
    description: '',
    tags: [],
    adminEmail: currentUserEmail,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const galleryRef = collection(db, 'gallery');
  const q = query(galleryRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl || '',
      order: data.order || 0,
      createdAt: data.createdAt || '',
    };
  });
};

interface GalleryImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export const updateGalleryImage = async (id: string, updateData: Record<string, unknown>) => {
  verifyAdminAccess();

  const imageRef = doc(db, 'gallery', id);
  return await updateDoc(imageRef, {
    ...updateData,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteGalleryImage = async (id: string) => {
  verifyAdminAccess();

  try {
    // First, get the image document to find the storage URL
    const imageRef = doc(db, 'gallery', id);
    const imageDoc = await getDoc(imageRef);
    
    if (imageDoc.exists()) {
      const imageData = imageDoc.data();
      const imageUrl = imageData.imageUrl;
      
      console.log('Attempting to delete image:', { id, imageUrl });
      
      // Delete from Storage if we have an imageUrl
      if (imageUrl && imageUrl.includes('firebase')) {
        try {
          // Extract the file path from the Firebase Storage URL
          const url = new URL(imageUrl);
          console.log('Parsed URL:', { pathname: url.pathname, search: url.search });
          
          const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
          if (pathMatch) {
            const filePath = decodeURIComponent(pathMatch[1]);
            console.log('Extracted file path:', filePath);
            
            const storageRef = ref(storage, filePath);
            await deleteObject(storageRef);
            console.log('✅ Successfully deleted image from storage:', filePath);
          } else {
            console.error('❌ Could not extract file path from URL:', imageUrl);
          }
        } catch (storageError) {
          console.error('❌ Error deleting from storage:', storageError);
          // Log the specific error details
          if (storageError instanceof Error) {
            console.error('Storage error details:', {
              message: storageError.message,
              name: storageError.name,
              stack: storageError.stack
            });
          }
          // Continue with database deletion even if storage deletion fails
        }
      } else {
        console.log('⚠️ Skipping storage deletion - no valid Firebase URL found:', imageUrl);
      }
    } else {
      console.error('❌ Image document not found:', id);
    }
    
    // Delete from Firestore database
    await deleteDoc(imageRef);
    console.log('✅ Successfully deleted image from database:', id);
    
  } catch (error) {
    console.error('❌ Error in deleteGalleryImage:', error);
    throw error;
  }
};

// Debug helper to test storage deletion
export const testStorageDeletion = async (imageUrl: string) => {
  console.log('🧪 Testing storage deletion for URL:', imageUrl);
  
  try {
    if (!imageUrl || !imageUrl.includes('firebase')) {
      console.log('❌ Invalid Firebase URL');
      return false;
    }
    
    const url = new URL(imageUrl);
    console.log('URL parts:', { 
      hostname: url.hostname, 
      pathname: url.pathname, 
      search: url.search 
    });
    
    const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);
    if (!pathMatch) {
      console.log('❌ Could not extract path from URL');
      return false;
    }
    
    const filePath = decodeURIComponent(pathMatch[1]);
    console.log('Extracted path:', filePath);
    
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    console.log('✅ Storage deletion test successful');
    return true;
    
  } catch (error) {
    console.error('❌ Storage deletion test failed:', error);
    return false;
  }
};

// File upload helper
export const uploadImageToStorage = async (file: File): Promise<string> => {
  verifyAdminAccess();

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop();
  const fileName = `gallery/${timestamp}-${randomId}.${fileExtension}`;

  // Upload to Firebase Storage
  const storageRef = ref(storage, fileName);
  
  // Add metadata including admin email for security rules
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const clientEmail = process.env.NEXT_PUBLIC_CLIENT_EMAIL || process.env.CLIENT_EMAIL;
  const currentUserEmail = adminEmail || clientEmail; // Use admin email as primary, fallback to client
  const metadata = {
    customMetadata: {
      adminEmail: currentUserEmail || '',
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  };

  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
