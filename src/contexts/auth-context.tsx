
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, Session, User, SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

// Check if environment variables are defined
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a placeholder client for when credentials are missing
let supabase: SupabaseClient;

try {
  if (!SUPABASE_URL) {
    throw new Error('Missing environment variable: VITE_SUPABASE_URL');
  }
  
  if (!SUPABASE_ANON_KEY) {
    throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
  }
  
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.error('Supabase initialization error:', error);
  // Create a mock client that will show friendly errors instead of crashing
  const mockMethods = {
    from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.reject(error) }) }) }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.reject(error),
      signInWithPassword: () => Promise.reject(error),
      signInWithOAuth: () => Promise.reject(error),
      signOut: () => Promise.reject(error),
    },
  };
  
  // @ts-ignore - Creating a mock client
  supabase = mockMethods;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error: any) {
        console.error('Error getting session:', error);
        if (error.message?.includes('VITE_SUPABASE')) {
          toast.error('Supabase credentials are missing. Please configure your environment variables.');
        } else {
          toast.error('Error loading user session');
        }
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
      return () => {};
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      toast.success('Registration successful! Please check your email to confirm your account.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error during sign up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error during sign in');
      throw error;
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      toast.error(error.message || `Error signing in with ${provider}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        supabase,
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
