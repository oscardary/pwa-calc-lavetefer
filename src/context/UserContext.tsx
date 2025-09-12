import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../lib/auth/supabaseClient";

interface User {
  id: string;
  email: string | null;
  nick: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Intentar recuperar usuario del localStorage al iniciar la app
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Escuchar cambios de sesión de Supabase
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = { id: session.user.id, email: session.user.email ?? null, nick: (session.user.email)?.split("@")[0] ?? null};
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de un UserProvider");
  return context;
};
