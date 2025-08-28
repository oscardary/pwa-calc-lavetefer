
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ListaPage from '@/pages/ListaPage'
import MedicamentoFormPage from '@/pages/MedicamentoFormPage'
import SettingsPage from '@/pages/SettingsPage'
import { useAuth } from '@/lib/auth/useAuth'

import { AppProviders } from '@/AppProviders'

export default function AppRoutes() {
  const { user } = useAuth()
  return (
    <AppProviders>
    <Routes>
      {!user ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/lista/:listaId" element={<ListaPage />} />
          <Route path="/lista/:listaId/medicamento/:medId?" element={<MedicamentoFormPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
    </AppProviders>
  )
}
