import { useState } from 'react'
import Modal from './Modal'
import { CURRENCIES } from '../lib/currencies'
import type { ShoppingList } from '../types'

interface EditListModalProps {
  list: ShoppingList
  onClose: () => void
  onSave: (updates: { name: string; budget: number | null; currency: string; weight_limit: number | null }) => Promise<void>
}

export default function EditListModal({ list, onClose, onSave }: EditListModalProps) {
  const [name, setName] = useState(list.name)
  const [budget, setBudget] = useState(list.budget?.toString() ?? '')
  const [currency, setCurrency] = useState(list.currency ?? 'MYR')
  const [weightLimit, setWeightLimit] = useState(list.weight_limit?.toString() ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      await onSave({
        name: name.trim(),
        budget: budget ? parseFloat(budget) : null,
        currency,
        weight_limit: weightLimit ? parseFloat(weightLimit) : null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Edit List" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">List Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Budget <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Weight Limit (kg) <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            value={weightLimit}
            onChange={(e) => setWeightLimit(e.target.value)}
            placeholder="e.g. 7.5"
            min="0"
            step="0.1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full text-white font-bold rounded-full py-3.5 disabled:opacity-50 transition-opacity text-sm"
          style={{ background: '#19bfb7' }}
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  )
}
