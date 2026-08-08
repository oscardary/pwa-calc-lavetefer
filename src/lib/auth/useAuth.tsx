// src/lib/auth/useAuth.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type User = {
  id: string;
  email: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Recuperar sesión existente
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("Error recuperando sesión:", error.message);
        setUser(null);
      } else {
        setUser(
          data.session?.user
            ? {
                id: data.session.user.id,
                email: data.session.user.email ?? "",
              }
            : null
        );
      }

      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? "",
            }
          : null
      );
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Enviar código OTP al correo
  async function sendOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Dejamos que Supabase cree automáticamente
        // el usuario si todavía no existe.
        shouldCreateUser: true,
      },
    });

    if (error) {
      throw error;
    }
  }

  // Verificar código OTP
  async function verifyOtp(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      throw error;
    }

    // onAuthStateChange actualizará automáticamente user.
  }

  // Cerrar sesión
  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    }

    setUser(null);
  }

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        sendOtp,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}