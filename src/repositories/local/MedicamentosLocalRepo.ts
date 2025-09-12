// src/repositories/local/MedicamentosLocalRepo.ts
import { useAuth } from '@/lib/auth/useAuth';
import type { iMedicamento, iMedicamentoId } from '@/domain/types'
import { getDB, generateId, STORE_MEDICAMENTOS, STORE_LISTA_MEDICAMENTO } from '@/lib/db/indexeddb'

export interface MedicamentosRepo {
  obtenerTodos(usuarioId: string): Promise<iMedicamentoId[]>
  obtenerPorId(id: string): Promise<iMedicamentoId | null>
  obtenerPorLista(listaId: string): Promise<iMedicamentoId[]>
  insertar(usuarioId: string, medNuevo: iMedicamento): Promise<string>
  actualizar(med: iMedicamentoId): Promise<void>
  eliminarPorId(id: string): Promise<void>
  asociarAMedicamentoLista(listaId: string, medicamentoId: string): Promise<void>
  desasociarDeLista(listaId: string, medicamentoId: string): Promise<void>
}

export function createMedicamentosLocalRepo(): MedicamentosRepo {
  return {
    async obtenerTodos(usuarioId) {
      if (!usuarioId) return [] // no hay lista válida -> no buscamos
      
      const db = await getDB()
      const idx = db.transaction(STORE_MEDICAMENTOS).store.index('usuarioId_idx')
      return idx.getAll(usuarioId)
    },
    async obtenerPorId(id) {
      const db = await getDB()
      const med = await db.get(STORE_MEDICAMENTOS, id)
      return med || null
    },
    async obtenerPorLista(listaId: string) {
      const db = await getDB()
      // buscar asociaciones en lista_medicamento
      const idx = db.transaction(STORE_LISTA_MEDICAMENTO).store.index("listaId_idx")
      const asociaciones = await idx.getAll(listaId)
    
      if (!asociaciones.length) return []
    
      // traer medicamentos vinculados
      const meds: iMedicamentoId[] = []
      for (const a of asociaciones) {
        const med = await db.get(STORE_MEDICAMENTOS, a.medicamentoId)
        if (med) meds.push(med)
      }
      return meds
    },    
    async insertar(usuarioId, medNuevo: iMedicamento) {
      const db = await getDB()
      const medInsertar: iMedicamentoId = {
        ...medNuevo,
        id: generateId(),
        usuarioId,
      }
      console.log("Insertando en IndexedDB:", medInsertar)

      await db.add(STORE_MEDICAMENTOS, medInsertar)
      console.log("Insertado OK con id:", medInsertar.id)

      return medInsertar.id as string
    },
    async actualizar(med) {
      const db = await getDB()
      await db.put(STORE_MEDICAMENTOS, med)
    },
    async eliminarPorId(id) {
      const db = await getDB()
      await db.delete(STORE_MEDICAMENTOS, id)
    },
    async asociarAMedicamentoLista(listaId: string, medicamentoId: string) {
      const db = await getDB()
      await db.add(STORE_LISTA_MEDICAMENTO, {
        listaId,
        medicamentoId,
      })
    },
    async desasociarDeLista(listaId: string, medicamentoId: string) {
      const db = await getDB()
      const idx = db.transaction(STORE_LISTA_MEDICAMENTO).store.index("lista_medicamento_idx")
      const key = await idx.getKey([listaId, medicamentoId])
      if (key) {
        await db.delete(STORE_LISTA_MEDICAMENTO, key)
      }
    }
  }
}
