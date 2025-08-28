
export interface iMedicamento {
  nombre: string
  presentacion: string
  concentracionValor: string
  concentracionUnidad: string
  posologiaValor: string
  posologiaUnidad: string
  comentario: string
  activo: boolean
}
export interface iMedicamentoId extends iMedicamento { id?: number }
export interface iLista { id?: number; nombre: string; itemsCount?: number }
