import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";
import InputLabelFloating from "@/components/InputLabelFloating";

export default function LoginPage() {
  const { sendMagicLink, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Si ya hay usuario, saltar al dashboard
    if (!loading && user) navigate("/calculadora");
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await sendMagicLink(email);

      setMessage(
        "📩 Revisa tu correo y haz clic en el enlace para acceder."
      );
      setEmail("");
    } catch (err: any) {
      setError(err?.message ?? "Error enviando el correo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Acceder</h1>
        <p className="text-sm text-gray-600 mb-4">
          Ingresa tu correo y te enviaremos un enlace
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputLabelFloating
            id="Email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}

          <button
            className="w-full rounded-xl py-2 bg-blue-600 text-white"
            type="submit"
            disabled={busy}
          >
            {busy ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      </div>
    </div>
  );
}