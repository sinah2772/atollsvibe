import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import { useUser } from '../../hooks/useUser';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check auth status directly with Supabase
    const checkAuthStatus = async () => {
      try {
        setIsCheckingAuth(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found in dashboard - redirecting to login');
          navigate('/login', { 
            replace: true,
            state: { 
              message: 'Please sign in to access the dashboard',
              returnTo: location.pathname
            } 
          });
        } else {
          console.log('Valid session found in dashboard');
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        navigate('/login', { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  // Also redirect if useUser hook indicates no user
  useEffect(() => {
    if (!loading && !user && !isCheckingAuth) {
      console.log('No user found in useUser hook - redirecting to login');
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Please sign in to access the dashboard',
          returnTo: location.pathname
        } 
      });
    }
  }, [user, loading, navigate, isCheckingAuth, location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;