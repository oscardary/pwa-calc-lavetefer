import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/auth/supabaseClient";
import { useUser } from "../context/UserContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error recuperando la sesión:", error.message);
        navigate("/login");
        return;
      }

      if (session?.user) {
        const u = { 
          id: session.user.id, 
          email: session.user.email ?? null,
          nick: (session.user.email)?.split("@")[0] ?? null,
        };
        setUser(u); // guardar en contexto
        localStorage.setItem("user", JSON.stringify(u)); // respaldo
        console.log("Usuario autenticado:", session.user);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-700 text-lg">Procesando tu inicio de sesión...</p>
    </div>
  );
}
