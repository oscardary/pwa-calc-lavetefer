
import { useEffect, useState } from 'react'
import type { iMedicamentoId } from '@/domain/types'
import { createMedicamentosLocalRepo } from '@/repositories/local/MedicamentosLocalRepo'

export function useMedicamentos(listaId: string) {
  const repo = createMedicamentosLocalRepo()
  const [meds, setMeds] = useState<iMedicamentoId[]>([])

  async function reload() {
    setMeds(await repo.obtenerTodos(Number(listaId)))
  }
  useEffect(()=>{ reload() }, [listaId])

  async function getMed(id: number) { return repo.obtenerPorId(id) }
  async function saveMed(med: iMedicamentoId) {
    if (med.id) await repo.actualizar({ ...med, id: med.id })
    else await repo.insertar(Number(listaId), { ...med, id: undefined })
    await reload()
  }
  async function toggleActivo(id: number, activo: boolean) { await repo.actualizarActivo(id, activo); await reload() }
  async function removeMed(id: number) { await repo.eliminarPorId(id); await reload() }

  return { meds, reload, getMed, saveMed, toggleActivo, removeMed }
}
