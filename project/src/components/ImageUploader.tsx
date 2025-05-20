import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  language?: 'en' | 'dv';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, language = 'en' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

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

      onUpload(publicUrl);
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
      setError(language === 'dv' ? 'ފޮޓޯ ފައިލެއް އަޕްލޯޑް ކުރައްވާ' : 'Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(language === 'dv' ? 'ފައިލްގެ ސައިޒް 5MB އަށްވުރެ ބޮޑުވެގެން ނުވާނެ' : 'File size must be less than 5MB');
      return;
    }

    await uploadImage(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Upload className="w-5 h-5" />
        )}
        <span className={language === 'dv' ? 'thaana-waheed' : ''}>
          {language === 'dv' ? 'ފޮޓޯ އަޕްލޯޑް ކުރައްވާ' : 'Upload Image'}
        </span>
      </button>

      <p className={`mt-2 text-sm text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
        {language === 'dv' ? 'ގިނަވެގެން 5MB' : 'Maximum 5MB'}
      </p>
    </div>
  );
};

export default ImageUploader;