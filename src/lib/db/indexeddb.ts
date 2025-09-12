
import { openDB, IDBPDatabase } from 'idb'
import { v4 as uuidv4 } from "uuid"


export const DB_NAME = 'lavetefer-db'
export const DB_VERSION = 2
export const STORE_USUARIOS = 'usuarios'
export const STORE_LISTAS = 'listas'
export const STORE_MEDICAMENTOS = 'medicamentos'
export const STORE_LISTA_MEDICAMENTO = 'lista_medicamento'

let dbPromise: Promise<IDBPDatabase> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        console.log(`DB upgrade: oldVersion=${oldVersion} → newVersion=${DB_VERSION}`)

        // 1. Usuarios
        if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
          const usuarios = db.createObjectStore(STORE_USUARIOS, { keyPath: "id" })
          usuarios.createIndex("email_idx", "email", { unique: true })
        }

        // 2. Listas
        if (!db.objectStoreNames.contains(STORE_LISTAS)) {
          const listas = db.createObjectStore(STORE_LISTAS, { keyPath: "id" })
          listas.createIndex("usuarioId_idx", "usuarioId", { unique: false })
          listas.createIndex("nombre_idx", "nombre", { unique: false })
        }

        // 3. Medicamentos
        if (!db.objectStoreNames.contains(STORE_MEDICAMENTOS)) {
          const meds = db.createObjectStore(STORE_MEDICAMENTOS, { keyPath: "id" })
          meds.createIndex("usuarioId_idx", "usuarioId", { unique: false })
          meds.createIndex("nombre_idx", "nombre", { unique: false })
        }

        // 4. Relación lista_medicamento
        if (!db.objectStoreNames.contains(STORE_LISTA_MEDICAMENTO)) {
          const lm = db.createObjectStore(STORE_LISTA_MEDICAMENTO, { keyPath: "id" })
          lm.createIndex("listaId_idx", "listaId", { unique: false })
          lm.createIndex("medicamentoId_idx", "medicamentoId", { unique: false })
          lm.createIndex("lista_medicamento_idx", ["listaId", "medicamentoId"], { unique: true })
        }
        
      },
    })
  }
  return dbPromise!
}

// 🔹 Helpers para generar IDs UUID en inserciones
export function generateId() {
  return uuidv4()
}