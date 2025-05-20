import React from 'react';
import { Link } from 'react-router-dom';
import { Subcategory } from '../types';

interface SubcategoryListProps {
  subcategories: Subcategory[];
  categorySlug: string;
  language?: 'en' | 'dv';
  className?: string;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ 
  subcategories, 
  categorySlug, 
  language = 'dv',
  className = ''
}) => {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {subcategories.map(subcategory => (
        <Link
          key={subcategory.id}
          to={`/category/${categorySlug}/${subcategory.slug}`}
          className={`px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors ${
            language === 'dv' ? 'thaana-waheed' : ''
          }`}
        >
          {language === 'dv' ? subcategory.name : subcategory.name_en}
        </Link>
      ))}
    </div>
  );
};

export default SubcategoryList;