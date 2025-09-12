
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
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>

      </main>
    </div>
  )
}
