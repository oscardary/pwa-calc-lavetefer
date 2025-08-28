
import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Lavetefer Calc</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/settings" className="hover:underline">Ajustes</Link>
        </nav>
      </div>
    </header>
  )
}
