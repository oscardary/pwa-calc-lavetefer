
import type { iLista } from '@/domain/types'
import { getDB, STORE_LISTAS } from '@/lib/db/indexeddb'

export interface ListasRepo {
  obtenerTodas(): Promise<iLista[]>
  crear(nombre: string): Promise<number>
}
export function createListasLocalRepo(): ListasRepo {
  return {
    async obtenerTodas() {
      const db = await getDB()
      return db.getAll(STORE_LISTAS)
    },
    async crear(nombre: string) {
      const db = await getDB()
      return db.add(STORE_LISTAS, { nombre })
    },
  }
}
