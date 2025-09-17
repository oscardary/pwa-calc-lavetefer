// src/repositories/local/ListaMedicamentoLocalRepo.ts
import { getDB, generateId, STORE_LISTA_MEDICAMENTO } from "@/lib/db/indexeddb"

export interface iListaMedicamento {
  id: string
  listaId: string
  medicamentoId: string
}

export function listaMedicamentoLocalRepo() {
  return {
    async obtenerPorLista(listaId: string): Promise<iListaMedicamento[]> {
      const db = await getDB()
      return db.getAllFromIndex(STORE_LISTA_MEDICAMENTO, "listaId_idx", listaId)
    },

    async insertar(listaId: string, medicamentoId: string): Promise<string> {
      const db = await getDB()
      const nuevo: iListaMedicamento = {
        id: generateId(),
        listaId,
        medicamentoId,
      }
      await db.add(STORE_LISTA_MEDICAMENTO, nuevo)
      return nuevo.id
    },

    async eliminar(listaId: string, medicamentoId: string): Promise<void> {
      const db = await getDB()
      const idx = db.transaction(STORE_LISTA_MEDICAMENTO, "readwrite").store.index("lista_medicamento_idx")
      const key = await idx.getKey([listaId, medicamentoId])
      if (key) {
        await db.delete(STORE_LISTA_MEDICAMENTO, key)
      }
    },
  }
}
