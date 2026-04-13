import { useState } from 'react'
import Modal from './Modal'
import { getCurrencySymbol } from '../lib/currencies'
import type { Item } from '../types'

interface EditItemModalProps {
  item: Item
  currency: string
  onClose: () => void
  onSave: (updates: { name: string; price: number | null; weight: string | null; quantity: number }) => Promise<unknown>
}

export default function EditItemModal({ item, currency, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState(item.name)
  const [price, setPrice] = useState(item.price?.toString() ?? '')
  const [weight, setWeight] = useState(item.weight ?? '')
  const [quantity, setQuantity] = useState(item.quantity.toString())
  const [loading, setLoading] = useState(false)
  const sym = getCurrencySymbol(currency)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await onSave({
        name: name.trim(),
        price: price ? parseFloat(price) : null,
        weight: weight.trim() || null,
        quantity: Math.max(1, parseInt(quantity) || 1),
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Edit Item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">{sym}</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 200g"
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-indigo-600 text-white font-semibold rounded-xl py-3 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  )
}
