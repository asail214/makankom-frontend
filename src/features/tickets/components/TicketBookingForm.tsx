import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { fetchEventTicketTypes, createBooking, type TicketType, type BookingData } from '../api';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';

interface TicketBookingFormProps {
  eventId: number;
  onBookingSuccess?: () => void;
}

interface SelectedTicket {
  ticket_type_id: number;
  quantity: number;
  price: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const TicketBookingForm: React.FC<TicketBookingFormProps> = ({
  eventId,
  onBookingSuccess
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: ticketTypes, isLoading } = useQuery({
    queryKey: ['event-ticket-types', eventId],
    queryFn: () => fetchEventTicketTypes(eventId),
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (response) => {
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      // Redirect to payment or success page
      if (response.order.payment_url) {
        window.location.href = response.order.payment_url;
      } else {
        navigate(`/customer/orders/${response.order.id}`);
      }
    },
    onError: (error: ApiError) => {
      if (error.response?.data?.errors) {
        const formattedErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          formattedErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Booking failed' });
      }
    },
  });

  const handleQuantityChange = (ticketType: TicketType, quantity: number) => {
    setSelectedTickets(prev => {
      const existing = prev.find(t => t.ticket_type_id === ticketType.id);
      
      if (quantity === 0) {
        return prev.filter(t => t.ticket_type_id !== ticketType.id);
      }
      
      const newTicket = {
        ticket_type_id: ticketType.id,
        quantity,
        price: ticketType.price
      };
      
      if (existing) {
        return prev.map(t => 
          t.ticket_type_id === ticketType.id ? newTicket : t
        );
      } else {
        return [...prev, newTicket];
      }
    });
  };

  const getQuantityForTicketType = (ticketTypeId: number): number => {
    const ticket = selectedTickets.find(t => t.ticket_type_id === ticketTypeId);
    return ticket ? ticket.quantity : 0;
  };

  const getTotalAmount = (): number => {
    return selectedTickets.reduce((total, ticket) => {
      return total + (ticket.quantity * ticket.price);
    }, 0);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (selectedTickets.length === 0) {
      setErrors({ general: 'Please select at least one ticket' });
      return;
    }

    const bookingData: BookingData = {
      event_id: eventId,
      tickets: selectedTickets.map(({ ticket_type_id, quantity }) => ({
        ticket_type_id,
        quantity
      }))
    };

    bookingMutation.mutate(bookingData);
  };

  if (isLoading) {
    return (
      <Card variant="luxury" className="p-6">
        <InlineLoading text="Loading ticket information..." />
      </Card>
    );
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <Card variant="luxury" className="p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-2xl">🎫</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Available</h3>
        <p className="text-gray-600">Tickets are not currently available for this event.</p>
      </Card>
    );
  }

  const totalAmount = getTotalAmount();
  const hasSelectedTickets = selectedTickets.length > 0;

  return (
    <Card variant="luxury" className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">🎫 Book Tickets</h3>

      {errors.general && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
          {errors.general}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {ticketTypes.map((ticketType) => {
          const quantity = getQuantityForTicketType(ticketType.id);
          const isAvailable = ticketType.available_quantity > 0 && ticketType.is_active;
          
          return (
            <div 
              key={ticketType.id} 
              className={`border rounded-lg p-4 ${
                isAvailable ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    isAvailable ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {ticketType.name}
                  </h4>
                  {ticketType.description && (
                    <p className={`text-sm ${
                      isAvailable ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {ticketType.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isAvailable ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {ticketType.currency} {ticketType.price.toFixed(2)}
                  </div>
                  <div className={`text-xs ${
                    isAvailable ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {ticketType.available_quantity} available
                  </div>
                </div>
              </div>

              {isAvailable ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Max {ticketType.max_quantity_per_order} per order
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(ticketType, Math.max(0, quantity - 1))}
                      disabled={quantity === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(ticketType, Math.min(ticketType.max_quantity_per_order, ticketType.available_quantity, quantity + 1))}
                      disabled={quantity >= ticketType.max_quantity_per_order || quantity >= ticketType.available_quantity}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 font-medium">
                    {ticketType.available_quantity === 0 ? 'Sold Out' : 'Not Available'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      {hasSelectedTickets && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
          <div className="space-y-2">
            {selectedTickets.map((ticket) => {
              const ticketType = ticketTypes.find(tt => tt.id === ticket.ticket_type_id);
              if (!ticketType) return null;
              
              return (
                <div key={ticket.ticket_type_id} className="flex justify-between text-sm">
                  <span>{ticketType.name} × {ticket.quantity}</span>
                  <span>{ticketType.currency} {(ticket.quantity * ticket.price).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {ticketTypes[0]?.currency} {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleBooking}
          variant="primary"
          className="w-full"
          size="lg"
          disabled={!hasSelectedTickets}
          loading={bookingMutation.isPending}
        >
          {!isAuthenticated 
            ? 'Sign In to Book Tickets' 
            : bookingMutation.isPending
            ? 'Processing...'
            : `Book Tickets - ${ticketTypes[0]?.currency} ${totalAmount.toFixed(2)}`
          }
        </Button>

        {!isAuthenticated && (
          <p className="text-sm text-gray-600 text-center">
            You need to sign in to book tickets for this event
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <span className="text-green-500 text-lg">🔒</span>
          <div>
            <h5 className="text-sm font-medium text-gray-900">Secure Booking</h5>
            <p className="text-xs text-gray-600 mt-1">
              Your payment information is processed securely. Tickets will be sent to your email after payment confirmation.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};