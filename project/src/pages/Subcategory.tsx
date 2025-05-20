import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useArticles } from '../hooks/useArticles';
import { Clock, Eye, MessageSquare, ThumbsUp } from 'lucide-react';

const Subcategory = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const { categories } = useCategories();
  const { articles, loading, error } = useArticles();

  const category = categories?.find(c => c.slug === categorySlug);
  const subcategory = category?.subcategories?.find(s => s.slug === subcategorySlug);
  const subcategoryArticles = articles?.filter(article => article.subcategory_id === subcategory?.id);

  // Default cover image for articles without images
  const defaultCoverImage = "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-800">Error loading articles. Please try again later.</p>
      </div>
    );
  }

  if (!category || !subcategory) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h2>
        <p className="text-gray-600">The category or subcategory you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link 
          to={`/category/${category.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {category.name}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{subcategory.name}</h1>
        <p className="text-gray-600 mt-2">{subcategory.name_en}</p>
      </div>

      {subcategoryArticles && subcategoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategoryArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={article.cover_image || defaultCoverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {article.is_breaking && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                    Breaking
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {article.heading}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(article.publish_date || article.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} />
                      {article.likes}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No articles found in this subcategory.</p>
        </div>
      )}
    </div>
  );
};

export default Subcategory;