import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Island = Database['public']['Tables']['islands']['Row'];
type InsertIsland = Database['public']['Tables']['islands']['Insert'];
type UpdateIsland = Database['public']['Tables']['islands']['Update'];

interface IslandSubmitOptions {
  name: string;
  name_en: string;
  slug: string;
  island_code?: string;
  island_category: string;
  island_category_en: string;
  island_details?: string;
  longitude?: string;
  latitude?: string;
  election_commission_code?: string;
  postal_code?: string;
  other_name_en?: string;
  other_name_dv?: string;
  list_order?: number;
  atoll_id: number;
}

export function useIslandManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCoordinates = (longitude?: string, latitude?: string) => {
    if (!longitude && !latitude) return true;
    
    const lonRegex = /^[0-9]{1,3}°\s[0-9]{1,2}'\s[0-9]{1,2}\.[0-9]{3}"\s[EW]$/;
    const latRegex = /^[0-9]{1,2}°\s[0-9]{1,2}'\s[0-9]{1,2}\.[0-9]{3}"\s[NS]$/;
    
    if (longitude && !lonRegex.test(longitude)) {
      throw new Error('Invalid longitude format. Expected format: 73° 30\' 34.249" E');
    }
    if (latitude && !latRegex.test(latitude)) {
      throw new Error('Invalid latitude format. Expected format: 4° 10\' 27.299" N');
    }
    return true;
  };

  const createIsland = async (options: IslandSubmitOptions): Promise<Island> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate coordinates if provided
      validateCoordinates(options.longitude, options.latitude);

      // Generate slug if not provided
      if (!options.slug) {
        options.slug = options.name_en.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Verify atoll exists
      const { data: atoll, error: atollError } = await supabase
        .from('atolls')
        .select('id')
        .eq('id', options.atoll_id)
        .single();

      if (atollError || !atoll) {
        throw new Error(`Invalid atoll_id: ${options.atoll_id}`);
      }

      // Create island
      const { data, error } = await supabase
        .from('islands')
        .insert({
          name: options.name,
          name_en: options.name_en,
          slug: options.slug,
          island_code: options.island_code,
          island_category: options.island_category,
          island_category_en: options.island_category_en,
          island_details: options.island_details,
          longitude: options.longitude,
          latitude: options.latitude,
          election_commission_code: options.election_commission_code,
          postal_code: options.postal_code,
          other_name_en: options.other_name_en,
          other_name_dv: options.other_name_dv,
          list_order: options.list_order,
          atoll_id: options.atoll_id
        } as InsertIsland)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned after creating island');

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create island';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateIsland = async (id: number, options: Partial<IslandSubmitOptions>): Promise<Island> => {
    setLoading(true);
    setError(null);

    try {
      // Validate coordinates if provided
      validateCoordinates(options.longitude, options.latitude);

      // Verify island exists
      const { data: existingIsland, error: checkError } = await supabase
        .from('islands')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError || !existingIsland) {
        throw new Error(`Island with ID ${id} not found`);
      }

      // If atoll_id is being updated, verify the new atoll exists
      if (options.atoll_id) {
        const { data: atoll, error: atollError } = await supabase
          .from('atolls')
          .select('id')
          .eq('id', options.atoll_id)
          .single();

        if (atollError || !atoll) {
          throw new Error(`Invalid atoll_id: ${options.atoll_id}`);
        }
      }

      // Update island
      const { data, error } = await supabase
        .from('islands')
        .update(options as UpdateIsland)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned after updating island');

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update island';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteIsland = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('islands')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete island';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createIsland,
    updateIsland,
    deleteIsland
  };
}