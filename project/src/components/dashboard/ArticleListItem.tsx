import React from 'react';
import { Article } from '../../types';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { Eye, ThumbsUp, MessageSquare, Clock, Edit, Trash2 } from 'lucide-react';

interface ArticleListItemProps {
  article: Article;
  viewMode?: 'list' | 'grid';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  language?: 'en' | 'dv';
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ 
  article,
  viewMode = 'list',
  onEdit,
  onDelete,
  language = 'en'
}) => {
  const statusColor = getStatusColor(article.status);
  
  if (viewMode === 'grid') {
    return (
      <div className="bg-black rounded-lg overflow-hidden relative group">
        <div className="aspect-[4/3] relative">
          {article.coverImage ? (
            <img 
              src={article.coverImage}
              alt={language === 'dv' ? article.heading : article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
            {article.status}
          </span>
          {article.isBreaking && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
              Breaking
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className={`font-medium mb-2 line-clamp-2 ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
            {language === 'dv' ? article.heading : article.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} min
              </span>
              {article.publishDate && (
                <span>{formatDate(article.publishDate)}</span>
              )}
            </div>
            
            {article.status === 'published' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {article.comments}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-2 left-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(article.id)}
              className="p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
              title={language === 'dv' ? 'އެޑިޓްކުރައްވާ' : 'Edit'}
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(article.id)}
              className="p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
              title={language === 'dv' ? 'ޑިލީޓްކުރައްވާ' : 'Delete'}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-[200px] h-[120px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {article.coverImage ? (
            <img 
              src={article.coverImage}
              alt={language === 'dv' ? article.heading : article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                  {article.status}
                </span>
                {article.isBreaking && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                    Breaking
                  </span>
                )}
              </div>
              <h3 className={`font-medium text-gray-900 mb-1 line-clamp-2 ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
                {language === 'dv' ? article.heading : article.title}
              </h3>
              <p className={`text-sm text-gray-500 line-clamp-2 ${language === 'dv' ? 'thaana-waheed text-right' : ''}`}>
                {language === 'dv' ? article.title : article.heading}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(article.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors"
                  title={language === 'dv' ? 'އެޑިޓްކުރައްވާ' : 'Edit'}
                >
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(article.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                  title={language === 'dv' ? 'ޑިލީޓްކުރައްވާ' : 'Delete'}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} min
              </span>
              {article.publishDate && (
                <span>{formatDate(article.publishDate)}</span>
              )}
            </div>
            
            {article.status === 'published' && (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  {article.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {article.comments}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleListItem;