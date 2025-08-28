
import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import { useMedicamentos } from '@/hooks/useMedicamentos'

export default function ListaPage() {
  const { listaId } = useParams()
  const nav = useNavigate()
  const { meds, toggleActivo, removeMed } = useMedicamentos(listaId!)

  return (
    <div>
      <TopBar />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Medicamentos</h1>
          <button className="rounded-xl bg-green-600 text-white px-3 py-2" onClick={()=>nav(`/lista/${listaId}/medicamento/new`)}>Agregar</button>
        </header>
        <ul className="grid gap-2">
          {meds.map(m => (
            <li key={m.id} className="rounded-2xl border bg-white p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.nombre}</p>
                  <p className="text-sm text-gray-600">{m.posologiaValor} {m.posologiaUnidad} • {m.concentracionValor} {m.concentracionUnidad}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm" onClick={()=>toggleActivo(m.id!, !m.activo)}>{m.activo ? '★' : '☆'}</button>
                  <Link className="text-green-700 text-sm" to={`/lista/${listaId}/medicamento/${m.id}`}>Editar</Link>
                  <button className="text-red-600 text-sm" onClick={()=>removeMed(m.id!)}>Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
