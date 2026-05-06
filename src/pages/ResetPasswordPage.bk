import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/auth/supabaseClient";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false); // si la sesión de recuperación está lista
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    // Escuchar eventos de auth: si el usuario llega con link de recuperación
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true); // el cliente está en modo recovery y puede actualizar la contraseña
      }
    });

    // También verificar si ya existe una sesión activa
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        // Si ya hay session probablemente es PASSWORD_RECOVERY o normal
        setReady(true);
      }
    }).catch(() => { /* no hacer nada */ });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) { setMsg("Link inválido o expirado."); return; }
    if (password.length < 6) { setMsg("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== confirm) { setMsg("Las contraseñas no coinciden."); return; }

    setLoading(true);
    setMsg(null);

    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg("Contraseña actualizada. Redirigiendo al inicio...");
      setTimeout(() => nav("/login"), 1400);
    } catch (err: any) {
      console.error("updateUser error:", err);
      setMsg("No se pudo actualizar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Restablecer contraseña</h2>

      {!ready ? (
        <p className="text-sm text-gray-600">
          Para restablecer la contraseña, usa el enlace que recibiste por email. Si el enlace expiró, vuelve a pedir reiniciar contraseña.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Repetir contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
          {msg && <p className="text-sm text-center mt-2 text-gray-700">{msg}</p>}
        </form>
      )}
    </div>
  );
}
