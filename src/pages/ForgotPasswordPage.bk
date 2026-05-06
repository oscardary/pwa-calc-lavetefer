// src/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { supabase } from "@/lib/auth/supabaseClient"; // ajusta import si tienes otro path
import { Input } from "@/components/ui/input"; // o el input que uses

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      // Nota: no revelar si el email existe — mostrar mensaje genérico por seguridad
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_APP_SITE_URL}/reset-password`,
      });

      setMsg(
        "Si existe una cuenta con ese correo, recibirás un email con instrucciones para restablecer la contraseña."
      );
    } catch (err: any) {
      // Mostrar mensaje genérico (no leaks). También loguear internamente si quieres.
      setMsg(
        "Si existe una cuenta con ese correo, recibirás un email con instrucciones para restablecer la contraseña."
      );
      console.error("resetPassword error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Restablecer contraseña</h2>
      <p className="text-sm text-gray-500 mb-4">
        Ingresa tu correo y te enviaremos un enlace para restablecer la contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar email de recuperación"}
        </button>

        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
      </form>
    </div>
  );
}
