import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getUserId } from '../lib/userId'
import { CURRENCIES } from '../lib/currencies'
import { getDefaultCurrency, setDefaultCurrency } from '../lib/scanHistory'

const APP_VERSION = '1.0.0'

export default function Settings() {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState(getDefaultCurrency)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleCurrencyChange = (code: string) => {
    setCurrency(code)
    setDefaultCurrency(code)
  }

  const handleClearData = async () => {
    setClearing(true)
    try {
      const userId = getUserId()
      // Delete Supabase data (items cascade from shopping_lists)
      await Promise.all([
        supabase.from('shopping_lists').delete().eq('user_id', userId),
        supabase.from('scan_history').delete().eq('user_id', userId),
      ])
      // Clear localStorage settings
      localStorage.removeItem('snapcartq_default_currency')
      setCurrency('MYR')
      setCleared(true)
      setShowClearConfirm(false)
    } catch {
      alert('Failed to clear data. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-dark sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="text-base font-bold text-white">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Default currency */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Default Currency</h2>
          <p className="text-xs text-gray-400 mb-3">Applied to new lists you create.</p>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Data</h2>
          </div>

          {cleared ? (
            <div className="px-4 py-4 text-sm text-green-700 bg-green-50 flex items-center gap-2">
              <span>✓</span> All data cleared successfully.
            </div>
          ) : (
            <div className="px-4 py-3">
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear All Data…
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    This will permanently delete all your shopping lists, items, and scan history.
                    <strong> This cannot be undone.</strong>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 border border-gray-200 text-gray-600 font-medium rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearData}
                      disabled={clearing}
                      className="flex-1 bg-red-600 text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {clearing ? 'Clearing…' : 'Delete Everything'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h2 className="font-semibold text-gray-900">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-700 font-medium">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Website</span>
              <span className="text-indigo-600 font-medium">snapcartq.com</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
