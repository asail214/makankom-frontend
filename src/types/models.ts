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

export interface Event {
  id: number;
  title: string;           // Changed from title_en
  title_ar?: string;
  description: string;     // Changed from description_en
  description_ar?: string;
  event_type: 'physical' | 'virtual';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  start_date: string;
  end_date: string;
  venue_name?: string;
  venue_address?: string;
  virtual_link?: string;
  banner_image?: string;
  min_age?: number;
  max_age?: number;
  slug?: string;
  organizer_id?: number;
  category_id?: number;
  brand_id?: number;
}

export type UserRole = 'customer' | 'organizer' | 'admin' | 'scan-point';