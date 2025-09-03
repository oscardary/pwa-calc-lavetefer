import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/auth/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error recuperando la sesión:", error.message);
        navigate("/login");
        return;
      }

      if (session) {
        console.log("Usuario autenticado:", session.user);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-700 text-lg">Procesando tu inicio de sesión...</p>
    </div>
  );
}
