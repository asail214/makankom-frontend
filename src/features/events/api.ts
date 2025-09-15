import api from '../../shared/api/api';
import type { Event } from '../../types/models';

export type EventsParams = {
  page?: number;
  q?: string;
  category_id?: number;
  city?: string;
  status?: string;
  from?: string; // ISO
  to?: string;   // ISO
  price_min?: number;
  price_max?: number;
  sort?: string; // Change this to be more flexible
  event_type?: 'physical' | 'virtual';
};

export interface EventsResponse {
  data: Event[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchEvents(params: EventsParams = {}): Promise<EventsResponse> {
  try {
    console.log('Fetching events with params:', params);
    
    const { data } = await api.get('/events', { params });
    
    console.log('Raw API response:', data);
    
    // Handle Laravel paginated response structure
    if (data.success !== false && data.data && Array.isArray(data.data)) {
      return {
        data: data.data,
        meta: data.meta || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: data.data.length,
        },
      };
    }
    
    // Handle direct array response
    if (Array.isArray(data)) {
      return {
        data: data,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: data.length,
          total: data.length,
        },
      };
    }

    // Handle successful response with items
    if (data.success && data.data) {
      const events = Array.isArray(data.data) ? data.data : [];
      return {
        data: events,
        meta: data.meta || {
          current_page: 1,
          last_page: 1,
          per_page: events.length,
          total: events.length,
        },
      };
    }

    console.warn('Unexpected API response structure:', data);
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Return empty result on error
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      },
    };
  }
}

export async function fetchEvent(id: number | string): Promise<Event | null> {
  try {
    const { data } = await api.get(`/events/${id}`);
    
    // Handle different response structures
    if (data.success && data.data) {
      return data.data;
    } else if (data.event) {
      return data.event;
    } else if (data.id) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function fetchEventCategories() {
  try {
    const { data } = await api.get('/event-categories');
    
    if (data.success && data.data) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}