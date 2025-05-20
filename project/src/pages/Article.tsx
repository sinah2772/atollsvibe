import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { Clock, Eye, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const Article = () => {
  const { id } = useParams();
  const { article, isLoading, error } = useArticles(id);

  useEffect(() => {
    // Scroll to top when article loads
    window.scrollTo(0, 0);
  }, [id]);

  // Default cover image for articles without images
  const defaultCoverImage = "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading article: {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
        <p className="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">›</span>
        {article.category && (
          <>
            <Link 
              to={`/category/${article.category.slug}`} 
              className="hover:text-blue-600 thaana-waheed"
            >
              {article.category.name}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        {article.subcategory && (
          <>
            <Link 
              to={`/category/${article.category?.slug}/${article.subcategory.slug}`} 
              className="hover:text-blue-600 thaana-waheed"
            >
              {article.subcategory.name}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        <span className="truncate">{article.title}</span>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {article.is_breaking && (
          <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            Breaking News
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 mb-6 thaana-waheed text-right">{article.heading}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {new Date(article.publish_date || article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-8">
          <img
            src={article.cover_image || defaultCoverImage}
            alt={article.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
          {article.image_caption && (
            <p className="text-sm text-gray-500 mt-2 italic">{article.image_caption}</p>
          )}
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Render the article content based on the JSON structure */}
        {article.content && typeof article.content === 'object' ? (
          <div className="thaana-waheed text-right">
            {/* This is a placeholder. In a real app, you would use a proper JSON renderer */}
            <p>{article.content.content?.[0]?.content?.[0]?.text || 'No content available'}</p>
          </div>
        ) : (
          <div className="thaana-waheed text-right">
            <p>މި ޚަބަރުގެ ތަފްޞީލް ލިބެން ނެތް</p>
            <p className="text-gray-500 mt-4">This article's content is not available at the moment.</p>
          </div>
        )}
      </div>

      {/* Tags and Categories */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {article.category && (
            <Link 
              to={`/category/${article.category.slug}`}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 thaana-waheed"
            >
              {article.category.name}
            </Link>
          )}
          {article.subcategory && (
            <Link 
              to={`/category/${article.category?.slug}/${article.subcategory.slug}`}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 thaana-waheed"
            >
              {article.subcategory.name}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default Article;