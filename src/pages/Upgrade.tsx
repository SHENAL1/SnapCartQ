import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { label: 'Photo scans / month', free: '25', pro: 'Unlimited' },
  { label: 'Shopping lists', free: 'Unlimited', pro: 'Unlimited' },
  { label: 'Currency support', free: '✓', pro: '✓' },
  { label: 'Weight tracking', free: '✓', pro: '✓' },
  { label: 'Export lists', free: '✓', pro: '✓' },
  { label: 'Priority AI speed', free: '—', pro: '✓' },
  { label: 'Scan history', free: '30 days', pro: 'Forever' },
]

export default function Upgrade() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(false)

  const handleSubscribe = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-base font-bold text-gray-900">Go Pro</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="text-5xl">✨</div>
          <h2 className="text-2xl font-bold text-gray-900">SnapCartQ Pro</h2>
          <p className="text-gray-400 text-sm">Unlimited scanning for serious shoppers</p>
        </div>

        {/* Price */}
        <div className="bg-indigo-600 rounded-2xl p-5 text-center text-white">
          <p className="text-indigo-200 text-sm font-medium">Monthly plan</p>
          <p className="text-5xl font-bold mt-1">$3.99</p>
          <p className="text-indigo-200 text-sm mt-1">per month, cancel anytime</p>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
            <div className="px-4 py-2.5 text-xs font-semibold text-gray-500">Feature</div>
            <div className="px-2 py-2.5 text-xs font-semibold text-gray-500 text-center">Free</div>
            <div className="px-2 py-2.5 text-xs font-semibold text-indigo-600 text-center">Pro</div>
          </div>
          {features.map((f, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-b border-gray-50 last:border-0 ${
                i % 2 === 1 ? 'bg-gray-50/50' : ''
              }`}
            >
              <div className="px-4 py-3 text-sm text-gray-700">{f.label}</div>
              <div className="px-2 py-3 text-sm text-gray-400 text-center">{f.free}</div>
              <div className="px-2 py-3 text-sm text-indigo-600 font-semibold text-center">{f.pro}</div>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        <button
          onClick={handleSubscribe}
          className="w-full bg-indigo-600 text-white font-bold rounded-2xl py-4 text-base hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
        >
          Subscribe — $3.99 / month
        </button>

        <p className="text-center text-xs text-gray-400">
          Secure payment · Cancel anytime · No hidden fees
        </p>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-4 right-4 max-w-lg mx-auto bg-gray-900 text-white text-sm font-medium rounded-2xl px-5 py-4 text-center shadow-xl animate-fade-in z-50">
          🚀 Coming soon! Payments are on the way.
        </div>
      )}
    </div>
  )
}
