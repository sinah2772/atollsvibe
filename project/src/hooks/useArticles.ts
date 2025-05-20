import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Article {
  id: string;
  title: string;
  heading: string;
  social_heading: string | null;
  content: Record<string, unknown>;
  category_id: number;
  subcategory_id: number | null;
  atoll_ids: number[];
  island_ids: number[];
  cover_image: string | null;
  image_caption: string | null;
  status: string;
  publish_date: string | null;
  views: number;
  likes: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_breaking?: boolean;
  is_featured?: boolean;
  is_developing?: boolean;
  is_exclusive?: boolean;
  is_sponsored?: boolean;
  sponsored_by?: string;
  sponsored_url?: string;
  category?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
  subcategory?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
}

export function useArticles(id?: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticleById(id);
    } else {
      fetchArticles();
    }
  }, [id]);

  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select(`
          *,
          category:category_id(id, name, name_en, slug),
          subcategory:subcategory_id(id, name, name_en, slug)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function fetchArticleById(articleId: string) {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select(`
          *,
          category:category_id(id, name, name_en, slug),
          subcategory:subcategory_id(id, name, name_en, slug)
        `)
        .eq('id', articleId)
        .single();

      if (fetchError) throw fetchError;
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function createArticle(newArticle: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments'>) {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert([newArticle])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateArticle(articleId: string, updatedArticle: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('articles')
        .update(updatedArticle)
        .eq('id', articleId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Update the articles list with the updated article
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === articleId ? { ...article, ...data } : article
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    articles,
    article,
    loading,
    isLoading,
    error,
    refresh: fetchArticles,
    createArticle,
    updateArticle
  };
}