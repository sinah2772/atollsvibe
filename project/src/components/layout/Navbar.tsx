import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, Search, X, User, LogIn, ChevronDown, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useUser } from '../../hooks/useUser';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Navbar: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryId);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if current route is dashboard
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Default avatar image
  const defaultAvatar = "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-800">
            Habaru
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ހޯއްދަވާ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent thaana-waheed text-right"
                dir="rtl"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isDashboard && !categoriesLoading && (
              <div className="relative group">
                {categories?.slice(0, 5).map(category => (
                  <div key={category.id} className="relative inline-block mx-2">
                    <div 
                      className="flex items-center cursor-pointer text-gray-700 hover:text-blue-600 thaana-waheed"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                      <ChevronDown size={16} className="ml-1" />
                    </div>
                    
                    {/* Dropdown for subcategories */}
                    {openCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
                        <Link
                          to={`/category/${category.slug}`}
                          className="block px-4 py-2 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 thaana-waheed"
                          onClick={() => setOpenCategory(null)}
                        >
                          ހުރިހާ {category.name}
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        {category.subcategories.map(subcategory => (
                          <Link
                            key={subcategory.id}
                            to={`/category/${category.slug}/${subcategory.slug}`}
                            className="block px-4 py-2 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 thaana-waheed"
                            onClick={() => setOpenCategory(null)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                >
                  <img 
                    src={user.avatar_url || defaultAvatar} 
                    alt={user.name || user.email} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
                  <ChevronDown size={16} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn size={18} />
                <span className="thaana-waheed">ލޮގިން</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <form onSubmit={handleSearch} className="flex items-center mb-4">
              <input
                type="text"
                placeholder="ހޯއްދަވާ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent thaana-waheed text-right"
                dir="rtl"
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
              >
                <Search size={20} />
              </button>
            </form>
            
            {user && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={user.avatar_url || defaultAvatar} 
                    alt={user.name || user.email} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{user.name || user.email.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
            
            {!isDashboard && !categoriesLoading && (
              <div className="space-y-1">
                {categories?.map(category => (
                  <div key={category.id} className="border-b border-gray-100 pb-2 mb-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronDown 
                          size={20} 
                          className={`transform transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <Link
                        to={`/category/${category.slug}`}
                        className="block py-2 text-gray-700 hover:text-blue-600 thaana-waheed text-right"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </div>
                    
                    {openCategory === category.id && category.subcategories && (
                      <div className="pl-8 pr-4 py-2 space-y-2 bg-gray-50 rounded-lg mt-2">
                        {category.subcategories.map(subcategory => (
                          <Link
                            key={subcategory.id}
                            to={`/category/${category.slug}/${subcategory.slug}`}
                            className="block py-1 text-gray-600 hover:text-blue-600 thaana-waheed text-right text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {!user && (
                  <Link
                    to="/login"
                    className="flex items-center justify-end gap-2 py-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="thaana-waheed">ލޮގިން</span>
                    <LogIn size={18} />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;