// src/routes/index.tsx

import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DebugAuth from "@/pages/DebugAuth";
import MedicamentoFormPage from "@/pages/MedicamentoFormPage";
import MedicamentoPage from "@/pages/MedicamentoPage";
import ListaPage from "@/pages/ListaPage";
import ListaFormPage from "@/pages/ListaFormPage";
import CalculadoraPage from "@/pages/CalculadoraPage";
import PrivateRoute from "@/components/PrivateRoute";
import InformacionPage from "@/pages/InformacionPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/debug-auth" element={<DebugAuth />} />

      <Route
        path="/medicamentos/:medId"
        element={
          <PrivateRoute>
            <MedicamentoFormPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/mis-medicamentos"
        element={
          <PrivateRoute>
            <MedicamentoPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/mis-listas"
        element={
          <PrivateRoute>
            <ListaPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/listas/:listaId"
        element={
          <PrivateRoute>
            <ListaFormPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/calculadora"
        element={
          <PrivateRoute>
            <CalculadoraPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/informacion"
        element={
          <PrivateRoute>
            <InformacionPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}