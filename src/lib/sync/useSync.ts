//src/lib/sync/useSync.ts
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { listasLocalRepo } from "@/repositories/local/ListasLocalRepo";
import { listasRemoteRepo } from "@/repositories/remote/ListasRemoteRepo";
import { medicamentosLocalRepo } from "@/repositories/local/MedicamentosLocalRepo";
import { medicamentosRemoteRepo } from "@/repositories/remote/MedicamentosRemoteRepo";
import { listaMedicamentoLocalRepo } from "@/repositories/local/ListaMedicamentoLocalRepo";
import { listaMedicamentoRemoteRepo } from "@/repositories/remote/ListaMedicamentoRemoteRepo";

export function useSync() {
  const { user } = useUser();

  const [lastSync, setLastSync] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function syncNow() {
    if (!user?.id) return;

    try {
      setSyncing(true);
      setSyncError(null);

      const usuarioId = user.id;

      const listasLocal = listasLocalRepo();
      const listasRemote = listasRemoteRepo();

      const medicamentosLocal = medicamentosLocalRepo();
      const medicamentosRemote = medicamentosRemoteRepo();

      const listaMedicamentoLocal = listaMedicamentoLocalRepo();
      const listaMedicamentoRemote = listaMedicamentoRemoteRepo();

      // ==========================================
      // 1. SINCRONIZAR LISTAS
      // ==========================================
      const listasLocales = await listasLocal.obtenerTodas(usuarioId);
      const listasRemotas = await listasRemote.obtenerTodas(usuarioId);
      const idsListasRemotas = new Set(listasRemotas.map((lista) => lista.id));

      for (const lista of listasLocales) {
        if (!idsListasRemotas.has(lista.id)) {
          await listasRemote.insertar(usuarioId, lista);
        }
      }

      // ==========================================
      // 2. SINCRONIZAR MEDICAMENTOS
      // ==========================================
      const medicamentosLocales = await medicamentosLocal.obtenerTodos(
        usuarioId
      );
      const medicamentosRemotos = await medicamentosRemote.obtenerTodos(
        usuarioId
      );
      const idsMedicamentosRemotos = new Set(
        medicamentosRemotos.map((medicamento) => medicamento.id)
      );

      for (const medicamento of medicamentosLocales) {
        if (!idsMedicamentosRemotos.has(medicamento.id)) {
          await medicamentosRemote.insertar(usuarioId, medicamento);
        }
      }

      // ==========================================
      // 3. SINCRONIZAR RELACIONES LISTA ↔ MEDICAMENTO
      // ==========================================
      const relacionesLocales = await listaMedicamentoLocal.obtenerTodas();
      const idsListasLocales = new Set(listasLocales.map((lista) => lista.id));
      const idsMedicamentosLocales = new Set(medicamentosLocales.map((medicamento) => medicamento.id));

      // Solo relaciones pertenecientes a datos del usuario actual
      const relacionesUsuario = relacionesLocales.filter(
        (relacion) =>
          idsListasLocales.has(relacion.listaId) &&
          idsMedicamentosLocales.has(relacion.medicamentoId)
      );

      // Obtener relaciones que ya existen en Supabase
      const idsListasUsuario = listasLocales.map((lista) => lista.id);
      const relacionesRemotas = await listaMedicamentoRemote.obtenerTodas(idsListasUsuario);

      const idsRelacionesRemotas = new Set(
        relacionesRemotas.map((relacion) => relacion.id)
      );

      // Insertar únicamente relaciones faltantes
      for (const relacion of relacionesUsuario) {
        if (!idsRelacionesRemotas.has(relacion.id)) {
          await listaMedicamentoRemote.insertar(relacion);
        }
      }

      setLastSync(Date.now());
    } catch (error: any) {
      console.error("ERROR EN SINCRONIZACIÓN:", error);
      setSyncError(error.message ?? "Error durante la sincronización");
    } finally {
      setSyncing(false);
    }
  }

  return {
    lastSync,
    syncing,
    syncError,
    syncNow,
  };
}
