'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Trash2, 
  LogOut, 
  Images,
  Plus,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/firebase-client-admin';
import { User as FirebaseUser } from 'firebase/auth';

interface GalleryImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'uploading' | 'success' | 'error'>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const router = useRouter();

  const getAdminInfo = () => {
    return {
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Admin',
      isAdmin: true,
      authenticated: true
    };
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (!user) {
          const adminInfo = getAdminInfo();
          setCurrentUser({
            email: adminInfo.email,
            displayName: 'Admin',
            uid: 'admin'
          } as FirebaseUser);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    loadCurrentUser();
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { getGalleryImages } = await import('@/lib/firebase-client-admin');
      const images = await getGalleryImages();
      setImages(images || []);
      
      // Calculate approximate storage used (rough estimate)
      const estimatedStorage = images.reduce((total) => total + 2, 0); // ~2MB per image estimate
      setStorageUsed(estimatedStorage);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert('Only image files are allowed');
    }
    
    setSelectedFiles(validFiles);
    setUploadProgress({});
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    for (const file of selectedFiles) {
      setUploadProgress(prev => ({ ...prev, [file.name]: 'uploading' }));

      try {
        const { uploadImageToStorage, addGalleryImage } = await import('@/lib/firebase-client-admin');
        
        const imageUrl = await uploadImageToStorage(file);
        
        await addGalleryImage({
          imageUrl,
          order: images.length,
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 'success' }));
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress(prev => ({ ...prev, [file.name]: 'error' }));
        
        if (error instanceof Error) {
          alert(`Upload failed for ${file.name}: ${error.message}`);
        }
      }
    }

    setIsUploading(false);
    setSelectedFiles([]);
    fetchImages(); // Refresh gallery
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { deleteGalleryImage } = await import('@/lib/firebase-client-admin');
      await deleteGalleryImage(id);
      setImages(images.filter(img => img.id !== id));
      fetchImages(); // Refresh to update counts
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setUploadProgress({});
  };

  // Firebase Blaze plan has 5GB free storage
  const storageLimit = 5000; // 5GB in MB
  const storagePercentage = (storageUsed / storageLimit) * 100;
  const isNearLimit = storagePercentage > 80;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Images className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Gallery Admin</h1>
                {currentUser?.email && (
                  <p className="text-xs text-gray-500 truncate max-w-48">
                    {currentUser.email}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Gallery Overview */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery Overview</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{images.length}</div>
              <div className="text-sm text-gray-600">Total Images</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {storageUsed.toFixed(1)}MB
              </div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
          </div>

          {/* Storage Usage Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Storage Usage</span>
              <span className={isNearLimit ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {storagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isNearLimit ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            {isNearLimit && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Approaching storage limit! Consider optimizing images.</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h2>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-medium">Tap to select images</span>
                    <br />
                    JPG, PNG, GIF up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFiles.length} file(s) selected
                  </span>
                  <button
                    onClick={clearSelectedFiles}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs bg-gray-50 rounded p-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="truncate flex-1">{file.name}</span>
                      {uploadProgress[file.name] && (
                        <div className={`w-2 h-2 rounded-full ${
                          uploadProgress[file.name] === 'uploading' ? 'bg-yellow-500 animate-pulse' :
                          uploadProgress[file.name] === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload {selectedFiles.length} Image(s)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Management */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Gallery</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Images className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload some images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image) => (
                <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
                  <Image
                    src={image.imageUrl}
                    alt="Gallery image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips for Mobile */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Mobile Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hold and select multiple images at once</li>
            <li>• Images are automatically optimized for web</li>
            <li>• Tap and hold an image to see delete option</li>
            <li>• Check storage usage regularly to avoid overages</li>
          </ul>
        </div>
      </main>
    </div>
  );
}