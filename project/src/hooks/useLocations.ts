import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Atoll = Database['public']['Tables']['atolls']['Row'];

export function useAtolls() {
  const [atolls, setAtolls] = useState<Atoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAtolls();
  }, []);

  async function fetchAtolls() {
    try {
      const { data, error } = await supabase
        .from('atolls')
        .select('*')
        .order('id');

      if (error) throw error;
      setAtolls(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    atolls,
    loading,
    error,
    refresh: fetchAtolls
  };
}