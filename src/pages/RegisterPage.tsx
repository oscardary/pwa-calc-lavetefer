import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";
import InputLabelFloating from "@/components/InputLabelFloating";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Crear cuenta</h1>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            signUp(email, password).then(() => nav("/"));
          }}
        >
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
          <button className="w-full rounded-xl py-2 bg-blue-600 text-white">
            Crear cuenta
          </button>
        </form>
        <p className="text-sm mt-3 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-blue-600">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
