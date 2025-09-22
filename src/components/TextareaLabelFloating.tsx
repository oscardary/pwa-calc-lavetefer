// src/components/TextareaLabelFloating.tsx
import React from "react";

interface TextareaLabelFloatingProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  errorMessage?: string;
  rows?: number;
}

export default function TextareaLabelFloating({
  id,
  label,
  value,
  onChange,
  required = false,
  errorMessage,
  rows = 3,
}: TextareaLabelFloatingProps) {
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="peer w-full border rounded-xl px-3 pt-5 pb-2 resize-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label
        htmlFor={id}
        className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all
            peer-placeholder-shown:top-1/2 
            peer-placeholder-shown:text-gray-400 
            peer-placeholder-shown:text-base
            peer-focus:top-0 
            peer-focus:text-sm 
            peer-focus:text-blue-500
            peer-[&:not(:placeholder-shown)]:top-0
            peer-[&:not(:placeholder-shown)]:text-sm
            peer-[&:not(:placeholder-shown)]:text-gray-500`}
      >
        {label} {required && "*"}
      </label>
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
