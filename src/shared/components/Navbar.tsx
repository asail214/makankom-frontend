import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Makankom
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.events')}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/${userType}/dashboard`}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('navigation.dashboard')}
                </Link>
                <span className="text-sm text-gray-600">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('navigation.login')}
                </Link>
                <Link 
                  to="/register"
                  className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};