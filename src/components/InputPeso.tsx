import { X } from "lucide-react";

interface InputPesoProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function InputPeso({
  value,
  onChange,
  placeholder = "Peso del animal (kg)",
}: InputPesoProps) {
  return (
    <div className="relative w-full">
      <input
        type="number"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-base shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
