import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';
import { Clock, Eye, MessageSquare, ThumbsUp } from 'lucide-react';

function Home() {
  const { articles, loading, error } = useArticles();
  const { categories } = useCategories();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  // Get featured article (most recent breaking news or featured article)
  const featuredArticle = articles?.find(a => a.is_breaking || a.is_featured);

  // Get latest articles excluding the featured one
  const latestArticles = articles
    ?.filter(a => a.id !== featuredArticle?.id && a.status === 'published')
    .slice(0, 6);

  // Group articles by category
  const articlesByCategory = categories?.reduce((acc, category) => {
    acc[category.id] = articles?.filter(
      article => article.category_id === category.id && article.status === 'published'
    ).slice(0, 4) || [];
    return acc;
  }, {} as Record<number, typeof articles>);

  // Default cover images for articles without images
  const defaultCoverImage = "https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const defaultFeaturedImage = "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="space-y-12">
      {/* Featured Article */}
      {featuredArticle ? (
        <div className="relative h-[500px] rounded-xl overflow-hidden group">
          <img
            src={featuredArticle.cover_image || defaultFeaturedImage}
            alt={featuredArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {featuredArticle.is_breaking && (
              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                Breaking News
              </span>
            )}
            <h1 className="text-4xl font-bold text-white mb-4">{featuredArticle.title}</h1>
            <p className="text-xl text-gray-200 mb-4 line-clamp-2 thaana-waheed text-right">{featuredArticle.heading}</p>
            <div className="flex items-center gap-6 text-gray-300 text-sm">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {new Date(featuredArticle.publish_date || featuredArticle.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {featuredArticle.views}
              </span>
              <span className="flex items-center gap-2">
                <ThumbsUp size={16} />
                {featuredArticle.likes}
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare size={16} />
                {featuredArticle.comments}
              </span>
            </div>
          </div>
          <Link 
            to={`/article/${featuredArticle.id}`}
            className="absolute inset-0"
            aria-label="Read more"
          />
        </div>
      ) : (
        <div className="relative h-[500px] rounded-xl overflow-hidden group">
          <img
            src={defaultFeaturedImage}
            alt="Featured article placeholder"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Habaru News</h1>
            <p className="text-xl text-gray-200 mb-4 line-clamp-2 thaana-waheed text-right">ހަބަރު ނިއުސްއަށް މަރުޙަބާ</p>
          </div>
        </div>
      )}

      {/* Latest Articles */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 thaana-waheed">އެންމެ ފަހުގެ ޚަބަރު</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles && latestArticles.length > 0 ? (
            latestArticles.map((article) => (
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
                  {article.subcategory && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 bg-opacity-80 text-white px-2 py-1 rounded text-xs thaana-waheed">
                      {article.subcategory.name}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 thaana-waheed text-right">
                    {article.heading}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(article.publish_date || article.created_at).toLocaleDateString()}</span>
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
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No articles available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      {categories?.map((category) => {
        const categoryArticles = articlesByCategory[category.id];
        if (!categoryArticles?.length) return null;

        return (
          <section key={category.id} className="border-t border-gray-200 pt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 thaana-waheed">{category.name}</h2>
              <Link
                to={`/category/${category.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium thaana-waheed"
              >
                އިތުރަށް ބައްލަވާ
              </Link>
            </div>
            
            {/* Subcategory Pills */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                {category.subcategories.slice(0, 5).map(subcategory => (
                  <Link
                    key={subcategory.id}
                    to={`/category/${category.slug}/${subcategory.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 whitespace-nowrap thaana-waheed"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group"
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={article.cover_image || defaultCoverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 thaana-waheed text-right">
                    {article.heading}
                  </p>
                  {article.subcategory && (
                    <span className="inline-block mt-2 text-xs text-blue-600 thaana-waheed">
                      {article.subcategory.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Home;