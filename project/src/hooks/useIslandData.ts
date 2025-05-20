import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Island = Database['public']['Tables']['islands']['Row'] & {
  atoll: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  } | null;
};

export function useIslandData(id?: number) {
  const [island, setIsland] = useState<Island | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsland(null);
      setLoading(false);
      return;
    }

    const fetchIsland = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('islands')
          .select(`
            *,
            atoll:atoll_id (
              id,
              name,
              name_en,
              slug
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error(`Island with ID ${id} not found`);

        setIsland(data as Island);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch island data';
        setError(message);
        console.error('Error fetching island:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIsland();
  }, [id]);

  const refresh = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('islands')
        .select(`
          *,
          atoll:atoll_id (
            id,
            name,
            name_en,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Island with ID ${id} not found`);

      setIsland(data as Island);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh island data';
      setError(message);
      console.error('Error refreshing island:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    island,
    loading,
    error,
    refresh
  };
}