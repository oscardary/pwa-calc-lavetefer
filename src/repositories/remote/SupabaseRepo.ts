
import { supabase } from '@/lib/auth/supabaseClient'

// Placeholder: implement remote sync to tables: listas, medicamentos
export const Remote = {
  async pullAll() {
    // TODO: fetch lists + meds by user
    return { listas: [], medicamentos: [] }
  },
  async pushChanges(changes: any) {
    // TODO: upsert to supabase
    return true
  }
}
