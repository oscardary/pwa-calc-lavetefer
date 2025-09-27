// src/hooks/useMedicamentos.ts
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import type { iMedicamentoId, iMedicamento } from "@/domain/types";
import { medicamentosLocalRepo } from "@/repositories/local/MedicamentosLocalRepo";
import { useMedicamentosListas } from "./useMedicamentosListas"

/**
 * Hook para manejar medicamentos de un usuario específico
 * Opcionalmente filtrados por listaId
 */
export function useMedicamentos(listaId?: string) {
  const { user } = useUser();
  const usuarioId = user?.id ?? "";
  const repo = medicamentosLocalRepo();
  const relaciones = useMedicamentosListas();
  const [meds, setMeds] = useState<iMedicamentoId[]>([]);

  async function reload() {
    if (listaId) {
      // traer solo medicamentos asociados a una lista
      const all = await repo.obtenerTodos(usuarioId)
      const relations = await relaciones.getAll()
      const medIds = relations.filter(r => r.listaId === listaId).map(r => r.medicamentoId)
      setMeds(all.filter(m => medIds.includes(m.id)))
    } else {
      // traer todos los medicamentos del usuario
      setMeds(await repo.obtenerTodos(usuarioId));
    }
  }

  useEffect(() => {
    reload();
  }, [usuarioId, listaId]);

  async function getMed(id: string) {
    return repo.obtenerPorId(id);
  }

  async function saveMed(med: iMedicamentoId) {
    if (med.id) {
      await repo.actualizar(med);
    } else {
      // nuevo medicamento
      const { id, ...newMed } = med;
      const medId = await repo.insertar(usuarioId, newMed as iMedicamento);

      // si estamos dentro de una lista, asociar el medicamento
      if (listaId) {
        await relaciones.add(medId, listaId)
      }
    }
    await reload();
  }

  async function removeMed(id: string) {
    // eliminar relaciones antes
    await relaciones.removeByMedicamento(id);
    await repo.eliminarPorId(id);
    await reload();
  }

  return { meds, reload, getMed, saveMed, removeMed };
}
