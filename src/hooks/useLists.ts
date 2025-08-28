
import { useEffect, useState } from 'react'
import type { iLista } from '@/domain/types'
import { createListasLocalRepo } from '@/repositories/local/ListasLocalRepo'

const repo = createListasLocalRepo()

export function useLists() {
  const [listas, setListas] = useState<iLista[]>([])
  useEffect(() => { repo.obtenerTodas().then(setListas) }, [])
  async function createLista(nombre: string) {
    await repo.crear(nombre)
    setListas(await repo.obtenerTodas())
  }
  return { listas, createLista }
}
