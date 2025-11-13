import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthUser } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, requestedName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple' | 'azure') => Promise<void>;
  isAdmin: boolean;
  userProfile: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'mikenike360@outlook.com';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.email || '');
        setUserProfile({
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.email || '');
        setUserProfile({
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        });
      } else {
        setIsAdmin(false);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = (email: string) => {
    setIsAdmin(email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, requestedName: string) => {
    // First, sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // If signup successful, create an approval request using database function
    if (data.user) {
      // Use a database function to bypass RLS since user might not be fully authenticated yet
      const { error: approvalError } = await supabase.rpc(
        'create_approval_request',
        {
          p_user_id: data.user.id,
          p_email: email,
          p_requested_name: requestedName,
        }
      );

      if (approvalError) {
        console.error('Error creating approval request:', approvalError);
        console.error('Approval error details:', JSON.stringify(approvalError, null, 2));
        // Try fallback: direct insert (might work if email confirmation is disabled)
        const { error: fallbackError } = await supabase
          .from('user_approvals')
          .insert({
            user_id: data.user.id,
            email: email,
            requested_name: requestedName,
            status: 'pending',
          });

        if (fallbackError) {
          console.error('Fallback insert also failed:', fallbackError);
          return { 
            error: {
              message: `Account created but failed to create approval request. Error: ${fallbackError.message}. Please contact admin.`,
              name: 'ApprovalError',
            } as AuthError
          };
        }
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setUserProfile(null);
  };

  const signInWithProvider = async (provider: 'google' | 'apple' | 'azure') => {
    const providerMap = {
      google: 'google',
      apple: 'apple',
      azure: 'azure',
    };

    await supabase.auth.signInWithOAuth({
      provider: providerMap[provider] as 'google' | 'apple' | 'azure',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    isAdmin,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

