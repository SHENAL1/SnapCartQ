import { useNavigate } from 'react-router-dom'
import { Copy, Trash2 } from 'lucide-react'
import { formatPrice } from '../lib/currencies'
import type { ShoppingList } from '../types'

interface ListCardProps {
  list: ShoppingList
  itemCount: number
  totalPrice: number
  onDelete: () => void
  onDuplicate: () => void
}

export default function ListCard({ list, itemCount, totalPrice, onDelete, onDuplicate }: ListCardProps) {
  const navigate = useNavigate()
  const currency = list.currency ?? 'MYR'
  const isOver = list.budget != null && totalPrice > list.budget
  const budgetPct = list.budget ? Math.min((totalPrice / list.budget) * 100, 100) : 0

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer active:scale-[0.99] transition-all"
      onClick={() => navigate(`/list/${list.id}`)}
    >
      {/* Top row: name + actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm">{list.name}</h3>
            <span
              className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full shrink-0"
              style={{ background: '#1e2022' }}
            >
              {currency}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Duplicate list"
          >
            <Copy size={15} stroke="#9ca3af" strokeWidth={1.8} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete list"
          >
            <Trash2 size={15} stroke="#9ca3af" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Total + budget */}
      <div className="flex items-end justify-between mb-3">
        <p className={`text-xl font-bold ${isOver ? 'text-red-500' : 'text-gray-900'}`}>
          {formatPrice(totalPrice, currency)}
        </p>
        {list.budget != null && (
          <p className="text-xs text-gray-400">of {formatPrice(list.budget, currency)}</p>
        )}
      </div>

      {/* Progress bar */}
      {list.budget != null && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${budgetPct}%`,
              background: isOver ? '#ef4444' : budgetPct > 80 ? '#f59e0b' : '#19bfb7',
            }}
          />
        </div>
      )}
    </div>
  )
}
