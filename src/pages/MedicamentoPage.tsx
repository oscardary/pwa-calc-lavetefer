// src/pages/MedicamentosPage.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { medicamentosLocalRepo } from "../repositories/local/MedicamentosLocalRepo";
import { iMedicamentoId } from "../domain/types/index";
import { Info, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function MedicamentosPage() {
  const { user } = useUser();
  const [medicamentos, setMedicamentos] = useState<iMedicamentoId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      if (!user) return; // Si no hay usuario, no hacer nada
      setLoading(true);
      const repo = medicamentosLocalRepo(); // <-- crear instancia del repo
      const meds = await repo.obtenerTodos(user.id); // <-- usar el método del repo
      setMedicamentos(meds);
      setLoading(false);
    };
    fetchMedicamentos();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">
          Debes iniciar sesión para ver tus medicamentos
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">Cargando tus medicamentos...</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar />
      <div className="max-w-2xl mx-auto p-2 pb-20">
        <h1 className="relative text-xl font-bold text-center mb-4">
          Mis Medicamentos
        </h1>

        <div className="max-w-2xl mx-auto p-2 space-y-3">
          {medicamentos.map((med) => (
            <Link
              key={med.id}
              to={`/medicamentos/${med.id}`}
              className="block bg-white rounded-lg shadow p-4 border hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-gray-800">
                {med.nombre} - {med.presentacion}
              </h2>
              <p className="text-sm text-gray-500">
                Posología: {med.posologiaValor} {med.posologiaUnidad} |
                Concentración: {med.concentracionValor}{" "}
                {med.concentracionUnidad}
              </p>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600">{med.comentario}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón flotante para añadir */}
        <Link
          to="/medicamentos/new"
          className="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          <Plus className="w-7 h-7" />
        </Link>
      </div>
      <BottomNav />
    </div>
  );
}
