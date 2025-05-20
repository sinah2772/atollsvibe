import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { Clock, Eye, ThumbsUp } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { articles, loading, error } = useArticles();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Default cover image for articles without images
  const defaultCoverImage = "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  useEffect(() => {
    if (!loading && articles) {
      const results = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.heading.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [query, articles, loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading search results. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 thaana-waheed text-right">
        "{query}" އާ ގުޅޭ ނަތީޖާ
      </h1>
      
      {searchResults.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 thaana-waheed">"{query}" އާ ގުޅޭ ނަތީޖާއެއް ނުލިބުނެވެ</p>
          <p className="text-gray-500 mt-2 thaana-waheed">އެހެން ލަފުޒަކުން ހޯއްދަވާ</p>
        </div>
      ) : (
        <div className="space-y-6">
          {searchResults.map((article) => (
            <article 
              key={article.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="md:flex">
                {(article.cover_image || defaultCoverImage) && (
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img 
                      src={article.cover_image || defaultCoverImage} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:w-3/4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.category && (
                      <Link 
                        to={`/category/${article.category.slug}`}
                        className="text-xs text-blue-600 hover:text-blue-800 thaana-waheed"
                      >
                        {article.category.name}
                      </Link>
                    )}
                    {article.subcategory && (
                      <>
                        <span className="text-gray-400">•</span>
                        <Link 
                          to={`/category/${article.category?.slug}/${article.subcategory.slug}`}
                          className="text-xs text-gray-600 hover:text-blue-800 thaana-waheed"
                        >
                          {article.subcategory.name}
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2">
                    <Link 
                      to={`/article/${article.id}`}
                      className="text-gray-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 line-clamp-2 mb-4 thaana-waheed text-right">{article.heading}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(article.publish_date || article.created_at).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {article.views}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {article.likes}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;