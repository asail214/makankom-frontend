import React from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};