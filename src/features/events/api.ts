import api from '../../shared/api/api';
import type {Event} from '../../types/models';

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
  sort?: 'start_date' | '-start_date' | 'title' | 'price';
};

export interface EventsResponse {
  items: Event[];
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
    
    // Handle different possible response structures
    let events: Event[] = [];
    let meta = {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };

    // Case 1: Laravel paginated response
    if (data.data && Array.isArray(data.data)) {
      events = data.data;
      meta = data.meta || meta;
    }
    // Case 2: Direct array response
    else if (Array.isArray(data)) {
      events = data;
      meta.total = data.length;
    }
    // Case 3: Nested data structure
    else if (data.events && Array.isArray(data.events)) {
      events = data.events;
    }
    // Case 4: Response has items property
    else if (data.items && Array.isArray(data.items)) {
      events = data.items;
      meta = data.meta || meta;
    }
    else {
      console.warn('Unexpected API response structure:', data);
      events = [];
    }

    console.log('Processed events:', events);
    console.log('Events count:', events.length);

    return {
      items: events,
      meta,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    
    // Return empty result on error
    return {
      items: [],
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
    if (data.data) {
      return data.data;
    } else if (data.event) {
      return data.event;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}