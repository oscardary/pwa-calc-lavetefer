//src/domain/types/lista.ts
export interface iListaMedicamento {
    listaId: string;
    medicamentoId: string;
  }
  
  export interface iListaMedicamentoId extends iListaMedicamento {
    id: string;
  }
  