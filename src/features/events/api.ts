import api from '../../shared/api/api';

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

export async function fetchEvents(params: EventsParams = {}) {
  const { data } = await api.get('/events', { params });
  return {
    items: data.data,
    meta: data.meta, // {current_page, per_page, total, last_page}
  };
}

export async function fetchEvent(id: number | string) {
  const { data } = await api.get(`/events/${id}`);
  return data.data ?? data;
}
