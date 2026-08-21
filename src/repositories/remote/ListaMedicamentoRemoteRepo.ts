//src/repositories/remote/ListaMedicamentoRemoteRepo.ts
import type { iListaMedicamentoId } from "@/domain/types";
import { supabase } from "@/lib/auth/supabaseClient";

export function listaMedicamentoRemoteRepo() {
  return {
    async obtenerTodas(listaIds: string[]): Promise<iListaMedicamentoId[]> {
      if (!listaIds.length) {
        return [];
      }

      const { data, error } = await supabase
        .from("lista_medicamento")
        .select("*")
        .in("lista_id", listaIds);

      if (error) {
        throw error;
      }

      return (data ?? []).map((relacion) => ({
        id: relacion.id,
        listaId: relacion.lista_id,
        medicamentoId: relacion.medicamento_id,
      }));
    },

    async insertar(relacion: iListaMedicamentoId): Promise<void> {
      const { error } = await supabase.from("lista_medicamento").upsert(
        {
          id: relacion.id,
          lista_id: relacion.listaId,
          medicamento_id: relacion.medicamentoId,
        },
        {
          onConflict: "id",
          ignoreDuplicates: true,
        }
      );

      if (error) {
        throw error;
      }
    },

    async eliminarPorId(id: string): Promise<void> {
      const { error } = await supabase
        .from("lista_medicamento")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
  };
}
