// src/repositories/MedicamentosRepository.ts
import { iMedicamento, iMedicamentoId } from "@/domain/types"

export interface MedicamentosRepository {
  getAll(): Promise<iMedicamentoId[]>
  getById(id: number): Promise<iMedicamentoId | null>
  create(med: iMedicamento): Promise<iMedicamentoId>
  update(id: number, med: iMedicamento): Promise<iMedicamentoId>
  delete(id: number): Promise<void>
}
