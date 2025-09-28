import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
//import Dashboard from "@/pages/DashboardPage";
import AuthCallback from "@/pages/AuthCallback";
import DebugAuth from "@/pages/DebugAuth";
import MedicamentoFormPage from "@/pages/MedicamentoFormPage";
import MedicamentoPage from "@/pages/MedicamentoPage";
import ListaPage from "@/pages/ListaPage";
import ListaFormPage from "@/pages/ListaFormPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import CalculadoraPage from "@/pages/CalculadoraPage";
import PrivateRoute from "@/components/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/debug-auth" element={<DebugAuth />} />
      
      <Route path="/medicamentos/:medId" element={<PrivateRoute><MedicamentoFormPage /></PrivateRoute>} />
      <Route path="/mis-medicamentos" element={<PrivateRoute><MedicamentoPage /></PrivateRoute>} />
      <Route path="/mis-listas" element={<PrivateRoute><ListaPage /></PrivateRoute>} />
      <Route path="/listas/:listaId" element={<PrivateRoute><ListaFormPage /></PrivateRoute>} />
      <Route path="/calculadora" element={<PrivateRoute><CalculadoraPage /></PrivateRoute>} />
    </Routes>
  );
}
