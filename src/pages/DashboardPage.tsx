
import React from 'react'
import TopBar from '@/components/TopBar'
import { useLists } from '@/hooks/useLists'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { listas, createLista } = useLists()
  return (
    <div>
      <TopBar />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mis listas</h1>
          <button className="rounded-xl bg-green-600 text-white px-3 py-2" onClick={()=>createLista(prompt('Nombre de la lista') || 'Nueva lista')}>Nueva lista</button>
        </header>
        <ul className="grid gap-2">
          {listas.map(l => (
            <li key={l.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{l.nombre}</p>
                  <p className="text-sm text-gray-600">{l.itemsCount || 0} medicamentos</p>
                </div>
                <Link to={`/lista/${l.id}`} className="text-green-700">Abrir</Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
