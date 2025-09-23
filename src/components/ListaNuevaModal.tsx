// src/components/ListaNuevaModal.tsx
import { useState, useEffect } from "react";
import { iListaId } from "@/domain/types";

interface ListaNuevaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lista: iListaId) => void;
  initialData?: iListaId;
}

export default function ListaNuevaModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ListaNuevaModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Cuando se abre el modal o cambia initialData, rellenar los inputs
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setDescripcion(initialData.descripcion || "");
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onSave({
      id: initialData?.id ?? "", // si no existe se define al guardar
      usuarioId: initialData?.usuarioId ?? "", // si no existe se define al guardar
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
    onClose();
  };

  const isEdit = Boolean(initialData);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Editar Lista" : "Nueva Lista"}
        </h2>
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
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isEdit ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
