import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';
import api from '../../../shared/api/api';

// Define proper types
interface CustomerStats {
  total_tickets: number;
  events_attended: number;
  upcoming_events: number;
  wishlist_count: number;
}

interface TicketEvent {
  id: number;
  title: string;
  start_date: string;
}

interface CustomerTicket {
  id: number;
  status: string;
  event?: TicketEvent;
}

interface CustomerOrder {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// API functions for customer data
const fetchCustomerStats = async (): Promise<CustomerStats> => {
  const { data } = await api.get('/customer/dashboard-stats');
  return data.data || data;
};

const fetchUpcomingEvents = async (): Promise<CustomerTicket[]> => {
  const { data } = await api.get('/customer/tickets', { params: { limit: 3 } });
  return data.data || data;
};

const fetchRecentOrders = async (): Promise<CustomerOrder[]> => {
  const { data } = await api.get('/customer/orders', { params: { limit: 3 } });
  return data.data || data;
};

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: fetchCustomerStats,
    retry: 1,
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['customer-upcoming-events'],
    queryFn: fetchUpcomingEvents,
    retry: 1,
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-recent-orders'],
    queryFn: fetchRecentOrders,
    retry: 1,
  });

  const customerName = 'first_name' in user! ? `${user.first_name} ${user.last_name}` : user!.name;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {customerName}! 👋
        </h1>
        <p className="text-primary-100 text-lg">
          Ready to discover your next amazing event experience?
        </p>
        <div className="mt-6">
          <Link to="/events">
            <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-50">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsLoading ? (
          <div className="md:col-span-4">
            <InlineLoading text="Loading your stats..." />
          </div>
        ) : (
          <>
            <Card variant="luxury" className="p-6 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {stats?.total_tickets || 0}
              </div>
              <div className="text-gray-600 text-sm">Total Tickets</div>
            </Card>

            <Card variant="luxury" className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {stats?.events_attended || 0}
              </div>
              <div className="text-gray-600 text-sm">Events Attended</div>
            </Card>

            <Card variant="luxury" className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {stats?.upcoming_events || 0}
              </div>
              <div className="text-gray-600 text-sm">Upcoming Events</div>
            </Card>

            <Card variant="luxury" className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {stats?.wishlist_count || 0}
              </div>
              <div className="text-gray-600 text-sm">Wishlist Items</div>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card variant="luxury" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🎫 Your Upcoming Events</h2>
            <Link 
              to="/customer/tickets" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {eventsLoading ? (
            <InlineLoading text="Loading events..." />
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((ticket: CustomerTicket) => (
                <div key={ticket.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {ticket.event?.start_date ? new Date(ticket.event.start_date).getDate() : '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {ticket.event?.title || 'Event'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ticket.event?.start_date && 
                        new Date(ticket.event.start_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })
                      }
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      ticket.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🎫</span>
              </div>
              <p className="text-gray-600 mb-4">No upcoming events</p>
              <Link to="/events">
                <Button variant="primary" size="sm">Find Events</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card variant="luxury" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">📋 Recent Orders</h2>
            <Link 
              to="/customer/orders" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {ordersLoading ? (
            <InlineLoading text="Loading orders..." />
          ) : recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.slice(0, 3).map((order: CustomerOrder) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total_amount}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="luxury" className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/events">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium text-gray-900">Browse Events</div>
              <div className="text-sm text-gray-500">Discover new events</div>
            </div>
          </Link>

          <Link to="/customer/tickets">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-2xl mb-2">🎫</div>
              <div className="font-medium text-gray-900">My Tickets</div>
              <div className="text-sm text-gray-500">View your tickets</div>
            </div>
          </Link>

          <Link to="/customer/wishlist">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-2xl mb-2">❤️</div>
              <div className="font-medium text-gray-900">Wishlist</div>
              <div className="text-sm text-gray-500">Saved events</div>
            </div>
          </Link>

          <Link to="/customer/profile">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium text-gray-900">Profile</div>
              <div className="text-sm text-gray-500">Account settings</div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};