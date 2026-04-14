import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getUserId } from '../lib/userId'
import { FREE_SCAN_LIMIT } from '../lib/scanHistory'

export interface ScanEntry {
  id: string
  scanned_at: string
  photo_count: number
  products: Array<{ name: string; price: number | null; weight: string | null }>
}

export function useScanHistory() {
  const [history, setHistory] = useState<ScanEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [monthCount, setMonthCount] = useState(0)

  useEffect(() => {
    const userId = getUserId()

    supabase
      .from('scan_history')
      .select('*')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false })
      .then(({ data }) => {
        setHistory((data as ScanEntry[]) || [])
        setLoading(false)
      })

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('scanned_at', startOfMonth.toISOString())
      .then(({ count }) => setMonthCount(count ?? 0))
  }, [])

  const isAtLimit = monthCount >= FREE_SCAN_LIMIT
  const scansRemaining = Math.max(0, FREE_SCAN_LIMIT - monthCount)

  return { history, loading, monthCount, isAtLimit, scansRemaining }
}
