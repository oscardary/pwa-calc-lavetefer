// src/pages/ListaFormPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TopBar from "@/components/TopBar";
import { listasLocalRepo } from "@/repositories/local/ListasLocalRepo";
import { medicamentosLocalRepo } from "@/repositories/local/MedicamentosLocalRepo";
import { listaMedicamentoLocalRepo } from "@/repositories/local/ListaMedicamentoLocalRepo"
import type { iListaId, iMedicamentoId } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function ListaFormPage() {
  const { user } = useUser();
  const { listaId } = useParams<{ listaId: string }>();
  const [lista, setLista] = useState<iListaId | null>(null);
  const [medicamentos, setMedicamentos] = useState<iMedicamentoId[]>([]);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const repoListaMedicamento = listaMedicamentoLocalRepo()

  const [filtro, setFiltro] = useState("");

  // 🔹 Cargar lista y medicamentos del usuario
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
      const relaciones = await repoListaMedicamento.obtenerPorLista(listaId)
      const medsEnLista = relaciones.map((rel) => rel.medicamentoId)
      setSeleccionados(new Set(medsEnLista))
    }
    loadData();
  }, [listaId, user]);

  // 🔹 Manejo de selección
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

  // 🔹 Guardar cambios en IndexedDB
  async function handleGuardar() {
    if (!listaId) return

    console.log("Medicamentos seleccionados para lista:", Array.from(seleccionados))

    // 1. Borramos todos los registros actuales de esa lista
    const actuales = await repoListaMedicamento.obtenerPorLista(listaId)
    for (const lm of actuales) {
      await repoListaMedicamento.eliminar(lm.listaId, lm.medicamentoId)
    }

    // 2. Insertamos los seleccionados
    for (const medId of seleccionados) {
      await repoListaMedicamento.insertar(listaId, medId)
    }

    alert("Cambios guardados en IndexedDB ✅")
  }

  // 🔹 Filtro simple
  const medicamentosFiltrados = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <TopBar />
      <div className="p-4 space-y-4">
        {/* Título */}
        <h1 className="text-xl font-bold">
          {lista?.nombre || "Lista sin nombre"}
        </h1>
        <p className="text-gray-500">{lista?.descripcion}</p>

        {/* Barra de búsqueda */}
        <Input
          placeholder="Buscar medicamento..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

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
        <Button onClick={handleGuardar} className="w-full">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
