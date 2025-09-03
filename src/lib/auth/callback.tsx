// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/auth/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handle = async () => {
      try {
        // 1) Si ya hay sesión, redirigimos
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          navigate("/dashboard");
          return;
        }

        // 2) Intercambiamos el código en la URL por una sesión (magic link / confirm)
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError) {
          console.error("Error intercambiando código:", exchangeError.message);
          setErrorMsg("No pudimos validar tu enlace. Intenta iniciar sesión manualmente.");
          return;
        }

        // Si se creó la sesión, onAuthStateChange la actualizará y podemos navegar
        navigate("/dashboard");
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Error al procesar el enlace. Intenta iniciar sesión.");
      } finally {
        setLoading(false);
      }
    };

    handle();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded-lg shadow">
        {loading && <p>Procesando confirmación…</p>}
        {!loading && errorMsg && (
          <>
            <h1 className="text-red-600 font-bold mb-2">¡Ups!</h1>
            <p>{errorMsg}</p>
            <button className="mt-4 px-3 py-2 bg-blue-600 text-white rounded" onClick={() => navigate("/login")}>
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
