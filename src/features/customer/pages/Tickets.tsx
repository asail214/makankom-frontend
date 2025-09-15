import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCustomerTickets } from '../../tickets/api';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';

interface CustomerTicket {
  id: number;
  ticket_number: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  created_at: string;
  event: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    venue_name?: string;
    event_type: 'physical' | 'virtual';
  };
  ticket_type: {
    id: number;
    name: string;
    price: number;
    currency: string;
  };
  order: {
    id: number;
    order_number: string;
  };
}

export const CustomerTickets: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['customer-tickets', filter],
    queryFn: () => fetchCustomerTickets({ 
      status: filter === 'all' ? undefined : filter 
    }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'used': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <InlineLoading text="Loading your tickets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card variant="luxury" className="p-6 text-center">
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-error-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Tickets</h3>
          <p className="text-gray-600">There was an error loading your tickets. Please try again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <Link to="/events">
          <Button variant="primary">Browse Events</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card variant="luxury" className="p-4">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Tickets' },
            { key: 'active', label: 'Active' },
            { key: 'used', label: 'Used' },
            { key: 'expired', label: 'Expired' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tickets List */}
      {tickets && tickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket: CustomerTicket) => (
            <Card key={ticket.id} variant="luxury" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ticket.event.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span>📅</span>
                      <span>{formatDate(ticket.event.start_date)}</span>
                    </div>
                    
                    {ticket.event.venue_name && (
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{ticket.event.venue_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <span>🎫</span>
                      <span>{ticket.ticket_type.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span>💰</span>
                      <span>{ticket.ticket_type.currency} {ticket.ticket_type.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2">
                    Ticket #{ticket.ticket_number}
                  </div>
                  <div className="text-xs text-gray-400">
                    Order #{ticket.order.order_number}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Purchased on {new Date(ticket.created_at).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-3">
                  <Link to={`/events/${ticket.event.id}`}>
                    <Button variant="ghost" size="sm">
                      View Event
                    </Button>
                  </Link>
                  
                  {ticket.status === 'active' && (
                    <Button variant="primary" size="sm">
                      Show Ticket
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="luxury" className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-400 text-3xl">🎫</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No Tickets Found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't purchased any tickets yet." 
              : `No ${filter} tickets found.`
            }
          </p>
          <Link to="/events">
            <Button variant="primary">Discover Events</Button>
          </Link>
        </Card>
      )}
    </div>
  );
};