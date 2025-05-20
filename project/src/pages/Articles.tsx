import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { Clock, Eye, ThumbsUp, MessageSquare, Edit, Trash2 } from 'lucide-react';

const Articles = () => {
  const { articles, isLoading, error } = useArticles();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading articles: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <Link
          to="/dashboard/new-article"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Article
        </Link>
      </div>

      <div className="space-y-4">
        {articles?.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/dashboard/edit-article/${article.id}`} className="hover:text-blue-600">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-600 thaana-waheed text-right">{article.heading}</p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/dashboard/edit-article/${article.id}`}
                  className="text-gray-600 hover:text-blue-600 p-2"
                >
                  <Edit size={20} />
                </Link>
                <button
                  className="text-gray-600 hover:text-red-600 p-2"
                  onClick={() => {
                    // Handle delete
                    if (window.confirm('Are you sure you want to delete this article?')) {
                      // Delete logic here
                    }
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {new Date(article.publish_date || article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {article.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={16} />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  {article.comments}
                </span>
              </div>
            </div>

            {article.category && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm thaana-waheed">
                  {article.category.name}
                </span>
                {article.subcategory && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm thaana-waheed">
                    {article.subcategory.name}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;