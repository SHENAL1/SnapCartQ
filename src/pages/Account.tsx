import { useNavigate } from 'react-router-dom'
import { Clock, Settings, ChevronRight } from 'lucide-react'
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-dark sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center">
          <h1 className="text-base font-bold text-white">Account</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-3">

        {/* Device ID card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Device ID</p>
          <p className="font-bold text-gray-900 text-base tracking-wider">{shortId}</p>
          <p className="text-xs text-gray-400 mt-1">Your data is stored locally on this device</p>
        </div>

        {/* Scan Usage card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900 text-sm">Scan Usage</p>
              {loading ? (
                <div className="h-3 bg-gray-100 rounded w-32 mt-1 animate-pulse" />
              ) : (
                <p className="text-xs text-gray-400 mt-0.5">
                  {monthCount} of {FREE_SCAN_LIMIT} free scans used this month
                </p>
              )}
            </div>
            {!loading && (
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: isAtLimit ? '#ef4444' : '#19bfb7' }}
              >
                {monthCount}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${usagePct}%`,
                background: isAtLimit ? '#ef4444' : usagePct > 80 ? '#f59e0b' : '#19bfb7',
              }}
            />
          </div>
          {isAtLimit && (
            <p className="text-xs text-red-500 font-medium mt-2">
              Monthly limit reached — upgrade to keep scanning
            </p>
          )}
        </div>

        {/* Current Plan card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900 text-sm">Current Plan</p>
            <span
              className="text-xs font-bold text-white px-3 py-1 rounded-full"
              style={{ background: '#1e2022' }}
            >
              Free Plan
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">25 photo scans / month · Unlimited lists</p>
          <button
            onClick={() => navigate('/upgrade')}
            className="w-full text-white font-bold rounded-full py-3 text-sm"
            style={{ background: '#19bfb7' }}
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => navigate('/history')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Clock size={16} className="text-indigo-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">Scan History</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Settings size={16} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
