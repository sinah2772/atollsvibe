import React, { useState, useEffect } from 'react';
import { Category, Subcategory } from '../hooks/useCategories';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedSubcategoryId: string | null;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  language: 'en' | 'dv';
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
  language
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(cat => cat.id.toString() === selectedCategoryId);
      setSubcategories(category?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId, categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value;
    onCategoryChange(newCategoryId);
    // Reset subcategory when category changes
    onSubcategoryChange(null);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategoryId = e.target.value;
    onSubcategoryChange(newSubcategoryId === '' ? null : newSubcategoryId);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
          {language === 'dv' ? 'ބައި' : 'Category'}
        </label>
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''
          }`}
          dir={language === 'dv' ? 'rtl' : 'ltr'}
          aria-label={language === 'dv' ? 'ބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select category'}
        >
          <option value="">{language === 'dv' ? 'ބައެއް އިޚްތިޔާރު ކުރައްވާ' : 'Select a category'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {language === 'dv' ? cat.name : cat.name_en}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div>
          <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'ކުދިބައި' : 'Subcategory'}
          </label>
          <select
            value={selectedSubcategoryId || ''}
            onChange={handleSubcategoryChange}
            className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              language === 'dv' ? 'thaana-waheed placeholder:thaana-waheed' : ''
            }`}
            dir={language === 'dv' ? 'rtl' : 'ltr'}
            aria-label={language === 'dv' ? 'ކުދިބައި އިޚްތިޔާރު ކުރައްވާ' : 'Select subcategory'}
          >
            <option value="">{language === 'dv' ? 'ކުދިބައި އިޚްތިޔާރު ކުރައްވާ (ނުވަތަ ހުސްކޮށް ދޫކޮށްލާ)' : 'Select a subcategory (or leave empty)'}</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {language === 'dv' ? sub.name : sub.name_en}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
