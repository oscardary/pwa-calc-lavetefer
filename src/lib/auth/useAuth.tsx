// src/lib/auth/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type User = { id: string; email: string } | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  sendMagicLink: async () => {},
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

    // 2) Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user
            ? { id: session.user.id, email: session.user.email! }
            : null
        );
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Enviar Magic Link (login + registro automático)
  async function sendMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }

  // 🚪 Cerrar sesión
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, sendMagicLink, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}