import React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface ScanPointLayoutProps {
  children: ReactNode;
}

export const ScanPointLayout: React.FC<ScanPointLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Scanner', href: '/scan/scanner', icon: '📷' },
    { name: 'Dashboard', href: '/scan/dashboard', icon: '📊' },
    { name: 'History', href: '/scan/history', icon: '📋' },
    { name: 'Settings', href: '/scan/profile', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-semibold">Scan Point</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-screen">
        {/* Bottom Navigation */}
        <nav className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex justify-around">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};