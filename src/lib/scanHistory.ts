import { supabase } from './supabase'
import { getUserId } from './userId'

export const FREE_SCAN_LIMIT = 25

export async function logScan(
  photoCount: number,
  products: Array<{ name: string; price: number | null; weight: string | null }>
): Promise<void> {
  await supabase.from('scan_history').insert({
    user_id: getUserId(),
    photo_count: photoCount,
    products,
  })
}

export async function getMonthScanCount(): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('scan_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', getUserId())
    .gte('scanned_at', startOfMonth.toISOString())

  return count ?? 0
}

export function getDefaultCurrency(): string {
  return localStorage.getItem('snapcartq_default_currency') ?? 'MYR'
}

export function setDefaultCurrency(code: string): void {
  localStorage.setItem('snapcartq_default_currency', code)
}

export function isOnboarded(): boolean {
  return localStorage.getItem('snapcartq_onboarded') === 'true'
}

export function markOnboarded(): void {
  localStorage.setItem('snapcartq_onboarded', 'true')
}
