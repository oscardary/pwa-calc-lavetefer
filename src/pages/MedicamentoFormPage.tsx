
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import { UNIDADES_CONCENTRACION, UNIDADES_POSOLOGIA } from '@/constants/units'
import { useMedicamentos } from '@/hooks/useMedicamentos'
import { iMedicamentoId } from '@/domain/types'

export default function MedicamentoFormPage() {
  const { listaId, medId } = useParams()
  const nav = useNavigate()
  const { getMed, saveMed } = useMedicamentos(listaId!)
  const [med, setMed] = useState<iMedicamentoId>({
    id: undefined,
    nombre: '', presentacion: '',
    concentracionValor: '', concentracionUnidad: 'mg/ml',
    posologiaValor: '', posologiaUnidad: 'mg/kg',
    comentario: '', activo: true,
  })

  useEffect(()=>{
    if (medId && medId !== 'new') {
      getMed(Number(medId)).then(m => m && setMed(m))
    }
  }, [medId])

  return (
    <div>
      <TopBar />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold">{medId==='new' ? 'Agregar' : 'Editar'} medicamento</h1>
        <form className="grid gap-3" onSubmit={(e)=>{e.preventDefault(); saveMed(med).then(()=>nav(-1))}}>
          <input className="border rounded-xl px-3 py-2" placeholder="Nombre" value={med.nombre} onChange={e=>setMed({...med, nombre:e.target.value})} />
          <input className="border rounded-xl px-3 py-2" placeholder="Presentación" value={med.presentacion} onChange={e=>setMed({...med, presentacion:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded-xl px-3 py-2" placeholder="Conc. valor" value={med.concentracionValor} onChange={e=>setMed({...med, concentracionValor:e.target.value})} />
            <select className="border rounded-xl px-3 py-2" value={med.concentracionUnidad} onChange={e=>setMed({...med, concentracionUnidad:e.target.value})}>
              {UNIDADES_CONCENTRACION.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded-xl px-3 py-2" placeholder="Posología valor" value={med.posologiaValor} onChange={e=>setMed({...med, posologiaValor:e.target.value})} />
            <select className="border rounded-xl px-3 py-2" value={med.posologiaUnidad} onChange={e=>setMed({...med, posologiaUnidad:e.target.value})}>
              {UNIDADES_POSOLOGIA.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <textarea className="border rounded-xl px-3 py-2" placeholder="Comentario" value={med.comentario} onChange={e=>setMed({...med, comentario:e.target.value})} />
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={med.activo} onChange={e=>setMed({...med, activo:e.target.checked})} />
            Favorito
          </label>
          <div className="flex gap-2">
            <button className="rounded-xl bg-green-600 text-white px-3 py-2">Guardar</button>
            <button type="button" className="rounded-xl border px-3 py-2" onClick={()=>nav(-1)}>Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  )
}
