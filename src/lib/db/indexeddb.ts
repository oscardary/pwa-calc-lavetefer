
import { openDB, IDBPDatabase } from 'idb'
import type { iMedicamentoId, iLista } from '@/domain/types'

export const DB_NAME = 'lavetefer-db'
export const DB_VERSION = 1
export const STORE_LISTAS = 'listas'
export const STORE_MEDICAMENTOS = 'medicamentos'

let dbPromise: Promise<IDBPDatabase> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_LISTAS)) {
          const listas = db.createObjectStore(STORE_LISTAS, { keyPath: 'id', autoIncrement: true })
          listas.createIndex('nombre', 'nombre', { unique: false })
        }
        if (!db.objectStoreNames.contains(STORE_MEDICAMENTOS)) {
          const meds = db.createObjectStore(STORE_MEDICAMENTOS, { keyPath: 'id', autoIncrement: true })
          meds.createIndex('listaId', 'listaId', { unique: false })
          meds.createIndex('activo', 'activo', { unique: false })
        }
      },
    })
  }
  return dbPromise!
}

// Local repository helpers
export async function dbListasGetAll(): Promise<iLista[]> {
  const db = await getDB()
  return db.getAll(STORE_LISTAS)
}
export async function dbListasAdd(nombre: string) {
  const db = await getDB()
  return db.add(STORE_LISTAS, { nombre })
}
export async function dbMedsByLista(listaId: number): Promise<iMedicamentoId[]> {
  const db = await getDB()
  const idx = db.transaction(STORE_MEDICAMENTOS).store.index('listaId')
  return idx.getAll(listaId)
}
