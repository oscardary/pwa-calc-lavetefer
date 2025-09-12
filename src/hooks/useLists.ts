// src/hooks/useLists.ts
import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import type { iListaId, iLista } from '@/domain/types'
import { listasLocalRepo } from '@/repositories/local/ListasLocalRepo'

const repo = listasLocalRepo()

export function useLists() {
  const { user } = useUser()
  const usuarioId = user?.id ?? ""
  const [listas, setListas] = useState<iListaId[]>([])

  async function reload() {
    setListas(await repo.obtenerTodas(usuarioId))
  }

  useEffect(() => { reload() }, [usuarioId] )
  
  async function saveList(list: iListaId) {
    if (list.id) {
      await repo.actualizar(list)
    } else {
      const { id, ...newList } = list
      await repo.insertar(usuarioId, newList as iLista)
    }
    await reload()
  }

  return { listas, reload, saveList }
}
