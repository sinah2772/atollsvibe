import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Analytics from './pages/Analytics';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';
import Comments from './pages/Comments';
import Audience from './pages/Audience';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import BusinessDashboard from './pages/BusinessDashboard';
import { useUser } from './hooks/useUser';
import Home from './pages/Home';
import Article from './pages/Article';
import Category from './pages/Category';
import Subcategory from './pages/Subcategory';
import Search from './pages/Search';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<Article />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="category/:categorySlug/:subcategorySlug" element={<Subcategory />} />
          <Route path="search" element={<Search />} />
        </Route>
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="new-article" element={<NewArticle />} />
          <Route path="edit-article/:id" element={<EditArticle />} />
          <Route path="comments" element={<Comments />} />
          <Route path="audience" element={<Audience />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="business" element={<BusinessDashboard />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;