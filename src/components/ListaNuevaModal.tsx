import { useState } from "react";

interface ListaNuevaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (nombre: string, descripcion: string) => void;
}

export default function ListaNuevaModal({ isOpen, onClose, onCreate }: ListaNuevaModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onCreate(nombre.trim(), descripcion.trim());
    setNombre("");
    setDescripcion("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Nueva Lista</h2>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded mb-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          className="w-full p-2 border rounded mb-3"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
