export interface iLista {
  nombre: string;
  descripcion: string;
}

export interface iListaId extends iLista {
  id: string;
  usuarioId: string;
}
