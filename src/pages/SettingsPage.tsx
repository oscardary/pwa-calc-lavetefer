
import React from 'react'
import TopBar from '@/components/TopBar'
import { useAuth } from '@/lib/auth/useAuth'
import { useSync } from '@/lib/sync/useSync'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { lastSync, syncNow } = useSync()

  return (
    <div>
      <TopBar />
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold">Ajustes</h1>
        <div className="rounded-2xl border bg-white p-4 space-y-2">
          <p className="text-sm text-gray-600">Usuario</p>
          <p className="font-medium">{user?.email}</p>
          <button className="rounded-xl border px-3 py-2" onClick={signOut}>Cerrar sesión</button>
        </div>
        <div className="rounded-2xl border bg-white p-4 space-y-2">
          <p className="text-sm text-gray-600">Sincronización</p>
          <p>Última sincronización: {lastSync ? new Date(lastSync).toLocaleString() : 'Nunca'}</p>
          <button className="rounded-xl bg-green-600 text-white px-3 py-2" onClick={syncNow}>Sincronizar ahora</button>
        </div>
      </main>
    </div>
  )
}
