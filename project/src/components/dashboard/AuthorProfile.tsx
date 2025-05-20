import React, { useState } from 'react';
import { Author } from '../../types';
import { formatNumber } from '../../utils/formatters';
import { Edit, Camera, Loader2, X } from 'lucide-react';
import ImageBrowser from '../ImageBrowser';
import { supabase } from '../../lib/supabase';

interface AuthorProfileProps {
  author: Author;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ author }) => {
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState(author.avatar);

  const handleImageSelect = async (url: string) => {
    setShowImageBrowser(false);
    setAvatar(url);
    // Here you would typically update the author's avatar in the database
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      setAvatar(publicUrl);
      // Here you would typically update the author's avatar in the database

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    await handleImageUpload(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Author Profile</h3>
        <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors">
          <Edit size={16} />
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center">
        <div className="relative group">
          <img
            src={avatar}
            alt={author.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="relative z-10 p-2 rounded-full bg-white text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Camera size={16} />
            </label>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-white bg-opacity-75 rounded-full"></div>
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 relative z-10" />
            </div>
          )}
        </div>
        
        <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
          <h4 className="text-xl font-semibold text-gray-900">{author.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{author.bio}</p>
          <p className="text-xs text-gray-500 mt-2">Member since {author.joined}</p>
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-50 rounded-full"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{formatNumber(author.articles)}</p>
          <p className="text-xs text-gray-500 mt-1">Articles</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{formatNumber(author.followers)}</p>
          <p className="text-xs text-gray-500 mt-1">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{formatNumber(author.following)}</p>
          <p className="text-xs text-gray-500 mt-1">Following</p>
        </div>
      </div>

      <ImageBrowser
        isOpen={showImageBrowser}
        onClose={() => setShowImageBrowser(false)}
        onSelect={handleImageSelect}
        language="en"
      />
    </div>
  );
};

export default AuthorProfile;