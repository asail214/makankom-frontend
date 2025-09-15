import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../shared/components/PublicLayout';
import { CustomerLayout } from '../shared/components/CustomerLayout';
import { OrganizerLayout } from '../shared/components/OrganizerLayout';
import { AdminLayout } from '../shared/components/AdminLayout';
import { ScanPointLayout } from '../shared/components/ScanPointLayout';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { EventsList } from '../features/events/pages/EventsList';
import { EventDetail } from '../features/events/pages/EventDetail';
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import RoleSelection from '../features/auth/pages/RoleSelection';
import { CustomerDashboard, CustomerProfile } from '../features/customer/pages';
import { CustomerTickets } from '../features/customer/pages/Tickets'; // Add this import

// Create a proper landing page
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-25">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-24">
        <div className="container text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to Makankom
          </h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Your premier destination for discovering and booking amazing events in Oman. 
            From concerts and festivals to workshops and conferences - find your next adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/events" 
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Browse Events
            </a>
            <a 
              href="/select-role" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-colors"
            >
              Sign In / Register
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Makankom?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make event discovery and booking simple, secure, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-600 text-2xl">🎫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Book tickets for your favorite events in just a few clicks. Simple, fast, and secure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-600 text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Discover Events</h3>
              <p className="text-gray-600">
                Find events that match your interests with our smart search and filtering system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary-600 text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Ready</h3>
              <p className="text-gray-600">
                Access your tickets anywhere, anytime. Our platform works perfectly on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Preview */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-gray-600 text-lg">
              Don't miss these amazing upcoming events
            </p>
          </div>
          
          <div className="text-center">
            <a 
              href="/events"
              className="inline-flex items-center bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg"
            >
              View All Events
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-accent-500 to-accent-600 text-white py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of event-goers who trust Makankom for their event experiences
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="bg-white text-accent-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Create Account
            </a>
            <a 
              href="/select-role" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-accent-600 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Create a dedicated route selection page
const SelectRolePage = () => {
  return <RoleSelection />;
};

// Temporary placeholder components
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

// Placeholder components for customer routes
const CustomerOrders = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
    <p className="text-gray-600">Your order history will appear here</p>
  </div>
);

const CustomerWishlist = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">My Wishlist</h1>
    <p className="text-gray-600">Your saved events will appear here</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><EventsList /></PublicLayout>} />
      <Route path="/events/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
      <Route path="/select-role" element={<PublicLayout showNavbar={false}><SelectRolePage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout showNavbar={false}><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout showNavbar={false}><Register /></PublicLayout>} />
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
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout>
              <CustomerProfile />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/tickets"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout>
              <CustomerTickets />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout>
              <CustomerOrders />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/wishlist"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout>
              <CustomerWishlist />
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