// src/lib/auth/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type User = { id: string; email: string } | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1) Recuperar sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(
        data.session?.user
          ? { id: data.session.user.id, email: data.session.user.email! }
          : null
      );
      setLoading(false);
    });

    // 2) Escuchar cambios en la sesión (LOGIN / LOGOUT)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // signIn: lanza error si falla -> usar try/catch en la UI
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // normalmente `onAuthStateChange` actualizará `user`
    return;
  }

  // signUp: indicamos emailRedirectTo para que el link apunte a /auth/callback
  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    // el usuario deberá confirmar por email (supabase enviará el correo)
    return;
  }

  // singOut: Cerrar sesión y dirigir al login
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
