// src/hooks/useMedicamentosListas.ts
import { useState, useCallback } from "react"
import type { iListaMedicamento } from "@/domain/types"
import { listaMedicamentoLocalRepo } from "@/repositories/local/ListaMedicamentoLocalRepo"

export function useMedicamentosListas() {
  const repo = listaMedicamentoLocalRepo()
  const [relations, setRelations] = useState<iListaMedicamento[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener todas las relaciones
  const getAll = useCallback(async () => {
    try {
      setLoading(true)
      const data = await repo.obtenerTodas()
      setRelations(data)
      return data
    } catch (err: any) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Agregar relación medicamento ↔ lista
  const add = useCallback(async (medicamentoId: string, listaId: string) => {
    try {
      setLoading(true)
      const id = await repo.insertar(listaId, medicamentoId)
      const relation = { id, listaId, medicamentoId }
      setRelations((prev) => [...prev, relation])
      return relation
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Eliminar relación puntual
  const remove = useCallback(async (medicamentoId: string, listaId: string) => {
    try {
      setLoading(true)
      await repo.eliminar(listaId, medicamentoId)
      setRelations((prev) =>
        prev.filter(
          (rel) => !(rel.medicamentoId === medicamentoId && rel.listaId === listaId)
        )
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Eliminar todas las relaciones de un medicamento
  const removeByMedicamento = useCallback(async (medicamentoId: string) => {
    try {
      setLoading(true)
      await repo.eliminarPorMedicamento(medicamentoId)
      setRelations((prev) => prev.filter((rel) => rel.medicamentoId !== medicamentoId))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Eliminar todas las relaciones de una lista
  const removeByLista = useCallback(async (listaId: string) => {
    try {
      setLoading(true)
      await repo.eliminarPorLista(listaId)
      setRelations((prev) => prev.filter((rel) => rel.listaId !== listaId))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    relations,
    loading,
    error,
    getAll,
    add,
    remove,
    removeByMedicamento,
    removeByLista,
  }
}
