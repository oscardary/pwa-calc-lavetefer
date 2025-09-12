// src/AppProviders.tsx
import React from 'react'
import { AuthProvider } from '@/lib/auth/useAuth'
import { UserProvider } from './context/UserContext'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  )
}
