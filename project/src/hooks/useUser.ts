import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
  preferred_language?: string;
  user_type?: string;
  role_id?: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching current session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          console.log('No active session found');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('Session found, fetching user data for ID:', session.user.id);

        const { data, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (dbError) {
          console.error('Database error fetching user:', dbError);
          throw dbError;
        }
        
        if (!data) {
          console.log('No user data found in database');
          // Create a user record if it doesn't exist but auth session exists
          try {
            if (session.user.email) {
              console.log('Creating user record for authenticated user');
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  is_admin: false
                })
                .select()
                .single();
                
              if (createError) {
                console.error('Error creating user record:', createError);
                throw createError;
              }
              
              setUser(newUser as User);
              console.log('New user record created');
              setLoading(false);
              return;
            }
          } catch (createErr) {
            console.error('Error in user creation fallback:', createErr);
          }
          
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('User data retrieved successfully');
        setUser(data as User);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching user data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('User signed in, fetching profile data');
            try {
              const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error('Error fetching user on auth change:', error);
                throw error;
              }
              
              if (!data) {
                console.log('No user record found, creating one');
                // Create user record if it doesn't exist
                try {
                  if (session.user.email) {
                    const { data: newUser, error: createError } = await supabase
                      .from('users')
                      .insert({
                        id: session.user.id,
                        email: session.user.email,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        is_admin: false
                      })
                      .select()
                      .single();
                      
                    if (createError) throw createError;
                    setUser(newUser as User);
                  }
                } catch (createErr) {
                  console.error('Error creating user record on auth change:', createErr);
                  setUser(null);
                }
              } else {
                console.log('User data found and set');
                setUser(data as User);
              }
            } catch (err) {
              console.error('Error in auth state change handler:', err);
              setUser(null);
            } finally {
              setLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clear any stored tokens
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.refresh_token');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      throw err;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      setUser(data as User);
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    updateUser
  };
}