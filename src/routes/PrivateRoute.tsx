import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
//import Dashboard from "@/pages/DashboardPage";
import MedicamentoFormPage from "@/pages/MedicamentoFormPage";
import MedicamentoPage from "@/pages/MedicamentoPage";
import ListaPage from "@/pages/ListaPage";
import ListaFormPage from "@/pages/ListaFormPage";
import CalculadoraPage from "@/pages/CalculadoraPage";
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
        <MedicamentoPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/listas",
    element: (
      <PrivateRoute>
        <ListaFormPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/listas/:listaId",
    element: (
      <PrivateRoute>
        <ListaFormPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/mis-listas",
    element: (
      <PrivateRoute>
        <ListaPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/calculadora",
    element: (
      <PrivateRoute>
        <CalculadoraPage />
      </PrivateRoute>
    ),
  },
]);

export default router;
