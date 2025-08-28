
import { useState } from 'react'
import { Remote } from '@/repositories/remote/SupabaseRepo'

export function useSync() {
  const [lastSync, setLastSync] = useState<number | null>(null)

  async function syncNow() {
    // TODO: diff-based sync
    await Remote.pullAll()
    setLastSync(Date.now())
  }

  return { lastSync, syncNow }
}
