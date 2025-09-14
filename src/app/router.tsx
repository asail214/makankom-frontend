import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../shared/components/PublicLayout';
import { CustomerLayout } from '../shared/components/CustomerLayout';
import { OrganizerLayout } from '../shared/components/OrganizerLayout';
import { AdminLayout } from '../shared/components/AdminLayout';
import { ScanPointLayout } from '../shared/components/ScanPointLayout';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { EventsList } from '../features/events/pages/EventsList';

// Temporary placeholder components
const HomePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Makankom</h1>
    <p className="text-gray-600">Your event ticketing platform</p>
  </div>
);

const LoginPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Login</h1>
    <p className="text-gray-600">Login form will be here</p>
  </div>
);

const RegisterPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Register</h1>
    <p className="text-gray-600">Registration form will be here</p>
  </div>
);

const CustomerDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Dashboard</h1>
    <p className="text-gray-600">Welcome to your dashboard</p>
  </div>
);

const OrganizerDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Organizer Dashboard</h1>
    <p className="text-gray-600">Manage your events</p>
  </div>
);

const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
    <p className="text-gray-600">Platform administration</p>
  </div>
);

const ScanPointDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-white mb-4">Scan Point Dashboard</h1>
    <p className="text-gray-300">Device status and information</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
    <p className="text-gray-600">You don't have permission to access this page</p>
  </div>
);

const NotFoundPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
    <p className="text-gray-600">The page you're looking for doesn't exist</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><EventsList /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
      <Route path="/unauthorized" element={<PublicLayout><UnauthorizedPage /></PublicLayout>} />

      {/* Protected Routes - Customer */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout>
              <CustomerDashboard />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Organizer */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerLayout>
              <OrganizerDashboard />
            </OrganizerLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Scan Point */}
      <Route
        path="/scan/dashboard"
        element={
          <ProtectedRoute allowedRoles={['scan-point']}>
            <ScanPointLayout>
              <ScanPointDashboard />
            </ScanPointLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - 404 */}
      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  );
};