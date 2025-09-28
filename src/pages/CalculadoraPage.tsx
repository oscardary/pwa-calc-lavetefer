// src/pages/CalculadoraPage.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { ListCheck } from "lucide-react";
import { medicamentosLocalRepo } from "../repositories/local/MedicamentosLocalRepo";
import { listasLocalRepo } from "../repositories/local/ListasLocalRepo";
import { listaMedicamentoLocalRepo } from "@/repositories/local/ListaMedicamentoLocalRepo";
import { iMedicamentoId, iListaId, iListaMedicamento } from "../domain/types";

import { calcularDosis } from "@/lib/calculadora";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import InputPeso from "@/components/InputPeso";
import { SeleccionListaModal } from "@/components/SeleccionListaModal";
import { STORAGE_KEY } from "@/constants/storageKeys";

export default function CalculadoraPage() {
  const { user } = useUser();
  const [peso, setPeso] = useState<string>("");
  const [medicamentos, setMedicamentos] = useState<iMedicamentoId[]>([]);
  const [listas, setListas] = useState<iListaId[]>([]);
  const [selectedLista, setSelectedLista] = useState<iListaId | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Función para cargar medicamentos de una lista
  async function loadMedicamentosPorLista(listaId: string) {
    const repoListaMed = listaMedicamentoLocalRepo();
    const repoMeds = medicamentosLocalRepo();

    // 1. Relación lista-medicamentos (solo IDs)
    const listMeds = await repoListaMed.obtenerPorLista(listaId);

    // 2. Traer medicamentos completos
    const meds: iMedicamentoId[] = [];
    for (const itemMed of listMeds) {
      const med = await repoMeds.obtenerPorId(itemMed.medicamentoId);
      if (med) meds.push(med);
    }

    return meds;
  }

  // Cargar listas del usuario y respetar selección persistida
  useEffect(() => {
    async function loadListas() {
      if (!user) return;

      const repo = listasLocalRepo();
      const listas = await repo.obtenerTodas(user.id);
      setListas(listas);

      // Verificar si hay lista guardada en localStorage
      const savedId = localStorage.getItem(STORAGE_KEY.LISTA_SELECCIONADA);

      if (savedId) {
        const listaGuardada = listas.find((list) => list.id === savedId);
        if (listaGuardada) {
          setSelectedLista(listaGuardada);

          const meds = await loadMedicamentosPorLista(listaGuardada.id);
          setMedicamentos(meds);
        }
      }
    }
    loadListas();
  }, [user]);

  return (
    <div>
      <TopBar />
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Título */}
        <div className="flex items-center justify-center mb-4 relative">
          <h1 className="text-xl font-bold text-center">
            Calculando lista{" "}
            {selectedLista ? selectedLista.nombre : "(elige lista)"}
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="absolute right-0 p-2 rounded-full hover:bg-gray-100"
          >
            <ListCheck className="w-6 h-6 text-blue-600 hover:text-blue-800" />
          </button>
        </div>

        {/* Input peso animal */}
        <div className="mb-4">
          <InputPeso value={peso} onChange={setPeso} />
        </div>

        {/* Lista medicamentos */}
        <div className="space-y-3">
          {medicamentos.map((med) => (
            <div
              key={med.id}
              className="flex border justify-between items-center p-4 rounded-xl shadow-sm bg-white"
            >
              <div>
                <p className="font-semibold">{med.nombre}</p>
                <p className="text-sm text-gray-600">
                  Posología: {med.posologiaValor} {med.posologiaUnidad}
                </p>
                <p className="text-sm text-gray-600">
                  Concentración: {med.concentracionValor}{" "}
                  {med.concentracionUnidad}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Dosis</p>
                <p className="font-bold text-blue-700">
                  {calcularDosis(med, peso)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal selección lista */}
        <SeleccionListaModal
          show={showModal}
          listas={listas}
          selectedLista={selectedLista}
          onClose={() => setShowModal(false)}
          onSelect={async (lista) => {
            setSelectedLista(lista);
            localStorage.setItem(STORAGE_KEY.LISTA_SELECCIONADA, lista.id); // Persistir
            setShowModal(false);

            const meds = await loadMedicamentosPorLista(lista.id);
            setMedicamentos(meds);
          }}
        />
      </div>
      <BottomNav />
    </div>
  );
}
