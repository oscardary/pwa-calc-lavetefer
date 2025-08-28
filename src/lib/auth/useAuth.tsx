
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

type User = { id: string; email: string } | null

const AuthCtx = createContext<{ user: User, signIn: (e:string,p:string)=>Promise<void>, signUp: (e:string,p:string)=>Promise<void>, signOut: ()=>Promise<void> }>({
  user: null, signIn: async()=>{}, signUp: async()=>{}, signOut: async()=>{}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email! } : null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  async function signIn(email: string, password: string) {
    await supabase.auth.signInWithPassword({ email, password })
  }
  async function signUp(email: string, password: string) {
    await supabase.auth.signUp({ email, password })
  }
  async function signOut() {
    await supabase.auth.signOut()
  }

  return <AuthCtx.Provider value={{ user, signIn, signUp, signOut }}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
