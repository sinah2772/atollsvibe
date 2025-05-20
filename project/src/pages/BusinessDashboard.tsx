import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, Edit, Search, Filter, BarChart2 } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  budget: number;
  status: 'active' | 'paused' | 'deleted';
  media_url: string;
  created_at: string;
  updated_at: string;
}

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

  // Fetch ads on component mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAds(data || []);
      } catch (err) {
        console.error('Error fetching ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(uploadData.path);

      // Save ad details to database
      const { data: ad, error: dbError } = await supabase
        .from('ads')
        .insert({
          title: file.name,
          media_url: publicUrl,
          user_id: user?.id,
          status: 'active',
          description: '',
          target_audience: '',
          budget: 0
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setAds(prev => [ad, ...prev]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      setLoading(true);

      // Soft delete - update status to deleted
      const { error } = await supabase
        .from('ads')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your advertisements and media content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Ads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ads.filter(ad => ad.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Uploads</p>
              <p className="text-2xl font-semibold text-gray-900">{ads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Storage Used</p>
              <p className="text-2xl font-semibold text-gray-900">2.4 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ads</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>

            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              <Upload size={20} className="mr-2" />
              Upload New
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                accept="image/*,video/*"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={ad.media_url}
                        alt={ad.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {ad.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ad.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ad.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ad.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;