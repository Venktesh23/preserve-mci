import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'care_partner' | 'clinician';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: User['role']) => Promise<User>;
  signout: (showToast?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
