import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/DashboardPage";
import MedicamentoFormPage from "@/pages/MedicamentoFormPage";
import MedicamentosPage from "@/pages/MedicamentosPage";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/medicamentos",
    element: (
      <PrivateRoute>
        <MedicamentoFormPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/medicamentos/:medId",
    element: (
      <PrivateRoute>
        <MedicamentoFormPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/mis-medicamentos",
    element: (
      <PrivateRoute>
        <MedicamentosPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

export default router;
