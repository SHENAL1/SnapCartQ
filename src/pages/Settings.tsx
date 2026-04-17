import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
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
      await Promise.all([
        supabase.from('shopping_lists').delete().eq('user_id', userId),
        supabase.from('scan_history').delete().eq('user_id', userId),
      ])
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

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* PREFERENCES section */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Preferences
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium text-gray-700">Default Currency</span>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer text-right max-w-[160px]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 px-1">Applied to new lists you create.</p>
        </div>

        {/* DATA section */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Data
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {cleared ? (
              <div className="px-4 py-4 text-sm text-green-700 bg-green-50 flex items-center gap-2">
                <span>✓</span> All data cleared successfully.
              </div>
            ) : !showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef2f2' }}>
                    <Trash2 size={16} stroke="#f87171" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Clear All Data</span>
                </div>
                <span className="text-xs font-bold text-red-500">Delete</span>
              </button>
            ) : (
              <div className="px-4 py-4 space-y-3">
                <p className="text-sm text-gray-700">
                  This will permanently delete all your shopping lists, items, and scan history.{' '}
                  <strong>This cannot be undone.</strong>
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
                    className="flex-1 bg-red-500 text-white font-bold rounded-xl py-2.5 text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {clearing ? 'Clearing…' : 'Delete Everything'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ABOUT section */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            About
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium text-gray-700">Version</span>
              <span className="text-sm text-gray-400">{APP_VERSION}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium text-gray-700">Website</span>
              <span className="text-sm font-semibold" style={{ color: '#19bfb7' }}>snapcartq.com</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
