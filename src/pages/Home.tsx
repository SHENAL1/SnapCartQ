import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLists } from '../hooks/useLists'
import { supabase } from '../lib/supabase'
import ListCard from '../components/ListCard'
import CreateListModal from '../components/CreateListModal'
import BottomNav from '../components/BottomNav'

interface ListStats {
  count: number
  total: number
}

export default function Home() {
  const navigate = useNavigate()
  const { lists, loading, error, createList, deleteList, duplicateList } = useLists()
  const [showCreate, setShowCreate] = useState(false)
  const [stats, setStats] = useState<Record<string, ListStats>>({})

  useEffect(() => {
    if (lists.length === 0) return
    const listIds = lists.map((l) => l.id)
    supabase
      .from('items')
      .select('list_id, price, quantity')
      .in('list_id', listIds)
      .then(({ data }) => {
        const s: Record<string, ListStats> = {}
        for (const item of data ?? []) {
          if (!s[item.list_id]) s[item.list_id] = { count: 0, total: 0 }
          s[item.list_id].count++
          s[item.list_id].total += (item.price ?? 0) * item.quantity
        }
        setStats(s)
      })
  }, [lists])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this list and all its items?')) return
    try {
      await deleteList(id)
    } catch {
      alert('Failed to delete list')
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateList(id)
    } catch {
      alert('Failed to duplicate list')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">SnapCartQ</h1>
              <p className="text-[11px] text-gray-400 leading-tight">
                {lists.length} list{lists.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-indigo-700 active:scale-95 transition-all"
            >
              + New List
            </button>
            <button
              onClick={() => navigate('/account')}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-base"
              aria-label="Account"
            >
              👤
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-5">
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-300 text-sm">
            Loading…
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {!loading && lists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
            {/* Illustration area */}
            <div className="w-28 h-28 bg-indigo-50 rounded-3xl flex items-center justify-center">
              <span className="text-6xl">🛒</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-800">No lists yet</h2>
              <p className="text-sm text-gray-400 max-w-xs">
                Create your first shopping list and start adding items manually or by photo scan.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 text-white font-semibold rounded-2xl px-8 py-3.5 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Create Your First List
            </button>
          </div>
        )}

        <div className="space-y-3">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              itemCount={stats[list.id]?.count ?? 0}
              totalPrice={stats[list.id]?.total ?? 0}
              onDelete={() => handleDelete(list.id)}
              onDuplicate={() => handleDuplicate(list.id)}
            />
          ))}
        </div>
      </main>

      {showCreate && (
        <CreateListModal onClose={() => setShowCreate(false)} onCreate={createList} />
      )}

      <BottomNav />
    </div>
  )
}
