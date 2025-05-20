import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

type Island = {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  island_code: string | null;
  island_category: string | null;
  island_category_en: string | null;
  island_details: string | null;
  longitude: string | null;
  latitude: string | null;
  election_commission_code: string | null;
  postal_code: string | null;
  other_name_en: string | null;
  other_name_dv: string | null;
  list_order: number | null;
  atoll_id: number | null;
  created_at: string;
  atoll?: {
    id: number;
    name: string;
    name_en: string;
    slug: string;
  };
};

export function useIslands(atollIds?: number[]) {
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevAtollIdsRef = useRef<number[] | undefined>();
  
  const fetchIslands = useCallback(async () => {
    try {
      // Check if the atollIds have actually changed
      const prevAtollIds = prevAtollIdsRef.current;
      const atollIdsChanged = 
        !prevAtollIds && atollIds || 
        !atollIds && prevAtollIds || 
        (atollIds && prevAtollIds && 
          (atollIds.length !== prevAtollIds.length || 
           !atollIds.every((id, i) => id === prevAtollIds[i])));

      console.log('Fetching islands with atollIds:', atollIds, 'changed:', atollIdsChanged);
      
      // Update the ref to current atollIds
      prevAtollIdsRef.current = atollIds;
      
      setLoading(true);
      setError(null);

      let query = supabase
        .from('islands')
        .select(`
          *,
          atoll:atoll_id (
            id,
            name,
            name_en,
            slug
          )
        `);

      // Filter by atolls if provided
      if (atollIds && atollIds.length > 0) {
        query = query.in('atoll_id', atollIds);
      }

      // Apply ordering after filtering
      query = query.order('list_order', { ascending: true });

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      console.log('Islands data fetched:', data?.length || 0, 'islands');
      setIslands(data || []);
    } catch (err) {
      console.error('Error fetching islands:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [atollIds]);

  useEffect(() => {
    console.log('useIslands useEffect triggered, atollIds:', atollIds);
    fetchIslands();
  }, [fetchIslands, atollIds]);

  return {
    islands,
    loading,
    error,
    refresh: fetchIslands
  };
}