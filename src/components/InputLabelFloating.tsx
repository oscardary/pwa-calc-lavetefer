// src/components/InputLabelFloating.tsx
import React from "react"

interface InputLabelFloatingProps {
  id: string
  type?: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  errorMessage?: string
}

export default function InputLabelFloating({
  id,
  type = "text",
  label,
  value,
  onChange,
  required = false,
  errorMessage,
}: InputLabelFloatingProps) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className={`peer w-full border rounded-md px-3 pt-5 pb-2 text-base 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${errorMessage ? "border-red-500" : "border-gray-300"}`}
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
        {label}
      </label>

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
