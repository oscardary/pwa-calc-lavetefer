import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  // Mientras verificamos la sesión, mostramos un loader simple
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, redirigimos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión, mostramos la página protegida
  return children;
}
