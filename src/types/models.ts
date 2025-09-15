export interface User {
  id: number;
  email: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Customer extends User {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  phone?: string;
}

export interface Organizer extends User {
  name: string;
  type: 'individual' | 'company' | 'government' | 'ngo';
  profile_img_url?: string;
  cr_number?: string;
  phone?: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Updated Event interface with missing properties
export interface Event {
  id: number;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  event_type: 'physical' | 'virtual';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  start_date: string;
  end_date: string;
  venue_name?: string;
  venue_address?: string;
  virtual_link?: string;
  location_link?: string; // Add this missing property
  banner_image?: string;
  min_age?: number;
  max_age?: number;
  slug?: string;
  organizer_id?: number;
  category_id?: number;
  brand_id?: number;
  // Additional fields that might come from backend
  created_at?: string;
  updated_at?: string;
  organizer?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    name_ar?: string;
  };
}

export type UserRole = 'customer' | 'organizer' | 'admin' | 'scan-point';

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}