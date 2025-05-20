import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, X, User } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Mock notifications data
  const notifications = [
    {
      id: '1',
      message: 'Your article "The Future of AI" has been published',
      time: '2 hours ago',
      read: false,
      link: '#'
    },
    {
      id: '2',
      message: 'New comment on your article',
      time: '5 hours ago',
      read: true,
      link: '#'
    },
    {
      id: '3',
      message: 'Your article has reached 1,000 views!',
      time: 'Yesterday',
      read: false,
      link: '#'
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 md:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map(notification => (
                      <li key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                        <a href={notification.link} className="block">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                )}
              </div>
              <div className="p-2 border-t border-gray-200">
                <a href="/notifications" className="block text-center text-sm text-blue-600 hover:text-blue-800 p-2">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <Link to="/dashboard/profile" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src={user?.avatar_url || "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150"}
              alt={user?.name || user?.email}
              className="w-9 h-9 rounded-full object-cover border border-gray-300"
            />
            <span className="ml-2 text-sm font-medium text-gray-800 hidden sm:block">
              {user?.name || user?.email?.split('@')[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;