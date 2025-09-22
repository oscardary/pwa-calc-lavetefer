// src/pages/CalculadoraPage.tsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
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

  // Cargar listas del usuario
  useEffect(() => {
    async function loadListas() {
      if (!user) return;

      const repo = listasLocalRepo();
      const listas = await repo.obtenerTodas(user.id);
      setListas(listas);

      if (listas.length > 0 && !selectedLista) {
        const primeraLista = listas[0];
        setSelectedLista(primeraLista);

        const meds = await loadMedicamentosPorLista(primeraLista.id);
        setMedicamentos(meds);
      }
    }
    loadListas();
  }, [user, selectedLista]);

  return (
    <div>
      <TopBar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          Calculando lista{" "}
          {selectedLista ? selectedLista.nombre : "(elige lista)"}
          <button onClick={() => setShowModal(true)}>
            <ListCheck className="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </button>
        </h1>

        {/* Input peso animal */}
        <div className="relative mb-2">
          <InputPeso value={peso} onChange={setPeso} />
        </div>

        {/* Lista medicamentos */}
        <div className="max-w-2xl mx-auto p-2">
          {medicamentos.map((med, index) => (
            <div
              key={med.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${
                index % 2 === 0 ? "bg-white" : "bg-gray-80"
              }`}
            >
              <div>
                <p className="font-semibold">{med.nombre}</p>
                <p className="text-sm text-gray-600">
                  Pos: {med.posologiaValor} {med.posologiaUnidad} | Con:{" "}
                  {med.concentracionValor} {med.concentracionUnidad}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Dosis</p>
                <p className="font-bold">{calcularDosis(med, peso)}</p>
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
