import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../shared/components/Layout';
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
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Dashboard</h1>
    <p className="text-gray-600">Customer dashboard content</p>
  </div>
);

const OrganizerDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Organizer Dashboard</h1>
    <p className="text-gray-600">Organizer dashboard content</p>
  </div>
);

const AdminDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
    <p className="text-gray-600">Admin dashboard content</p>
  </div>
);

const ScanPointDashboard = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan Point Dashboard</h1>
    <p className="text-gray-600">Scan point dashboard content</p>
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
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes - Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Organizer */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Scan Point */}
        <Route
          path="/scan-point/dashboard"
          element={
            <ProtectedRoute allowedRoles={['scan-point']}>
              <ScanPointDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};