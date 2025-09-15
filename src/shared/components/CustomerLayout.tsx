import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LanguageSwitcher } from './LanguageSwitcher';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: '🏠' },
    { name: 'My Tickets', href: '/customer/tickets', icon: '🎫' },
    { name: 'My Orders', href: '/customer/orders', icon: '📋' },
    { name: 'Wishlist', href: '/customer/wishlist', icon: '❤️' },
    { name: 'Profile', href: '/customer/profile', icon: '👤' },
  ];

  const customerName = 'first_name' in user! ? `${user.first_name} ${user.last_name}` : user!.name;

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Makankom</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/events"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Browse Events
              </Link>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium text-sm">
                    {customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {customerName}
                </span>
              </div>

              <LanguageSwitcher />

              <button
                onClick={logout}
                className="text-gray-600 hover:text-error-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Portal</h2>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Help Section */}
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-primary-900 mb-2">Need Help?</h3>
              <p className="text-xs text-primary-700 mb-3">
                Contact our support team for assistance
              </p>
              <a 
                href="mailto:support@makankom.com"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Get Support →
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};