export function parseWeightToKg(weight: string | null): number | null {
  if (!weight) return null
  const lower = weight.toLowerCase().trim()
  const num = parseFloat(lower)
  if (isNaN(num)) return null
  if (lower.includes('kg')) return num
  if (lower.includes('g')) return num / 1000
  if (lower.includes('lb')) return num * 0.453592
  if (lower.includes('oz')) return num * 0.0283495
  return null
}

export function formatWeightKg(kg: number): string {
  if (kg >= 1) return `${kg.toFixed(2)} kg`
  return `${(kg * 1000).toFixed(0)} g`
}
