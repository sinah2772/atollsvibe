import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import { supabase } from '../lib/supabase';
import { 
  BarChart, 
  Newspaper, 
  Users, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  Search,
  Calendar,
  Loader2
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileSidebar from '../components/layout/MobileSidebar';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { articles, loading: articlesLoading } = useArticles();
  const { categories } = useCategories();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!userLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (!articlesLoading && articles && user) {
      // Calculate dashboard statistics
      const userArticles = articles.filter(article => article.user_id === user.id);
      
      setStats({
        totalArticles: userArticles.length,
        publishedArticles: userArticles.filter(a => a.status === 'published').length,
        draftArticles: userArticles.filter(a => a.status === 'draft').length,
        totalViews: userArticles.reduce((sum, article) => sum + article.views, 0),
        totalLikes: userArticles.reduce((sum, article) => sum + article.likes, 0),
        totalComments: userArticles.reduce((sum, article) => sum + article.comments, 0)
      });
      
      setLoading(false);
    }
  }, [articlesLoading, articles, user]);

  // Filter and search articles
  const filteredArticles = articles
    ?.filter(article => user && article.user_id === user.id)
    .filter(article => {
      if (filter === 'all') return true;
      return article.status === filter;
    })
    .filter(article => {
      if (!searchTerm) return true;
      return (
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.heading.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Default cover image for articles without images
  const defaultCoverImage = "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || userLoading || articlesLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <MobileSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be signed in to view your dashboard.</p>
        <Link 
          to="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <img 
                  src={user.avatar_url || "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150"} 
                  alt={user.name || user.email} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name || user.email.split('@')[0]}</h1>
                  <p className="text-gray-600 mt-1">Here's what's happening with your content</p>
                </div>
                <div className="ml-auto">
                  <Link
                    to="/dashboard/new-article"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span className="thaana-waheed">އާ ލިޔުމެއް</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <Newspaper size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalArticles}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{stats.publishedArticles} published</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{stats.draftArticles} drafts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50 text-green-600">
                    <Eye size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">12% increase this month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                    <ThumbsUp size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Likes</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">8% increase this month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                    <MessageSquare size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalComments.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-green-500">5% increase this month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Articles Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Articles</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        filter === 'all' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('published')}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        filter === 'published' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Published
                    </button>
                    <button
                      onClick={() => setFilter('draft')}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        filter === 'draft' 
                          ? 'bg-white shadow-sm text-gray-800' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Drafts
                    </button>
                  </div>
                </div>
              </div>

              {filteredArticles && filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {article.cover_image ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={article.cover_image} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Newspaper size={24} className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {article.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            {article.category && (
                              <span className="ml-2 text-xs text-gray-500 thaana-waheed">
                                {article.category.name}
                                {article.subcategory && ` • ${article.subcategory.name}`}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dashboard/edit-article/${article.id}`}
                              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this article?')) {
                                  // Delete article logic here
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mt-1 truncate">
                          <Link to={`/article/${article.id}`} className="hover:text-blue-600">
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1 thaana-waheed text-right">
                          {article.heading}
                        </p>
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                          {article.status === 'published' && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {article.views}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp size={14} />
                                {article.likes}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                {article.comments}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">No articles found</p>
                  <Link
                    to="/dashboard/new-article"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Create your first article</span>
                  </Link>
                </div>
              )}
              
              {filteredArticles && filteredArticles.length > 0 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/dashboard/articles"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all articles
                  </Link>
                </div>
              )}
            </div>

            {/* Analytics Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Last 30 days</span>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Analytics data will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Publish more articles to see detailed statistics</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/dashboard/new-article"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Plus size={18} />
                    </div>
                    <span className="font-medium text-gray-700">Create New Article</span>
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Users size={18} />
                    </div>
                    <span className="font-medium text-gray-700">Edit Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/analytics"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <BarChart size={18} />
                    </div>
                    <span className="font-medium text-gray-700">View Analytics</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories?.slice(0, 5).map(category => (
                    <div key={category.id} className="flex items-center justify-between">
                      <span className="text-gray-700 thaana-waheed">{category.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {articles?.filter(a => a.category_id === category.id && a.user_id === user.id).length || 0} articles
                      </span>
                    </div>
                  ))}
                </div>
                {categories && categories.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link to="/categories" className="text-sm text-blue-600 hover:text-blue-800">
                      View all categories
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {filteredArticles?.slice(0, 3).map(article => (
                    <div key={article.id} className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        {article.status === 'published' ? (
                          <Eye size={16} />
                        ) : (
                          <Edit size={16} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {article.status === 'published' ? 'Published' : 'Updated'}: {article.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          <Clock size={12} className="inline mr-1" />
                          {new Date(article.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!filteredArticles || filteredArticles.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;