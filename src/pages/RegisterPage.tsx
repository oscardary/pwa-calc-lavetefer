
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/useAuth'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Crear cuenta</h1>
        <form className="space-y-3" onSubmit={(e)=>{e.preventDefault(); signUp(email, password).then(()=>nav('/'))}}>
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full rounded-xl py-2 bg-green-600 text-white">Crear cuenta</button>
        </form>
        <p className="text-sm mt-3 text-center">¿Ya tienes cuenta? <Link to="/" className="text-green-700">Inicia sesión</Link></p>
      </div>
    </div>
  )
}
