
import type { iMedicamentoId } from '@/domain/types'
import { getDB, STORE_MEDICAMENTOS } from '@/lib/db/indexeddb'

export interface MedicamentosRepo {
  obtenerTodos(listaId: number): Promise<iMedicamentoId[]>
  obtenerPorId(id: number): Promise<iMedicamentoId | null>
  insertar(listaId: number, med: Omit<iMedicamentoId, 'id'>): Promise<number>
  actualizar(med: iMedicamentoId): Promise<void>
  actualizarActivo(id: number, activo: boolean): Promise<void>
  eliminarPorId(id: number): Promise<void>
}

export function createMedicamentosLocalRepo(): MedicamentosRepo {
  return {
    async obtenerTodos(listaId) {
      const db = await getDB()
      const idx = db.transaction(STORE_MEDICAMENTOS).store.index('listaId')
      return idx.getAll(listaId)
    },
    async obtenerPorId(id) {
      const db = await getDB()
      const med = await db.get(STORE_MEDICAMENTOS, id)
      return med || null
    },
    async insertar(listaId, med) {
      const db = await getDB()
      return db.add(STORE_MEDICAMENTOS, { ...med, listaId })
    },
    async actualizar(med) {
      const db = await getDB()
      await db.put(STORE_MEDICAMENTOS, med)
    },
    async actualizarActivo(id, activo) {
      const db = await getDB()
      const med = await db.get(STORE_MEDICAMENTOS, id)
      if (med) { med.activo = activo; await db.put(STORE_MEDICAMENTOS, med) }
    },
    async eliminarPorId(id) {
      const db = await getDB()
      await db.delete(STORE_MEDICAMENTOS, id)
    },
  }
}
