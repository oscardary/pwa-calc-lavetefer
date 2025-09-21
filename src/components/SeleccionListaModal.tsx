import { iListaId } from "../domain/types";

interface SeleccionListaModalProps {
  show: boolean;
  listas: iListaId[];
  selectedLista: iListaId | null;
  onClose: () => void;
  onSelect: (lista: iListaId) => void;
}

export function SeleccionListaModal({
  show,
  listas,
  selectedLista,
  onClose,
  onSelect,
}: SeleccionListaModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-4">
        <h2 className="text-lg font-semibold mb-4">Selecciona una lista</h2>

        {listas.length === 0 ? (
          <p className="text-gray-500 text-center">No tienes listas creadas</p>
        ) : (
          <ul className="divide-y">
            {listas.map((lista) => (
              <li
                key={lista.id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedLista?.id === lista.id ? "bg-blue-100" : ""
                }`}
                onClick={() => onSelect(lista)}
              >
                {lista.nombre}
              </li>
            ))}
          </ul>
        )}

        <button onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </div>
  );
}
