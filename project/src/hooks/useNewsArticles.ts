import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Article = Database['public']['Tables']['articles']['Row'];

export function useNewsArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(name, name_en, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function createArticle(article: Database['public']['Tables']['articles']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      if (error) throw error;
      setArticles(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create article');
    }
  }

  async function updateArticle(
    id: string,
    updates: Database['public']['Tables']['articles']['Update']
  ) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setArticles(prev => prev.map(article => 
        article.id === id ? data : article
      ));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update article');
    }
  }

  async function deleteArticle(id: string) {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete article');
    }
  }

  return {
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    refresh: fetchArticles
  };
}