import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '../hooks/useUser';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: userLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !userLoading) {
      // Check if there's a return URL in the location state
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo, { replace: true });
    }
  }, [user, userLoading, navigate, location.state]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowForgotPassword(false);

    // Client-side validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Clear any existing sessions first to prevent conflicts
      await supabase.auth.signOut();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (signInError) {
        console.error('Sign-in error:', signInError);
        setLoading(false);
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('invalid_credentials') ||
            signInError.message.includes('Invalid email or password')) {
          setError('The email or password you entered is incorrect');
          setShowForgotPassword(true);
        } else {
          setError(signInError.message || 'An error occurred during sign in');
        }
        return;
      }
      
      if (data?.session) {
        console.log('Login successful, session established');
        
        // Fetch user data to ensure it's loaded before redirecting
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError) {
            console.error('Error fetching user data:', userError);
          }
          
          console.log('User data retrieved:', userData ? 'success' : 'not found');
          
          // Create user if not exists
          if (!userData && data.session.user.email) {
            try {
              console.log('Creating user record for authenticated user');
              const { error: createError } = await supabase
                .from('users')
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  is_admin: false
                });
                
              if (createError) {
                console.error('Error creating user record:', createError);
              } else {
                console.log('Created new user record');
              }
            } catch (createErr) {
              console.error('Error in user creation:', createErr);
            }
          }
        } catch (userErr) {
          console.error('Exception fetching user data:', userErr);
        }
        
        // Wait a moment for the session to be properly set
        setTimeout(() => {
          // Navigate to the returnTo path if provided in location state, otherwise to dashboard
          const returnTo = location.state?.returnTo || '/dashboard';
          navigate(returnTo, { replace: true });
        }, 1000);
      } else {
        console.error('No session data returned after successful login');
        setError('Failed to sign in. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setShowForgotPassword(true);
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address to reset your password');
      return;
    }

    setLoading(true);
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (!authError) {
          setError(null);
          alert('Check your email for the password reset link');
          break;
        }

        retryCount++;
        
        if (retryCount === maxRetries) {
          throw new Error('Unable to send password reset email. Please try again later.');
        }

        await sleep(Math.pow(2, retryCount) * 1000);
      } catch (err) {
        if (retryCount === maxRetries) {
          setError(
            err instanceof Error 
              ? err.message 
              : 'Failed to send reset email. Please try again later.'
          );
          break;
        }
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
        
        {location.state?.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {location.state.message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              {showForgotPassword && (
                <p className="mt-1">
                  Forgot your password?{' '}
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Reset it here
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;