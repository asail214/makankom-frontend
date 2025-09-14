import React from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface PublicLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Makankom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};