// src/pages/ListaPage.tsx
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { iLista } from "@/domain/types/index";
import { useNavigate } from "react-router-dom";
import ListaNuevaModal from "@/components/ListaNuevaModal";
import TopBar from "@/components/TopBar";
import { useLists } from "@/hooks/useLists";

export default function ListaPage() {
  const { user } = useUser();
  const { listas, saveList, reload } = useLists(); // 👈 usamos el hook
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">
          Debes iniciar sesión para ver tus listas
        </p>
      </div>
    );
  }

  // 👇 esta es tu función handleCreate
  const handleCreate = async (nombre: string, descripcion: string) => {
    const nuevaLista: iLista = { nombre, descripcion };
    await saveList(nuevaLista as any); // saveList se encarga de insertar
    setShowModal(false);
    await reload(); // refresca listas
  };

  return (
    <div>
      <TopBar />
      <div className="p-4 relative">
        <h1 className="text-2xl font-bold mb-4">Mis Listas</h1>

        <div className="grid gap-4">
          {listas.map((lista) => (
            <div
              key={lista.id}
              className="p-4 rounded-2xl shadow hover:shadow-md bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{lista.nombre}</h2>
                <p className="text-gray-500 text-sm">{lista.descripcion}</p>
              </div>
              <button
                onClick={() => navigate(`/listas/${lista.id}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>

        {/* Botón flotante */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          ➕
        </button>

        {/* Modal */}
        <ListaNuevaModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
