import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Subcategory } from '../types';

export function useSubcategories(categoryId?: number) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  async function fetchSubcategories() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('subcategories')
        .select('*')
        .order('id');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setSubcategories(data || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    subcategories,
    loading,
    error,
    refresh: fetchSubcategories
  };
}