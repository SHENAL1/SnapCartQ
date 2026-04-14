import { useNavigate } from 'react-router-dom'
import { getUserId } from '../lib/userId'
import { FREE_SCAN_LIMIT } from '../lib/scanHistory'
import { useScanHistory } from '../hooks/useScanHistory'
import BottomNav from '../components/BottomNav'

export default function Account() {
  const navigate = useNavigate()
  const userId = getUserId()
  const shortId = userId.slice(0, 8).toUpperCase()
  const { monthCount, loading } = useScanHistory()

  const usagePct = Math.min((monthCount / FREE_SCAN_LIMIT) * 100, 100)
  const isAtLimit = monthCount >= FREE_SCAN_LIMIT

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <h1 className="text-base font-bold text-gray-900">Account</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Device identity */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {shortId[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Device Account</p>
              <p className="text-xs text-gray-400 mt-0.5">ID: {shortId}</p>
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                Free Plan
              </span>
            </div>
          </div>
        </div>

        {/* Scan usage */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Photo Scans</h2>
            <span className="text-xs text-gray-400">This month</span>
          </div>

          {loading ? (
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <>
              <div className="flex items-end justify-between">
                <span className={`text-3xl font-bold ${isAtLimit ? 'text-red-600' : 'text-gray-900'}`}>
                  {monthCount}
                </span>
                <span className="text-sm text-gray-400">of {FREE_SCAN_LIMIT} free</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isAtLimit ? 'bg-red-500' : usagePct > 80 ? 'bg-amber-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              {isAtLimit ? (
                <p className="text-xs text-red-600 font-medium">
                  Monthly limit reached — upgrade to keep scanning
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  {FREE_SCAN_LIMIT - monthCount} scan{FREE_SCAN_LIMIT - monthCount !== 1 ? 's' : ''} remaining this month
                </p>
              )}
            </>
          )}
        </div>

        {/* Upgrade card */}
        <div className="bg-indigo-600 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-white">SnapCartQ Pro</p>
              <p className="text-indigo-200 text-sm mt-0.5">Unlimited scans + priority support</p>
              <p className="text-white font-semibold text-lg mt-2">$3.99 / month</p>
            </div>
            <span className="text-3xl mt-1">✨</span>
          </div>
          <button
            onClick={() => navigate('/upgrade')}
            className="w-full mt-4 bg-white text-indigo-600 font-bold rounded-xl py-3 text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => navigate('/history')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🕐</span>
              <span className="text-sm font-medium text-gray-700">Scan History</span>
            </div>
            <span className="text-gray-300 text-sm">→</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </div>
            <span className="text-gray-300 text-sm">→</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
