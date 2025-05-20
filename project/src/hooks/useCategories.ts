import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Subcategory {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  category_id: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  created_at: string;
  subcategories?: Subcategory[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('id');

      if (categoriesError) throw categoriesError;

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('id');

      if (subcategoriesError) throw subcategoriesError;

      // Group subcategories by category_id
      const subcategoriesByCategory = subcategoriesData.reduce((acc, subcategory) => {
        if (!acc[subcategory.category_id]) {
          acc[subcategory.category_id] = [];
        }
        acc[subcategory.category_id].push(subcategory);
        return acc;
      }, {});

      // Combine categories with their subcategories
      const categoriesWithSubcategories = categoriesData.map(category => ({
        ...category,
        subcategories: subcategoriesByCategory[category.id] || []
      }));

      setCategories(categoriesWithSubcategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories
  };
}