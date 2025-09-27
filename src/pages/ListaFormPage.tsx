// src/pages/ListaFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TopBar from "@/components/TopBar";
import ActionButtons from "@/components/ActionButtons";
import type { iListaId, iMedicamentoId } from "@/domain/types";
import { listasLocalRepo } from "@/repositories/local/ListasLocalRepo";
import { medicamentosLocalRepo } from "@/repositories/local/MedicamentosLocalRepo";
import { listaMedicamentoLocalRepo } from "@/repositories/local/ListaMedicamentoLocalRepo";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import ListaNuevaModal from "@/components/ListaNuevaModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function ListaFormPage() {
  const nav = useNavigate();
  const { user } = useUser();
  const { listaId } = useParams<{ listaId: string }>();
  const [lista, setLista] = useState<iListaId | null>(null);
  const [medicamentos, setMedicamentos] = useState<iMedicamentoId[]>([]);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const repoListaMedicamento = listaMedicamentoLocalRepo();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Cargar lista y medicamentos del usuario
  useEffect(() => {
    async function loadData() {
      if (!user) return; // Si no hay usuario, no hacer nada
      if (!listaId) return; // Si no hay lista, no hacer nada

      const repoListas = listasLocalRepo();
      const repoMeds = medicamentosLocalRepo();

      // 1. Obtener lista
      const listasUsuario = await repoListas.obtenerTodas(user.id);
      const listaActual = listasUsuario.find((l) => l.id === listaId) || null;
      setLista(listaActual);

      // 2. Obtener medicamentos del usuario
      const medsUsuario = await repoMeds.obtenerTodos(user.id);
      setMedicamentos(medsUsuario);

      // 3. Obtener medicamentos ya seleccionados en esta lista
      const relaciones = await repoListaMedicamento.obtenerPorLista(listaId);
      const medsEnLista = relaciones.map((rel) => rel.medicamentoId);
      setSeleccionados(new Set(medsEnLista));
    }
    loadData();
  }, [listaId, user]);

  // Manejo de selección
  function toggleSeleccion(id: string) {
    setSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  }

  // Guardar cambios en IndexedDB
  async function handleGuardar() {
    if (!listaId) return;

    // 1. Borramos todos los registros actuales de esa lista
    const actuales = await repoListaMedicamento.obtenerPorLista(listaId);
    for (const lm of actuales) {
      await repoListaMedicamento.eliminar(lm.listaId, lm.medicamentoId);
    }

    // 2. Insertamos los seleccionados
    for (const medId of seleccionados) {
      await repoListaMedicamento.insertar(listaId, medId);
    }

    //alert("Cambios guardados en IndexedDB ✅");
    nav(-1);
  }

  // Eliminar lista completa
  async function handleEliminarLista() {
    if (!lista || !listaId) return;

    const repoListas = listasLocalRepo();
    // 1. Eliminar relaciones de medicamentos
    await repoListaMedicamento.eliminarPorLista(lista.id);
    // 2. Eliminar la lista
    await repoListas.eliminarPorId(lista.id);
    // 3. Volver a la pantalla anterior
    nav(-1);
  }

  // Filtro simple
  const medicamentosFiltrados = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <TopBar />
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header con título + acciones */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Medicamentos de lista {lista?.nombre || "Lista sin nombre"}
          </h1>

          {lista && (
            <div className="flex items-center gap-2">
              {/* Botón editar */}
              <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Edit className="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </button>

              {/* Botón eliminar */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
              </button>
            </div>
          )}
        </div>

        {/* Descripción */}
        <p className="text-gray-500">{lista?.descripcion}</p>

        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <Input
            placeholder="Buscar medicamento..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* Lista de medicamentos */}
        <div className="space-y-2">
          {medicamentosFiltrados.map((med) => (
            <Card
              key={med.id}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSeleccion(med.id)}
            >
              <CardContent className="flex items-center justify-between w-full p-0">
                <div>
                  <p className="font-medium">{med.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {med.presentacion} · {med.concentracionValor}{" "}
                    {med.concentracionUnidad}
                  </p>
                </div>
                <Checkbox checked={seleccionados.has(med.id)} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón guardar */}
        <ActionButtons onSave={handleGuardar} />

        {/* Modal */}
        {showModal && lista && (
          <ListaNuevaModal
            isOpen={showModal}
            initialData={lista} // 👈 prellenar con nombre + descripcion
            onClose={() => setShowModal(false)}
            onSave={async (updatedLista) => {
              // Aquí llamas a tu repo para actualizar
              const repo = listasLocalRepo();
              await repo.actualizar(updatedLista);

              // Refrescar datos locales
              setLista(updatedLista);
              setShowModal(false);
            }}
          />
        )}

        {/* Modal eliminar lista */}
        {showDeleteModal && listaId && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleEliminarLista}
            title="Eliminar lista"
            message="¿Estás seguro de eliminar esta lista? Los medicamentos seguirán existiendo, pero se perderá la relación con esta lista."
          />
        )}
      </div>
    </div>
  );
}
