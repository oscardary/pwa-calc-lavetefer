//src/repositories/remote/ListasRemoteRepo.ts
import type { iListaId } from '@/domain/types'
import { supabase } from '@/lib/auth/supabaseClient'

export function listasRemoteRepo() {
  return {
    async obtenerTodas(usuarioId: string): Promise<iListaId[]> {
      const { data, error } = await supabase
        .from('listas')
        .select('*')
        .eq('user_id', usuarioId)

      if (error) {
        throw error
      }

      return (data ?? []).map((lista) => ({
        id: lista.id,
        usuarioId: lista.user_id,
        nombre: lista.nombre,
        descripcion: lista.descripcion,
      }))
    },

    async insertar(
      usuarioId: string,
      lista: iListaId
    ): Promise<void> {
      const { error } = await supabase
        .from('listas')
        .upsert({
              id: lista.id,
              user_id: usuarioId,
              nombre: lista.nombre,
              descripcion: lista.descripcion,
            },
            {
              onConflict: 'id',
              ignoreDuplicates: true,
            })

      if (error) {
        throw error
      }
    },

    async actualizar(lista: iListaId): Promise<void> {
      const { error } = await supabase
        .from('listas')
        .update({
          nombre: lista.nombre,
          descripcion: lista.descripcion,
        })
        .eq('id', lista.id)

      if (error) {
        throw error
      }
    },

    async eliminarPorId(id: string): Promise<void> {
      const { error } = await supabase
        .from('listas')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
    },
  }
}