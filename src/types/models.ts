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
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  event_type: 'physical' | 'virtual';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  start_date: string;
  end_date: string;
  venue_name?: string;
  venue_address?: string;
  virtual_link?: string;
  cover_image?: string;
  min_age?: number;
  max_age?: number;
}

export type UserRole = 'customer' | 'organizer' | 'admin' | 'scan-point';