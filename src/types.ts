export interface User {
  name: string;
  image: string;
  wishlistLink: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Supabase Database Types
export interface Profile {
  id: string;
  name: string;
  wishlist_link: string | null;
  image_url: string | null;
  claimed_by: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserApproval {
  id: string;
  user_id: string;
  email: string;
  requested_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

