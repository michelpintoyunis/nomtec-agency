
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check active sessions and sets the user using getUser to validate against DB
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    // If error (e.g. user deleted), ensure session is cleared
                    console.error("Auth validation error:", error);
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                } else {
                    const { data: { session } } = await supabase.auth.getSession();
                    setSession(session);
                    setUser(user);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                setSession(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const signInWithPassword = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut, signInWithPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
