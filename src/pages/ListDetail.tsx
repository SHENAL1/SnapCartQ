import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLists } from '../hooks/useLists'
import { useItems } from '../hooks/useItems'
import ItemRow from '../components/ItemRow'
import BudgetBar from '../components/BudgetBar'
import BudgetAlert from '../components/BudgetAlert'
import AddItemModal from '../components/AddItemModal'
import EditItemModal from '../components/EditItemModal'
import type { Item } from '../types'

type NewItem = { name: string; price: number | null; weight: string | null; quantity: number }

export default function ListDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lists, updateListBudget } = useLists()
  const { items, loading, addItem, updateItem, deleteItem, totalPrice } = useItems(id!)

  const [showAdd, setShowAdd] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const list = lists.find((l) => l.id === id)
  const isOverBudget = list?.budget != null && totalPrice > list.budget
  const weightedItems = items.filter((i) => i.weight)

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Remove this item?')) return
    try {
      await deleteItem(itemId)
    } catch {
      alert('Failed to delete item')
    }
  }

  const handleAddMultiple = async (newItems: NewItem[]) => {
    for (const item of newItems) {
      await addItem(item)
    }
  }

  const handleExtendBudget = async (newBudget: number) => {
    if (!list) return
    try {
      await updateListBudget(list.id, newBudget)
    } catch {
      alert('Failed to update budget')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-bold text-gray-900 truncate flex-1">
            {list?.name ?? 'Shopping List'}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Items</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-indigo-600'}`}>
              ${totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{weightedItems.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">With weight</p>
          </div>
        </div>

        {/* Budget bar */}
        {list?.budget != null && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <BudgetBar budget={list.budget} spent={totalPrice} />
          </div>
        )}

        {/* Budget alert */}
        {isOverBudget && list?.budget != null && (
          <BudgetAlert
            budget={list.budget}
            spent={totalPrice}
            onExtend={handleExtendBudget}
          />
        )}

        {/* Items card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Items</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-indigo-600 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-indigo-700 active:scale-95 transition-all"
            >
              + Add
            </button>
          </div>

          {loading && (
            <p className="px-4 pb-4 text-sm text-gray-300">Loading…</p>
          )}

          {!loading && items.length === 0 && (
            <div className="px-4 pb-6 pt-1 text-center">
              <p className="text-gray-300 text-sm">No items yet</p>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-600"
              >
                Add your first item →
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="px-4 pb-3">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
              {/* Total row */}
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className={`font-bold text-lg ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onAdd={addItem}
          onAddMultiple={handleAddMultiple}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => updateItem(editingItem.id, updates)}
        />
      )}
    </div>
  )
}
