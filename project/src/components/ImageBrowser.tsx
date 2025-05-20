import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, Upload } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface Image {
  id: string;
  src: {
    medium: string;
    large: string;
  };
  alt: string;
  photographer: string;
}

interface ImageBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  language?: 'en' | 'dv';
  initialImage?: string;
}

const ImageBrowser: React.FC<ImageBrowserProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  language = 'en',
  initialImage
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const fetchImages = async (query: string, pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/images?query=${encodeURIComponent(query)}&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setImages(data.photos || []);
      } else {
        setImages(prev => [...prev, ...(data.photos || [])]);
      }

      setHasMore((data.photos || []).length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(searchTerm, 1);
    }
  }, [isOpen, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchImages(searchTerm, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(searchTerm, nextPage);
  };

  const handleUploadComplete = (url: string) => {
    onSelect(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ފޮޓޯ އިޚްތިޔާރު ކުރައްވާ' : 'Select Image'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'dv' ? 'ފޮޓޯ ހޯއްދަވާ...' : 'Search images...'}
                  className={`w-full py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    language === 'dv' 
                      ? 'text-right thaana-waheed pr-10 pl-4' 
                      : 'text-left pl-10 pr-4'
                  }`}
                  dir={language === 'dv' ? 'rtl' : 'ltr'}
                />
                <Search 
                  className={`absolute top-2.5 ${language === 'dv' ? 'right-3' : 'left-3'} text-gray-400`} 
                  size={20} 
                />
              </form>
            </div>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload size={18} />
              <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                {language === 'dv' ? 'އަޕްލޯޑް ކުރައްވާ' : 'Upload'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {showUploader ? (
            <ImageUploader onUpload={handleUploadComplete} language={language} />
          ) : error ? (
            <div className="text-center text-red-600 py-4">
              {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : error}
            </div>
          ) : loading && images.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {initialImage && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? 'މިހާރުގެ ފޮޓޯ' : 'Current Image'}
                  </h3>
                  <div className="relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                    <img
                      src={initialImage}
                      alt="Current cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => onSelect(initialImage)}
                        className={`text-white opacity-0 group-hover:opacity-100 transition-opacity ${language === 'dv' ? 'thaana-waheed' : ''}`}
                      >
                        {language === 'dv' ? 'އަލުން އިޚްތިޔާރު ކުރައްވާ' : 'Use Again'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => onSelect(image.src.large)}
                    className="relative group aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img
                      src={image.src.medium}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <span className={`text-white opacity-0 group-hover:opacity-100 transition-opacity ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                        {language === 'dv' ? 'އިޚްތިޔާރު ކުރައްވާ' : 'Select'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                      {image.photographer}
                    </div>
                  </button>
                ))}
              </div>

              {hasMore && (
                <div className="mt-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className={language === 'dv' ? 'thaana-waheed' : ''}>
                        {language === 'dv' ? 'އިތުރަށް ލޯޑްކުރައްވާ' : 'Load More'}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageBrowser;