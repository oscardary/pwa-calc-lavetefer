// src/pages/ListaPage.tsx
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { iListaId } from "@/domain/types/index";
import { useNavigate } from "react-router-dom";
import ListaNuevaModal from "@/components/ListaNuevaModal";
import TopBar from "@/components/TopBar";
import { useLists } from "@/hooks/useListas";
import BottomNav from "@/components/BottomNav";
import { Edit, Plus } from "lucide-react";

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

  // esta es tu función handleCreate
  const handleCreate = async (lista: iListaId) => {
    await saveList(lista); // saveList se encarga de insertar
    setShowModal(false);
    await reload(); // refresca listas
  };

  return (
    <div>
      <TopBar />
      <div className="max-w-2xl mx-auto p-2 pb-20">
        <h1 className="text-xl font-bold text-center mb-4">Mis Listas</h1>

        {/* Tarjetas de listas */}
        <div className="max-w-2xl mx-auto p-2 space-y-3">
          {listas.map((lista) => (
            <div
              key={lista.id}
              onClick={() => navigate(`/listas/${lista.id}`)}
              className="block bg-white rounded-lg shadow p-4 border hover:bg-gray-50 transition cursor-pointer"
            >
              <h2 className="font-semibold text-gray-800">{lista.nombre}</h2>
              <p className="text-sm text-gray-500">{lista.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Botón flotante */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          <Plus className="w-7 h-7" />
        </button>

        {/* Modal */}
        <ListaNuevaModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      </div>
      <BottomNav />
    </div>
  );
}

/**
Perfecto 👌, así lo dejamos entonces:

MedicamentosPage → cards con flex, borde, sombreado y un layout más “fila”.

ListaPage → cards con estilo más limpio tipo “bloque completo cliqueable”.

Cuando tu cliente te diga cuál prefiere, unificamos estilos y ajustamos el CSS en todas las páginas ✅.
 */
