import { formatPrice } from '../lib/currencies'

interface BudgetBarProps {
  budget: number
  spent: number
  currency: string
}

export default function BudgetBar({ budget, spent, currency }: BudgetBarProps) {
  const percentage = Math.min((spent / budget) * 100, 100)
  const isOver = spent > budget
  const isWarning = !isOver && percentage > 80

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 font-medium">Budget</span>
        <span className={isOver ? 'text-red-600 font-semibold' : 'text-gray-700'}>
          {formatPrice(spent, currency)} / {formatPrice(budget, currency)}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-xs text-amber-600">{Math.round(100 - percentage)}% remaining</p>
      )}
    </div>
  )
}
