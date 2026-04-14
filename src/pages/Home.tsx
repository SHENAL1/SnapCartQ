import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-dark sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white tracking-tight">SnapCartQ</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-500 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-indigo-600 active:scale-95 transition-all"
          >
            + New List
          </button>
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
