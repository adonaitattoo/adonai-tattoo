'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Trash2, 
  LogOut, 
  Images,
  Plus,
  AlertTriangle,
  Settings,
  X,
  Eye,
  EyeOff
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const handleImageSelect = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    
    const confirmMessage = selectedImages.length === 1 
      ? 'Are you sure you want to delete this image?'
      : `Are you sure you want to delete ${selectedImages.length} images?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const { deleteGalleryImage } = await import('@/lib/firebase-client-admin');
      
      // Delete all selected images
      await Promise.all(selectedImages.map(id => deleteGalleryImage(id)));
      
      // Update local state
      setImages(images.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
      fetchImages(); // Refresh to update counts
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const { signInWithEmailAndPassword, updatePassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      // Get current user email
      const adminInfo = getAdminInfo();
      const userEmail = currentUser?.email || adminInfo.email;
      
      // Re-authenticate user with current password
      const credential = await signInWithEmailAndPassword(auth, userEmail, currentPassword);
      
      // Update password
      await updatePassword(credential.user, newPassword);
      
      // Clear form and close modal
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowSettings(false);
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      if (error instanceof Error) {
        if (error.message.includes('wrong-password')) {
          alert('Current password is incorrect');
        } else if (error.message.includes('weak-password')) {
          alert('New password is too weak. Please choose a stronger password.');
        } else {
          alert('Failed to update password. Please try again.');
        }
      }
    } finally {
      setIsChangingPassword(false);
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
        {/* Settings Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Manage Gallery</h2>
            
            {/* Selection Controls */}
            {selectedImages.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedImages.length} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedImages.length})</span>
                </button>
              </div>
            )}
          </div>
          
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
              {images.map((image) => {
                const isSelected = selectedImages.includes(image.id);
                return (
                  <div 
                    key={image.id} 
                    className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-4 ring-blue-500 ring-opacity-75' : ''
                    }`}
                    onClick={() => handleImageSelect(image.id)}
                  >
                    <Image
                      src={image.imageUrl}
                      alt="Gallery image"
                      fill
                      className={`object-cover transition-all duration-200 ${
                        isSelected ? 'opacity-80' : 'opacity-100'
                      }`}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    
                    {/* Selection Checkbox */}
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white/80 border-gray-300 backdrop-blur-sm'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <p className="text-xs truncate">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips for Mobile */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Mobile Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tap images to select multiple for deletion</li>
            <li>• Images are automatically optimized for web</li>
            <li>• Check storage usage regularly to avoid overages</li>
            <li>• Selected images show a blue ring and checkbox</li>
          </ul>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Current User</h3>
                <p className="text-sm text-gray-600">{currentUser?.email || 'Loading...'}</p>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                
                {/* Current Password */}
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      placeholder="Enter new password (min 6 characters)"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}