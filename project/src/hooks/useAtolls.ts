import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Atoll = Database['public']['Tables']['atolls']['Row'];

export function useAtolls(islandId?: number | null) {
  const [atolls, setAtolls] = useState<Atoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAtolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (islandId) {
        // If island ID is provided, fetch only the atoll containing this island
        // First, get the atoll_id for this island
        const { data: islandData, error: islandError } = await supabase
          .from('islands')
          .select('atoll_id')
          .eq('id', islandId)
          .single();
        
        if (islandError) throw islandError;
        if (islandData?.atoll_id) {
          // Then fetch just that atoll
          const { data: atollData, error: atollError } = await supabase
            .from('atolls')
            .select('*')
            .eq('id', islandData.atoll_id);
          
          if (atollError) throw atollError;
          setAtolls(atollData || []);
          setLoading(false);
          return;
        }
      }
      
      // If no island filter or island has no atoll, fetch all atolls
      const { data, error } = await supabase
        .from('atolls')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setAtolls(data || []);
    } catch (err) {
      console.error('Error fetching atolls:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [islandId]);

  useEffect(() => {
    fetchAtolls();
  }, [fetchAtolls]);

  return {
    atolls,
    loading,
    error,
    refresh: fetchAtolls
  };
}