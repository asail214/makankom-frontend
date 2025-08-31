import { createContext } from 'react';
import type { UserRole, Customer, Organizer } from '../../../types/models';

// Define a union type instead of 'any'
export type AuthUser = Customer | Organizer | {
  id: number;
  email: string;
  name: string;
  [key: string]: unknown;
};

export interface AuthContextType {
  user: AuthUser | null;
  userType: UserRole | null;
  token: string | null;
  login: (userData: AuthUser, userType: UserRole, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);