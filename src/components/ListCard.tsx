import { useNavigate } from 'react-router-dom'
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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md active:scale-[0.99] transition-all"
      onClick={() => navigate(`/list/${list.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{list.name}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">{currency}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="p-1.5 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
            aria-label="Duplicate list"
            title="Duplicate list"
          >
            📋
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete list"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className={`text-xl font-bold ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
          {formatPrice(totalPrice, currency)}
        </p>
        {list.budget != null && (
          <p className="text-sm text-gray-400">of {formatPrice(list.budget, currency)}</p>
        )}
      </div>

      {list.budget != null && (
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isOver ? 'bg-red-500' : budgetPct > 80 ? 'bg-amber-400' : 'bg-indigo-500'
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      )}
    </div>
  )
}
