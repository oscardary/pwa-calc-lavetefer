export interface iMedicamento {
  nombre: string;
  presentacion: string;
  concentracionValor: string;
  concentracionUnidad: string;
  posologiaValor: string;
  posologiaUnidad: string;
  comentario: string;
}

export interface iMedicamentoId extends iMedicamento {
  id: string;
  usuarioId: string;
}
