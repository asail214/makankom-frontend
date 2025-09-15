import api from '../../shared/api/api';

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  max_quantity_per_order: number;
  total_quantity: number;
  sold_quantity: number;
  available_quantity: number;
  sale_start_date: string;
  sale_end_date: string;
  is_active: boolean;
}

export interface BookingData {
  event_id: number;
  tickets: Array<{
    ticket_type_id: number;
    quantity: number;
  }>;
  customer_info?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface BookingResponse {
  order: {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_url?: string;
  };
  tickets: Array<{
    id: number;
    ticket_number: string;
    status: string;
  }>;
}

export const fetchEventTicketTypes = async (eventId: number): Promise<TicketType[]> => {
  const { data } = await api.get(`/events/${eventId}/ticket-types`);
  return data.data || data;
};

export const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
  const { data } = await api.post('/bookings', bookingData);
  return data.data || data;
};

export const fetchCustomerTickets = async (params?: { status?: string; page?: number }) => {
  const { data } = await api.get('/customer/tickets', { params });
  return data.data || data;
};

export const fetchCustomerOrders = async (params?: { status?: string; page?: number }) => {
  const { data } = await api.get('/customer/orders', { params });
  return data.data || data;
};