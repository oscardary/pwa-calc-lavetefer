// src/hooks/useMedicamentos.ts
import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import type { iMedicamentoId, iMedicamento } from '@/domain/types'
import { medicamentosLocalRepo } from '@/repositories/local/MedicamentosLocalRepo'

/**
 * Hook para manejar medicamentos de un usuario específico
 * Opcionalmente filtrados por listaId
 */
export function useMedicamentos(listaId?: string) {
  const { user } = useUser()
  const usuarioId = user?.id ?? ""
  const repo = medicamentosLocalRepo()
  const [meds, setMeds] = useState<iMedicamentoId[]>([])

  async function reload() {
    if (listaId) {
      // traer solo medicamentos asociados a una lista
      //IMPLEMENTAR setMeds(await repo.obtenerPorLista(listaId))
    } else {
      // traer todos los medicamentos del usuario
      setMeds(await repo.obtenerTodos(usuarioId))
    }
  }

  useEffect(() => { reload() }, [usuarioId, listaId])

  async function getMed(id: string) { 
    return repo.obtenerPorId(id) 
  }
  
  async function saveMed(med: iMedicamentoId) {
    if (med.id) {
      await repo.actualizar(med)
    } else {
      // nuevo medicamento
      const { id, ...newMed } = med
      const medId = await repo.insertar(usuarioId, newMed as iMedicamento)

      // si estamos dentro de una lista, asociar el medicamento
      if (listaId) {
        //IMPLEMENTAR await repo.asociarAMedicamentoLista(listaId, medId)
      }
    }
    await reload()
  }

  async function removeMed(id: string) { 
    await repo.eliminarPorId(id); await reload() 
  }

  return { meds, reload, getMed, saveMed, removeMed }
}
