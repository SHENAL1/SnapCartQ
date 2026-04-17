import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, Copy, SlidersHorizontal } from 'lucide-react'
import { useLists } from '../hooks/useLists'
import { useItems } from '../hooks/useItems'
import ItemRow from '../components/ItemRow'
import BudgetBar from '../components/BudgetBar'
import WeightBar from '../components/WeightBar'
import { BudgetAlert, WeightAlert } from '../components/BudgetAlert'
import AddItemModal from '../components/AddItemModal'
import EditItemModal from '../components/EditItemModal'
import EditListModal from '../components/EditListModal'
import { formatPrice } from '../lib/currencies'
import { formatWeightKg } from '../lib/weight'
import type { Item } from '../types'

type NewItem = { name: string; price: number | null; weight: string | null; quantity: number }

export default function ListDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lists, updateList, duplicateList } = useLists()
  const { items, loading, addItem, updateItem, deleteItem, totalPrice, totalWeightKg } = useItems(id!)

  const [showAdd, setShowAdd] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showEditList, setShowEditList] = useState(false)

  const list = lists.find((l) => l.id === id)
  const currency = list?.currency ?? 'MYR'
  const isOverBudget = list?.budget != null && totalPrice > list.budget
  const isOverWeight = list?.weight_limit != null && totalWeightKg > list.weight_limit

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
      await updateList(list.id, { budget: newBudget })
    } catch {
      alert('Failed to update budget')
    }
  }

  const handleDuplicate = async () => {
    if (!list) return
    try {
      await duplicateList(list.id)
      navigate('/')
    } catch {
      alert('Failed to duplicate list')
    }
  }

  const handleExport = () => {
    if (!list) return
    const lines: string[] = []
    lines.push(`SnapCartQ — ${list.name}`)
    lines.push('='.repeat(40))
    lines.push(`Currency: ${currency}`)
    if (list.budget != null) lines.push(`Budget: ${formatPrice(list.budget, currency)}`)
    if (list.weight_limit != null) lines.push(`Weight Limit: ${formatWeightKg(list.weight_limit)}`)
    lines.push(`Generated: ${new Date().toLocaleDateString()}`)
    lines.push('')
    lines.push('ITEMS')
    lines.push('-'.repeat(40))

    items.forEach((item, i) => {
      const subtotal = (item.price ?? 0) * item.quantity
      let line = `${i + 1}. ${item.name}`
      if (item.quantity > 1) line += ` ×${item.quantity}`
      if (item.weight) line += ` [${item.weight}]`
      line += '\n'
      if (item.price != null) {
        line += `   ${formatPrice(item.price, currency)} ea`
        if (item.quantity > 1) line += ` = ${formatPrice(subtotal, currency)}`
      } else {
        line += `   no price`
      }
      lines.push(line)
    })

    lines.push('')
    lines.push('='.repeat(40))
    lines.push(`TOTAL: ${items.length} item${items.length !== 1 ? 's' : ''} | ${formatPrice(totalPrice, currency)}`)
    if (totalWeightKg > 0) lines.push(`WEIGHT: ${formatWeightKg(totalWeightKg)}`)
    if (isOverBudget && list.budget != null) {
      lines.push(`⚠ Over budget by ${formatPrice(totalPrice - list.budget, currency)}`)
    }
    if (isOverWeight && list.weight_limit != null) {
      lines.push(`⚠ Over weight limit by ${formatWeightKg(totalWeightKg - list.weight_limit)}`)
    }

    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${list.name.replace(/[^a-z0-9]/gi, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <header className="bg-dark sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 -ml-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="font-bold text-white truncate flex-1">
            {list?.name ?? 'Shopping List'}
          </h1>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={handleExport}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Export list"
            >
              <Upload size={17} />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Duplicate list"
            >
              <Copy size={17} />
            </button>
            <button
              onClick={() => setShowEditList(true)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Edit list settings"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-3 py-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Total Items</p>
            <p className="text-xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="px-3 py-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Total Price</p>
            <p className={`text-base font-bold truncate ${isOverBudget ? 'text-red-500' : 'text-gray-900'}`}>
              {formatPrice(totalPrice, currency)}
            </p>
          </div>
          <div className="px-3 py-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Total Weight</p>
            <p className={`text-base font-bold ${isOverWeight ? 'text-red-500' : 'text-gray-900'}`}>
              {totalWeightKg > 0 ? formatWeightKg(totalWeightKg) : '—'}
            </p>
          </div>
        </div>

        {/* Budget bar */}
        {list?.budget != null && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <BudgetBar budget={list.budget} spent={totalPrice} currency={currency} />
            {list.weight_limit != null && (
              <WeightBar limitKg={list.weight_limit} usedKg={totalWeightKg} />
            )}
          </div>
        )}

        {/* Weight bar without budget */}
        {list?.budget == null && list?.weight_limit != null && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <WeightBar limitKg={list.weight_limit} usedKg={totalWeightKg} />
          </div>
        )}

        {/* Alerts */}
        {isOverBudget && list?.budget != null && (
          <BudgetAlert
            budget={list.budget}
            spent={totalPrice}
            currency={currency}
            onExtend={handleExtendBudget}
          />
        )}
        {isOverWeight && list?.weight_limit != null && (
          <WeightAlert limitKg={list.weight_limit} usedKg={totalWeightKg} />
        )}

        {/* Items section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Items</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="text-white font-bold rounded-full px-5 py-2 text-sm"
              style={{ background: '#19bfb7' }}
            >
              + Add
            </button>
          </div>

          {loading && (
            <p className="text-sm text-gray-300 text-center py-8">Loading…</p>
          )}

          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center text-center space-y-3 py-10">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <p className="font-semibold text-gray-600 text-sm">No items yet</p>
                <p className="text-xs text-gray-400 mt-0.5">Add manually or scan a product photo</p>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="text-white font-bold rounded-full px-6 py-2.5 text-sm"
                style={{ background: '#19bfb7' }}
              >
                Add Your First Item
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  currency={currency}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}

              {/* Total row */}
              <div className="flex justify-between items-center pt-3 px-1">
                <span className="text-sm font-semibold text-gray-500">Total</span>
                <span className={`font-bold text-lg ${isOverBudget ? 'text-red-500' : 'text-gray-900'}`}>
                  {formatPrice(totalPrice, currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddItemModal
          currency={currency}
          onClose={() => setShowAdd(false)}
          onAdd={addItem}
          onAddMultiple={handleAddMultiple}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          currency={currency}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => updateItem(editingItem.id, updates)}
        />
      )}

      {showEditList && list && (
        <EditListModal
          list={list}
          onClose={() => setShowEditList(false)}
          onSave={(updates) => updateList(list.id, updates)}
        />
      )}
    </div>
  )
}
