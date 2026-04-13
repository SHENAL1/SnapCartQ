import type { Item } from '../types'

interface ItemRowProps {
  item: Item
  onEdit: () => void
  onDelete: () => void
}

export default function ItemRow({ item, onEdit, onDelete }: ItemRowProps) {
  const subtotal = (item.price ?? 0) * item.quantity

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.quantity > 1 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">×{item.quantity}</span>
          )}
          {item.weight && (
            <span className="text-xs text-gray-400">{item.weight}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 mr-1">
        {item.price != null ? (
          <>
            <p className="font-semibold text-gray-900 text-sm">${subtotal.toFixed(2)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">${item.price.toFixed(2)} ea</p>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-300 italic">no price</p>
        )}
      </div>

      <div className="flex gap-0.5 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          aria-label="Edit item"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
