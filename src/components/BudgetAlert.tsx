import { formatPrice } from '../lib/currencies'
import { formatWeightKg } from '../lib/weight'

interface BudgetAlertProps {
  budget: number
  spent: number
  currency: string
  onExtend: (newBudget: number) => void
}

interface WeightAlertProps {
  limitKg: number
  usedKg: number
}

export function BudgetAlert({ budget, spent, currency, onExtend }: BudgetAlertProps) {
  const overage = spent - budget
  const suggestedBudget = Math.ceil(spent / 10) * 10

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl mt-0.5">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-red-800 text-sm">
          Budget exceeded by {formatPrice(overage, currency)}
        </p>
        <p className="text-xs text-red-600 mt-0.5">
          Spent {formatPrice(spent, currency)} of {formatPrice(budget, currency)} budget
        </p>
        <button
          onClick={() => onExtend(suggestedBudget)}
          className="mt-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors"
        >
          Extend to {formatPrice(suggestedBudget, currency)}
        </button>
      </div>
    </div>
  )
}

export function WeightAlert({ limitKg, usedKg }: WeightAlertProps) {
  const overKg = usedKg - limitKg
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl mt-0.5">⚖️</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-orange-800 text-sm">
          Weight limit exceeded by {formatWeightKg(overKg)}
        </p>
        <p className="text-xs text-orange-600 mt-0.5">
          {formatWeightKg(usedKg)} used of {formatWeightKg(limitKg)} limit
        </p>
      </div>
    </div>
  )
}

// Keep default export for backward compatibility
export default BudgetAlert
