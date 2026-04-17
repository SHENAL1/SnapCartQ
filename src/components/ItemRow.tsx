import { Pencil, Trash2 } from 'lucide-react'
import { formatPrice } from '../lib/currencies'
import type { Item } from '../types'

interface ItemRowProps {
  item: Item
  currency: string
  onEdit: () => void
  onDelete: () => void
}

export default function ItemRow({ item, currency, onEdit, onDelete }: ItemRowProps) {
  const subtotal = (item.price ?? 0) * item.quantity

  // Build dot-separated meta string
  const meta: string[] = []
  if (item.price != null) meta.push(formatPrice(item.price, currency))
  if (item.weight) meta.push(item.weight)
  if (item.quantity > 1) meta.push(`×${item.quantity}`)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Top row: name + action buttons */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-bold text-gray-900 text-sm leading-snug flex-1 min-w-0">{item.name}</p>
        <div className="flex items-center gap-1 shrink-0 -mt-0.5">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Edit item"
          >
            <Pencil size={14} stroke="#9ca3af" strokeWidth={2} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: '#fef2f2' }}
            aria-label="Delete item"
          >
            <Trash2 size={14} stroke="#f87171" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Meta: price · weight · qty */}
      {meta.length > 0 && (
        <p className="text-xs text-gray-400 mb-2">{meta.join(' · ')}</p>
      )}

      {/* Subtotal row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">Subtotal</span>
        <span className="text-sm font-bold text-gray-900">
          {item.price != null ? formatPrice(subtotal, currency) : '—'}
        </span>
      </div>
    </div>
  )
}
