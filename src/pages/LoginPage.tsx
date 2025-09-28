import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";
import InputLabelFloating from "@/components/InputLabelFloating";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    try {
      await signIn(email, password); // si falla, lanza y cae al catch
      // onAuthStateChange actualizará user -> useEffect redirige
    } catch (err: any) {
      setError(err?.message ?? "Error al iniciar sesión");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Iniciar sesión</h1>
        <p className="text-sm text-gray-600 mb-4">Bienvenido de nuevo</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputLabelFloating
            id="Email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputLabelFloating
            id="Password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-full rounded-xl py-2 bg-blue-600 text-white"
            type="submit"
            disabled={busy}
          >
            {busy ? "Ingresando..." : "Entrar"}
          </button>
        </form>
        <p className="text-sm mt-3 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600">
            Regístrate
          </Link>
        </p>
        <p className="text-sm mt-3 text-center">
          <Link to="/register" className="text-blue-600">
          Si olvidaste tu contraseña, avisanos.
          </Link>
        </p>
      </div>
    </div>
  );
}
