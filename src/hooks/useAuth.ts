import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Session ကို အရင်စစ်မယ်
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Auth state ပြောင်းလဲမှုကို နားထောင်မယ်
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        window.location.href = '/auth'; // Clear state and redirect
      }
      return { error };
    } finally {
      setAuthLoading(false);
    }
  };

  // Profile Update အတွက် ကြိုတင်ပြင်ဆင်မှု (နောင်မှာသုံးရန်)
  const updateProfile = async (updates: any) => {
    return await supabase.auth.updateUser(updates);
  };

  return {
    user,
    session,
    loading,
    authLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile
  };
};
