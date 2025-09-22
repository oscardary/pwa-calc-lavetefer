// src/components/ActionButtons.tsx
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
}

export default function ActionButtons({
  onSave,
  onCancel,
  saveLabel = "Guardar",
  cancelLabel = "Cancelar",
}: ActionButtonsProps) {
  const nav = useNavigate();

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
      <button
        type="button"
        onClick={onSave}
        className="rounded-xl bg-blue-600 text-white px-10 py-2 shadow-md hover:bg-blue-800"
      >
        {saveLabel}
      </button>
      <button
        type="button"
        onClick={() => nav(-1)}
        className="rounded-xl border px-10 py-2 shadow-md hover:bg-gray-300"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
