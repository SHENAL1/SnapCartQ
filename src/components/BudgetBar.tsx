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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
          {formatPrice(spent, currency)} / {formatPrice(budget, currency)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: isOver ? '#ef4444' : isWarning ? '#f59e0b' : '#19bfb7',
          }}
        />
      </div>
    </div>
  )
}
