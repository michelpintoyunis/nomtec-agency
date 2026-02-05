import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing. The app will not work correctly.');
}

let supabaseInstance;

try {
    // If keys are empty strings, createClient might throw or create an invalid client.
    // We'll trust it if it's not empty, otherwise fallback immediately.
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing Credentials");

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    // Fallback mock to prevent white screen crash
    supabaseInstance = {
        from: () => ({
            insert: async () => ({ error: { message: "Supabase not configured properly" } }),
            select: async () => ({ data: [], error: { message: "Supabase not configured properly" } })
        }),
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: "Supabase not configured properly" } }),
            signOut: async () => ({ error: null })
        }
    } as any;
}

export const supabase = supabaseInstance;
