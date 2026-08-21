//src/repositories/remote/MedicamentosRemoteRepo.ts
import type { iMedicamentoId } from "@/domain/types";
import { supabase } from "@/lib/auth/supabaseClient";

export function medicamentosRemoteRepo() {
  return {
    async obtenerTodos(usuarioId: string): Promise<iMedicamentoId[]> {
      const { data, error } = await supabase
        .from("medicamentos")
        .select("*")
        .eq("user_id", usuarioId);

      if (error) {
        throw error;
      }

      return (data ?? []).map((med) => ({
        id: med.id,
        usuarioId: med.user_id,
        nombre: med.nombre,
        presentacion: med.presentacion ?? "",
        concentracionValor: med.concentracion_valor ?? "",
        concentracionUnidad: med.concentracion_unidad ?? "",
        posologiaValor: med.posologia_valor ?? "",
        posologiaUnidad: med.posologia_unidad ?? "",
        comentario: med.comentario ?? "",
      }));
    },

    async insertar(
      usuarioId: string,
      medicamento: iMedicamentoId
    ): Promise<void> {
      const { error } = await supabase.from("medicamentos").upsert(
        {
          id: medicamento.id,
          user_id: usuarioId,
          nombre: medicamento.nombre,
          presentacion: medicamento.presentacion,
          concentracion_valor: medicamento.concentracionValor,
          concentracion_unidad: medicamento.concentracionUnidad,
          posologia_valor: medicamento.posologiaValor,
          posologia_unidad: medicamento.posologiaUnidad,
          comentario: medicamento.comentario,
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

    async actualizar(medicamento: iMedicamentoId): Promise<void> {
      const { error } = await supabase
        .from("medicamentos")
        .update({
          nombre: medicamento.nombre,
          presentacion: medicamento.presentacion,
          concentracion_valor: medicamento.concentracionValor,
          concentracion_unidad: medicamento.concentracionUnidad,
          posologia_valor: medicamento.posologiaValor,
          posologia_unidad: medicamento.posologiaUnidad,
          comentario: medicamento.comentario,
        })
        .eq("id", medicamento.id);

      if (error) {
        throw error;
      }
    },

    async eliminarPorId(id: string): Promise<void> {
      const { error } = await supabase
        .from("medicamentos")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
  };
}
