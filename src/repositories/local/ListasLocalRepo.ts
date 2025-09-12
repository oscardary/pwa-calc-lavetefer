// src/repositories/local/ListasLocalRepo.ts
import type { iLista, iListaId } from '@/domain/types'
import { getDB, generateId, STORE_LISTAS } from '@/lib/db/indexeddb'

export interface iListasRepo {
  obtenerTodas(usuarioId: string): Promise<iListaId[]>
  insertar(usuarioId: string, listNueva: iLista): Promise<string>
  actualizar(list: iListaId): Promise<void>
  eliminarPorId(id: string): Promise<void>
}

export function listasLocalRepo(): iListasRepo {
  return {
    async obtenerTodas(usuarioId) {
      if (!usuarioId) return [] // no hay usuario válido -> no buscamos

      const db = await getDB()
      const idx = db.transaction(STORE_LISTAS).store.index('usuarioId_idx')
      return idx.getAll(usuarioId)
    },

    async insertar(usuarioId, listNueva: iLista) {
      const db = await getDB()
      const listaInsertar: iListaId = {
        ...listNueva,
        id: generateId(),
        usuarioId,
      }
      console.log("Insertando lista en IndexedDB:", listaInsertar)

      await db.add(STORE_LISTAS, listaInsertar)
      console.log("Insertada lista OK con id:", listaInsertar.id)

      return listaInsertar.id as string
    },
    async actualizar(list) {
      const db = await getDB()
      await db.put(STORE_LISTAS, list)
    },
    async eliminarPorId(id) {
      const db = await getDB()
      await db.delete(STORE_LISTAS, id)
    },
  }
}
