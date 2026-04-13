export const CURRENCIES = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
]

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code
}

export function formatPrice(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  if (currency === 'JPY') return `${symbol}${Math.round(amount).toLocaleString()}`
  return `${symbol}${amount.toFixed(2)}`
}
