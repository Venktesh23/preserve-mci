import { useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';
import { AuthContext, User } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Keep callback synchronous; run async work in microtask to avoid auth deadlocks.
      void (async () => {
        if (!isMounted) {
          return;
        }

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const data = await authAPI.getCurrentUser();
          if (isMounted) {
            setUser(data.user);
          }
        } catch {
          if (isMounted) {
            setUser(null);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signin(email: string, password: string, showToast = true): Promise<User> {
    try {
      const data = await authAPI.signin(email, password);
      setUser(data.user);
      if (showToast) {
        toast.success('Signed in successfully!');
      }
      return data.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  }

  async function signup(
    email: string,
    password: string,
    name: string,
    role: User['role'],
    mobile_number: string
  ): Promise<User> {
    try {
      await authAPI.signup(email, password, name, role, mobile_number);

      // After signup, automatically sign in
      const signedInUser = await signin(email, password, false);
      
      toast.success('Account created successfully!');
      return signedInUser;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  }

  async function signout(showToast = true) {
    try {
      await authAPI.signout();
      setUser(null);
      if (showToast) {
        toast.success('Signed out successfully');
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Still clear the user state even if API call fails
      setUser(null);
      // Don't show error toast - signout should always succeed from user perspective
      if (showToast) {
        toast.success('Signed out successfully');
      }
    }
  }

  async function refreshUser() {
    try {
      const data = await authAPI.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }

  async function updateUser(updates: Partial<User>) {
    try {
      const data = await authAPI.updateUser(updates);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return data.user;
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signin, signup, signout, refreshUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}