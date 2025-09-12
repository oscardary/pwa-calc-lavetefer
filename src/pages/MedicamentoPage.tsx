// src/pages/MedicamentosPage.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { medicamentosLocalRepo } from "../repositories/local/MedicamentosLocalRepo";
import { iMedicamentoId } from "../domain/types/index";
import { Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";


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
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Medicamentos</h1>

        <div className="space-y-3">
          {medicamentos.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between bg-white rounded-lg shadow p-4 border"
            >
              <div>
                <h2 className="font-semibold text-gray-800">
                  {med.nombre} {med.presentacion}
                </h2>
                <p className="text-sm text-gray-500">
                  {med.posologiaValor} {med.posologiaUnidad} ·{" "}
                  {med.concentracionValor} {med.concentracionUnidad}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Icono favorito (puedes conectar al estado luego) */}
                {/*med.id ? (
                  <Heart className="text-green-500" size={24} />
                ) : (
                  <HeartOff className="text-gray-400" size={24} />
                )*/}

                {/* Botón de editar */}
                <Link
                  to={`/medicamentos/${med.id}`}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  <Edit size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Botón flotante para añadir */}
        <Link
          to="/medicamentos/new"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-green-700 transition"
        >
          <Plus size={28} />
        </Link>
      </div>
    </div>
  );
}
