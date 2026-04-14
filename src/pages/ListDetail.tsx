import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleExport}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
              title="Export list"
            >
              📤
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
              title="Duplicate list"
            >
              📋
            </button>
            <button
              onClick={() => setShowEditList(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
              title="Edit list settings"
            >
              ⚙️
            </button>
          </div>
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
            <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-indigo-600'}`}>
              {formatPrice(totalPrice, currency)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            {list?.weight_limit != null ? (
              <>
                <p className={`text-sm font-bold ${isOverWeight ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatWeightKg(totalWeightKg)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Weight</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900">{weightedItems.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">With weight</p>
              </>
            )}
          </div>
        </div>

        {/* Budget bar */}
        {list?.budget != null && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <BudgetBar budget={list.budget} spent={totalPrice} currency={currency} />
            {list.weight_limit != null && (
              <WeightBar limitKg={list.weight_limit} usedKg={totalWeightKg} />
            )}
          </div>
        )}

        {/* Weight bar without budget */}
        {list?.budget == null && list?.weight_limit != null && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
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
            <div className="px-4 pb-8 pt-2 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">No items yet</p>
                <p className="text-xs text-gray-400 mt-0.5">Add manually or scan a product photo</p>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-indigo-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all"
              >
                Add Your First Item
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="px-4 pb-3">
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
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className={`font-bold text-lg ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
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
