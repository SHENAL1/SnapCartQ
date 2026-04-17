import { useNavigate } from 'react-router-dom'
import { useScanHistory } from '../hooks/useScanHistory'
import BottomNav from '../components/BottomNav'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function ScanHistory() {
  const navigate = useNavigate()
  const { history, loading } = useScanHistory()

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-dark sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="text-base font-bold text-white">Scan History</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
                style={{ borderLeftWidth: 4, borderLeftColor: '#19bfb7' }}
              >
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <div className="text-6xl">📷</div>
            <h2 className="text-lg font-semibold text-gray-700">No scans yet</h2>
            <p className="text-sm text-gray-400">
              Your photo scan history will appear here once you start scanning products.
            </p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                style={{ borderLeftWidth: 4, borderLeftColor: '#19bfb7' }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between px-4 pt-3.5 pb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{formatDate(entry.scanned_at)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTime(entry.scanned_at)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#f0fdfb' }}>
                    <span className="text-xs">📷</span>
                    <span className="text-xs font-semibold" style={{ color: '#19bfb7' }}>
                      {entry.photo_count} photo{entry.photo_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Products */}
                {entry.products.length > 0 ? (
                  <div className="px-4 pb-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Extracted Products
                    </p>
                    <div className="divide-y divide-gray-100">
                      {entry.products.map((p, i) => (
                        <div key={i} className="flex items-center justify-between py-2 text-sm">
                          <span className="text-gray-700 truncate flex-1">{p.name}</span>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {p.weight && (
                              <span className="text-xs text-gray-400">{p.weight}</span>
                            )}
                            {p.price != null && (
                              <span className="text-xs font-semibold text-gray-700">
                                {Number(p.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="px-4 pb-3 text-xs text-gray-400 italic">No products extracted</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
