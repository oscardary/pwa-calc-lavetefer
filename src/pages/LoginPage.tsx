// src/pages/LoginPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";
import InputLabelFloating from "@/components/InputLabelFloating";

export default function LoginPage() {
  const { sendOtp, verifyOtp, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [step, setStep] = useState<"email" | "otp">("email");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const codeInputRef = useRef<HTMLInputElement>(null);

  // Si ya existe una sesión, entrar directamente
  useEffect(() => {
    if (!loading && user) {
      navigate("/calculadora");
    }
  }, [user, loading, navigate]);

  // Temporizador para reenviar código
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  // Enviar primer código
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await sendOtp(normalizedEmail);

      setEmail(normalizedEmail);
      setCode("");
      setStep("otp");

      setMessage(
        `Te enviamos un código de 8 dígitos a ${normalizedEmail}.`
      );

      setResendCountdown(60);

      // Dar tiempo a React para cambiar de vista
      // antes de enfocar el campo.
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      console.error("Error enviando OTP:", err);
      setError(err?.message ?? "No pudimos enviar el código.");
    } finally {
      setBusy(false);
    }
  };

  // Verificar código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 8) {
      setError("Ingresa el código completo de 8 dígitos.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await verifyOtp(email, code);

      // No necesitamos navegar manualmente aquí.
      // useAuth detectará la sesión y el useEffect
      // superior nos llevará a /calculadora.
    } catch (err: any) {
      console.error("Error verificando OTP:", err);

      setError(
        "El código no es correcto o ya expiró. Verifica el código e inténtalo nuevamente."
      );

      setCode("");
      codeInputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  // Reenviar código
  const handleResend = async () => {
    if (resendCountdown > 0 || busy) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await sendOtp(email);

      setMessage("Hemos enviado un nuevo código a tu correo.");
      setCode("");
      setResendCountdown(60);

      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      console.error("Error reenviando OTP:", err);
      setError(err?.message ?? "No pudimos reenviar el código.");
    } finally {
      setBusy(false);
    }
  };

  // Volver a introducir otro correo
  const handleChangeEmail = () => {
    setStep("email");
    setCode("");
    setError(null);
    setMessage(null);
    setResendCountdown(0);
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Acceder
            </h1>

            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu correo y te enviaremos un código de acceso.
            </p>

            <form onSubmit={handleSendCode} className="space-y-3">
              <InputLabelFloating
                id="Email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
                className="w-full rounded-xl py-2 bg-blue-600 text-white disabled:opacity-50"
                type="submit"
                disabled={busy}
              >
                {busy ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Verifica tu correo
            </h1>

            <p className="text-sm text-gray-600 mb-4">
              Ingresa el código de 8 dígitos que enviamos a:
            </p>

            <p className="text-sm font-medium text-gray-800 mb-4 break-all">
              {email}
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código de acceso
                </label>

                <input
                  ref={codeInputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8);

                    setCode(value);
                    setError(null);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();

                    const pasted = e.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 8);

                    setCode(pasted);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="00000000"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-sm text-green-600">
                  {message}
                </p>
              )}

              <button
                className="w-full rounded-xl py-2 bg-blue-600 text-white disabled:opacity-50"
                type="submit"
                disabled={busy || code.length !== 8}
              >
                {busy ? "Verificando..." : "Verificar código"}
              </button>
            </form>

            <div className="text-center mt-4 space-y-2">
              {resendCountdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Puedes solicitar otro código en{" "}
                  <span className="font-medium">
                    {resendCountdown}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={busy}
                  className="text-sm text-blue-600 disabled:opacity-50"
                >
                  Reenviar código
                </button>
              )}

              <button
                type="button"
                onClick={handleChangeEmail}
                className="block w-full text-sm text-gray-600 hover:text-gray-800"
              >
                ← Cambiar correo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}